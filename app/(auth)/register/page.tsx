'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { AFRICA_REGIONS } from '@/lib/utils/country';

const ALLOWED_ROLES = [
  { value: 'user',       label: 'Particulier' },
  { value: 'agent',      label: 'Agent immobilier' },
  { value: 'advertiser', label: 'Annonceur' },
];

type FormState = {
  full_name: string;
  email: string;
  password: string;
  role: string;
  country_code: string;
  city_code: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    full_name: '', email: '', password: '',
    role: 'user', country_code: 'BJ', city_code: 'CTN',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');
  const router = useRouter();

  const region = AFRICA_REGIONS[form.country_code as keyof typeof AFRICA_REGIONS];
  const cities = region ? Object.entries(region.cities) : [];

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const cc = e.target.value;
    const newRegion = AFRICA_REGIONS[cc as keyof typeof AFRICA_REGIONS];
    const firstCity = newRegion ? Object.keys(newRegion.cities)[0] : '';
    setForm(f => ({ ...f, country_code: cc, city_code: firstCity }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json();
      setErr(d.error ?? "Erreur lors de l'inscription.");
      setLoading(false);
      return;
    }
    // Auto-login
    const loginRes = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    setLoading(false);
    if (loginRes.ok) {
      router.push(`/${form.role}/dashboard`);
      router.refresh();
    } else {
      router.push('/login');
    }
  }

  return (
    <div className="bg-surf rounded-r3 shadow-sh2 p-8 w-full max-w-md">
      <h1 className="font-display text-2xl text-ink mb-6">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nom complet" value={form.full_name} onChange={set('full_name')} required />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        <Input label="Mot de passe" type="password" value={form.password} onChange={set('password')} required minLength={8} autoComplete="new-password" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink2">Rôle</label>
          <select
            value={form.role}
            onChange={set('role')}
            className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc"
          >
            {ALLOWED_ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink2">Pays</label>
            <select
              value={form.country_code}
              onChange={handleCountryChange}
              className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc"
            >
              {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
                <option key={cc} value={cc}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink2">Ville</label>
            <select
              value={form.city_code}
              onChange={set('city_code')}
              className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc"
            >
              {cities.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          S&apos;inscrire
        </Button>
      </form>
      <p className="text-sm text-ink3 mt-4 text-center">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-acc hover:underline">
          Se connecter
        </Link>
      </p>
      {err && <Toast message={err} type="error" onClose={() => setErr('')} />}
    </div>
  );
}
