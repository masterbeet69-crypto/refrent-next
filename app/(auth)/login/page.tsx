'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');
  const router   = useRouter();
  const params   = useSearchParams();
  const nextPath = params.get('next') ?? '/user/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setErr(d.error ?? 'Erreur de connexion.');
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div
      className="w-full max-w-sm rounded-2xl"
      style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,.10)' }}
    >
      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid #E8E4DF' }}>
        <div
          className="flex-1 py-4 text-center text-sm font-medium"
          style={{ color: '#1A1714', borderBottom: '2px solid #2A5C45' }}
        >
          Connexion
        </div>
        <Link
          href="/register"
          className="flex-1 py-4 text-center text-sm font-medium transition-colors"
          style={{ color: '#8A837C' }}
        >
          S&apos;inscrire
        </Link>
      </div>

      {/* Form */}
      <div className="p-8">
        <h1
          className="text-2xl mb-6"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
        >
          Bon retour !
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Field
            label="Mot de passe"
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
            autoComplete="current-password"
          />

          {err && (
            <p className="text-sm" style={{ color: '#9B1C1C' }}>{err}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-medium transition-opacity"
            style={{ backgroundColor: '#2A5C45', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: '#8A837C' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" className="font-medium" style={{ color: '#2A5C45' }}>
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: '#1A1714' }}>
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm"
        style={{
          border: `1px solid ${focused ? '#2A5C45' : '#E8E4DF'}`,
          color: '#1A1714',
          backgroundColor: '#FFFFFF',
        }}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      />
    </div>
  );
}
