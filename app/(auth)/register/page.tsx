'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AFRICA_REGIONS } from '@/lib/utils/country';

const ALLOWED_ROLES = [
  { value: 'user',  label: 'Particulier' },
  { value: 'agent', label: 'Agent immobilier' },
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
    setErr('');
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
    <div
      className="w-full max-w-md rounded-2xl"
      style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,.10)' }}
    >
      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid #E8E4DF' }}>
        <Link
          href="/login"
          className="flex-1 py-4 text-center text-sm font-medium transition-colors"
          style={{ color: '#8A837C' }}
        >
          Connexion
        </Link>
        <div
          className="flex-1 py-4 text-center text-sm font-medium"
          style={{ color: '#1A1714', borderBottom: '2px solid #2A5C45' }}
        >
          S&apos;inscrire
        </div>
      </div>

      {/* Form */}
      <div className="p-8">
        <h1
          className="text-2xl mb-6"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
        >
          Créer un compte
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Nom complet"
            value={form.full_name}
            onChange={set('full_name')}
            required
            autoComplete="name"
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            autoComplete="email"
          />
          <Field
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={set('password')}
            required
            minLength={8}
            autoComplete="new-password"
          />

          {/* Role */}
          <SelectField label="Rôle">
            <select
              value={form.role}
              onChange={set('role')}
              className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
              style={{ border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' }}
            >
              {ALLOWED_ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </SelectField>

          {/* Country + City */}
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Pays">
              <select
                value={form.country_code}
                onChange={handleCountryChange}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                style={{ border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' }}
              >
                {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
                  <option key={cc} value={cc}>{r.name}</option>
                ))}
              </select>
            </SelectField>
            <SelectField label="Ville">
              <select
                value={form.city_code}
                onChange={set('city_code')}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                style={{ border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' }}
              >
                {cities.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </SelectField>
          </div>

          {err && (
            <p className="text-sm" style={{ color: '#9B1C1C' }}>{err}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-medium transition-opacity"
            style={{ backgroundColor: '#2A5C45', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Création du compte…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: '#8A837C' }}>
          Déjà un compte ?{' '}
          <Link href="/login" className="font-medium" style={{ color: '#2A5C45' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
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

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: '#1A1714' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
