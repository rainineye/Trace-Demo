"use client";

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const colors = {
  paper: "#FAF8F3",
  paperDeep: "#F2EEE4",
  ink: "#1A1A1A",
  inkSoft: "#5A5147",
  inkMute: "#9D968B",
  primary: "#A03A2C",
  rule: "#D9D4C7",
  ruleSoft: "#E8E3D6",
};

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(from);
    } else {
      setError('Incorrect password');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.paper,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: "'Instrument Sans', sans-serif",
      color: colors.ink,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Masthead mark */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 56,
          paddingBottom: 16,
          borderBottom: `1px solid ${colors.rule}`,
        }}>
          <div style={{
            width: 10, height: 10,
            background: colors.primary,
            borderRadius: '50%',
          }}/>
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: -0.3,
          }}>Trace</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: colors.inkMute,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginLeft: 'auto',
          }}>Case file 001 · v0.3</span>
        </div>

        {/* Editorial eyebrow */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: colors.primary,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          fontWeight: 500,
          marginBottom: 14,
        }}>
          Restricted access
        </div>

        {/* Title with accent bar */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 14,
          marginBottom: 20,
        }}>
          <div style={{
            width: 3,
            background: colors.primary,
            flexShrink: 0,
          }}/>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 32,
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: -0.5,
            lineHeight: 1.2,
            margin: 0,
          }}>
            This case file is closed to the public.
          </h1>
        </div>

        <p style={{
          fontSize: 14.5,
          lineHeight: 1.6,
          color: colors.inkSoft,
          marginBottom: 40,
        }}>
          Enter the access password to view the Nord Stream attribution demo.
          If you were invited, the sender will have shared it with you.
        </p>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <label style={{
            display: 'block',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            letterSpacing: 0.9,
            textTransform: 'uppercase',
            color: colors.inkMute,
            marginBottom: 8,
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoFocus
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 15,
              color: colors.ink,
              background: colors.paperDeep,
              border: `1px solid ${error ? colors.primary : colors.rule}`,
              borderRadius: 2,
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = colors.inkSoft; }}
            onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = colors.rule; }}
          />

          {error && (
            <div style={{
              marginTop: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: colors.primary,
              letterSpacing: 0.6,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              marginTop: 24,
              width: '100%',
              padding: '13px 16px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              letterSpacing: 1,
              textTransform: 'uppercase',
              background: loading || !password ? colors.rule : colors.ink,
              color: colors.paper,
              border: 'none',
              borderRadius: 2,
              cursor: loading || !password ? 'default' : 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { if (!loading && password) e.currentTarget.style.background = colors.primary; }}
            onMouseLeave={(e) => { if (!loading && password) e.currentTarget.style.background = colors.ink; }}
          >
            {loading ? 'Verifying…' : 'Enter case file'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 80,
          paddingTop: 20,
          borderTop: `1px solid ${colors.ruleSoft}`,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9.5,
          color: colors.inkMute,
          letterSpacing: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>Demo preview · not for distribution</span>
          <span>0xmian</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FAF8F3' }} />}>
      <LoginPageInner />
    </Suspense>
  );
}
