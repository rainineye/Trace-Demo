# Trace · Case File 001

> Who attacked the Nord Stream pipelines on 26 September 2022?

An editorial-style interactive visualization of claim attribution under the **Trace protocol v0.3**, applied to the Nord Stream pipeline sabotage. Replay the evidence timeline from February 2023 to today, watch the candidate distribution evolve, and see why the protocol refuses to close the case.

🔗 **Live demo:** [demo.0xmian.com](https://demo.0xmian.com) *(password required)*

---

## What this is

A single-page artifact that turns a contested real-world attribution question into a structured, auditable visual record:

- **Evidence graph** — 16 evidence nodes connected to 8 candidate perpetrators through weighted edges. Supporting edges are solid red, opposing edges dashed grey, correlated-source clusters marked with dashed rings.
- **Timeline replay** — 12 time points from the first Hersh allegation to the present. Scrub manually or hit play to watch the distribution shift in real time.
- **Current understanding** — a running editorial caption that describes what the state of the case means at each point, in plain English.
- **Attribution readout** — explains why the leading hypothesis at 28.7% cannot be read as 28.7% confidence, and why five promotion gates block the claim from being closed.
- **Sanity check** — side-by-side comparison with Grok's unstructured prose summary of the same question, showing where a protocol and a narrative converge and where they differ.
- **Acknowledged limits** — four known boundaries of the v0.3 protocol, surfaced in the artifact itself rather than hidden in a spec.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Language | JavaScript / JSX |
| Runtime | React 19 |
| Styling | Inline style (no CSS framework) |
| Fonts | Fraunces (serif), Instrument Sans (sans), JetBrains Mono (mono) |
| Auth | Cookie-based session with HTTP-only cookie |
| Hosting | **Vercel** |
| Domain | Vercel DNS |

---

## Local development

### Prerequisites

- Node.js 18+
- npm (comes with Node)
- Git

### Setup

```bash
git clone <this-repo>
cd trace-demo
npm install
```

### Environment variables

Create `.env.local` in the project root:

```
AUTH_PASSWORD=your-demo-password
AUTH_TOKEN=a-long-random-string
```

- `AUTH_PASSWORD` — what users type on the login page
- `AUTH_TOKEN` — what gets stored in the auth cookie (any long random string; changing it invalidates all existing sessions)

Generate a strong token:

```bash
openssl rand -hex 32
```

### Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Should redirect to `/login`. Enter `AUTH_PASSWORD` to get in.

---

## Project structure

```
trace-demo/
├── app/
│   ├── TraceCaseFile.jsx    # Main artifact — the entire visualization
│   ├── page.js              # Home route, renders TraceCaseFile
│   ├── layout.js            # Root HTML layout
│   ├── globals.css          # Minimal reset only
│   ├── login/
│   │   └── page.jsx         # Editorial-style password page
│   └── api/
│       └── auth/
│           └── route.js     # POST /api/auth — validates password, sets cookie
├── middleware.js            # Gates all routes behind auth cookie
├── .env.local               # Local env vars (gitignored)
└── package.json
```

---

## Design notes

- **Editorial, not dashboard.** No chrome, no toolbars, no settings menus. The artifact reads like a long-form article with an interactive graph embedded in it, not a data tool.
- **Inline styles.** Every visual decision is colocated with the component that renders it. No CSS files, no Tailwind, no theme provider. This makes the whole design legible and modifiable from a single file.
- **Paper palette.** Background `#FAF8F3` (warm cream, not stark white), ink `#1A1A1A` (not pure black), primary `#A03A2C` (muted editorial red, not safety-warning red).
- **Three font families, three jobs:**
  - *Fraunces* (serif, italic) — headlines, editorial captions, Grok key quotes
  - *Instrument Sans* (sans) — body prose, UI labels
  - *JetBrains Mono* (mono) — metadata, C-codes, timestamps, small caps

---

## Known limits

The protocol itself declares four acknowledged limits — see the **Acknowledged limits** section inside the artifact. The deployment has its own limits:

- **Single shared password.** All authorized viewers share one credential. Not suitable for per-user access control or audit logging.
- **Basic session management.** Cookie-only; no refresh tokens, no logout endpoint in the UI, no session revocation.
- **No rate limiting on `/api/auth`.** A determined attacker could brute-force the password. For anything beyond a small preview audience, add rate limiting (Upstash Ratelimit or Vercel's edge config).
- **No analytics, no logging.** Visits are not tracked. Add Vercel Analytics or Plausible if you want viewership data.

---

## Attribution

Trace protocol spec v0.3 and Nord Stream case file compiled by [0xmian](https://0xmian.com).

Evidence references drawn from public reporting in *The New York Times*, *The Washington Post*, *Der Spiegel*, *Die Zeit*, *The Wall Street Journal*, *ARD*, *Süddeutsche Zeitung*, *Weltwoche*, and official statements from the German, Swedish, Danish, Italian, and Polish governments.

The Grok comparison block captures a response from xAI's Grok model, retrieved April 2026, reproduced for the purpose of methodological contrast.

---

## License

Private preview. Not for redistribution.
