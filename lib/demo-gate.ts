// ============================================================================
// Trace demo — gate helpers (D1 side)
// ----------------------------------------------------------------------------
// demo 跑在 Vercel 上，访问码和访问日志在 Cloudflare D1 trace-angels 里（和 deck
// 同一个库、同一张 deck_codes 表），所以这里走 D1 的 HTTP 接口，不是 Worker 绑定。
//
// 需要三个环境变量（Vercel 和 .env.local 都要）：
//   CF_ACCOUNT_ID       Cloudflare 账号 ID
//   CF_D1_DATABASE_ID   trace-angels 的 database_id（和 deck 的 wrangler.toml 一致）
//   CF_D1_TOKEN         只有 "D1 Edit" 权限的 API token
// 缺任何一个就当没有 DB：通用密码照常可用，?c= 链接不放行，也不记日志，不报错。
// ============================================================================

const D1_API = 'https://api.cloudflare.com/client/v4';
const D1_TIMEOUT_MS = 4000;

export type Who = {
  who: string;      // 'password' | 'code:ox' | 'badcode:xxx'
  via: string;      // 'password' | 'link' | 'cookie'
  code?: string;
  name?: string;
  net?: string;
  kind?: string;
};

export type CodeRow = { code: string; kind: string; name: string | null; network: string | null };

export function dbConfigured(): boolean {
  return !!(process.env.CF_ACCOUNT_ID && process.env.CF_D1_DATABASE_ID && process.env.CF_D1_TOKEN);
}

async function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[] | null> {
  if (!dbConfigured()) return null;
  try {
    const res = await fetch(
      `${D1_API}/accounts/${process.env.CF_ACCOUNT_ID}/d1/database/${process.env.CF_D1_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${process.env.CF_D1_TOKEN}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
        cache: 'no-store',
        signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(D1_TIMEOUT_MS) : undefined,
      }
    );
    if (!res.ok) {
      console.error('d1 query failed', res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const data = (await res.json()) as { success?: boolean; result?: { results?: T[] }[] };
    if (!data.success) {
      console.error('d1 query not ok', JSON.stringify(data).slice(0, 300));
      return null;
    }
    return data.result?.[0]?.results ?? [];
  } catch (e) {
    console.error('d1 query threw', e);
    return null;
  }
}

// ---------------------------------------------------------------- codes

// 'Anna', ' ANNA ', 'Ánna' 和 'an-na' 都归一成 'anna'，与 deck 的规则一致
export function normCode(s: string): string {
  return String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 40);
}

export async function findCode(code: string): Promise<CodeRow | null> {
  if (!code) return null;
  const rows = await query<CodeRow>(
    'SELECT code, kind, name, network FROM deck_codes WHERE code = ? AND active = 1',
    [code]
  );
  return rows && rows.length ? rows[0] : null;
}

export function fromRow(row: CodeRow, via: 'link' | 'cookie'): Who {
  return { who: 'code:' + row.code, via, code: row.code, name: row.name || '', net: row.network || '', kind: row.kind };
}

// 15 分钟内同一 IP 试错了多少个码
export async function misses(ip: string): Promise<number> {
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const rows = await query<{ n: number }>(
    "SELECT COUNT(*) AS n FROM demo_visits WHERE event = 'badcode' AND ip = ? AND visited_at > ?",
    [ip, since]
  );
  return rows && rows[0] ? Number(rows[0].n) || 0 : 0;
}

// ---------------------------------------------------------------- visits

export function clientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for') || '';
  return (xff.split(',')[0] || headers.get('x-real-ip') || '').trim();
}

export async function logVisit(headers: Headers, who: Who, event: 'open' | 'gate' | 'badcode', path: string | null): Promise<void> {
  if (!dbConfigured()) return;
  await query(
    'INSERT INTO demo_visits (who, via, name, network, event, path, visited_at, ip, country, city, user_agent, referer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      who.who,
      who.via || null,
      who.name || null,
      who.net || null,
      event,
      String(path || '').slice(0, 200),
      new Date().toISOString(),
      clientIp(headers),
      headers.get('x-vercel-ip-country') || '',
      decodeURIComponent(headers.get('x-vercel-ip-city') || ''),
      (headers.get('user-agent') || '').slice(0, 400),
      (headers.get('referer') || '').slice(0, 400),
    ]
  );
}

// 只把"人打开一个页面"算一次：GET、浏览器导航（accept 里有 text/html）、不是 RSC/预取、不是静态文件。
export function isPageRequest(method: string, pathname: string, headers: Headers): boolean {
  if (method !== 'GET') return false;
  if (!(headers.get('accept') || '').includes('text/html')) return false;
  if (headers.get('rsc') || headers.get('next-router-prefetch')) return false;
  const purpose = headers.get('sec-purpose') || headers.get('purpose') || '';
  if (purpose.includes('prefetch')) return false;
  if (/\.[a-z0-9]{1,8}$/i.test(pathname)) return false;
  return true;
}

// ---------------------------------------------------------------- code cookie / crypto

// 码 cookie 的格式是 code.<code>.<hmac>，HMAC 的密钥是 AUTH_TOKEN：换 AUTH_TOKEN 两条路的 cookie 一起作废。
export async function codeMac(secret: string, code: string): Promise<string> {
  return hmacHex(secret, 'trace-demo:code:' + code);
}

export async function codeToken(secret: string, code: string): Promise<string> {
  return 'code.' + code + '.' + (await codeMac(secret, code));
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// 登录后只允许跳回站内路径，挡掉 //evil.com 这类开放跳转
export function safeFrom(from: unknown): string {
  const s = String(from || '');
  return s.startsWith('/') && !s.startsWith('//') && !s.startsWith('/login') && !s.startsWith('/api') ? s : '/';
}
