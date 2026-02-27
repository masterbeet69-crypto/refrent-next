'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

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
    <div className="bg-surf rounded-r3 shadow-sh2 p-8 w-full max-w-sm">
      <h1 className="font-display text-2xl text-ink mb-6">Connexion</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Mot de passe"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" loading={loading} className="w-full">
          Se connecter
        </Button>
      </form>
      <p className="text-sm text-ink3 mt-4 text-center">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-acc hover:underline">
          S&apos;inscrire
        </Link>
      </p>
      {err && <Toast message={err} type="error" onClose={() => setErr('')} />}
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
