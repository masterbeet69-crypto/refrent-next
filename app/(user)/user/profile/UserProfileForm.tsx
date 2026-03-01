'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';

interface Props {
  profile: {
    id: string;
    full_name: string | null;
    phone: string | null;
    country_code: string | null;
    city_code: string | null;
    role: string;
  };
}

export function UserProfileForm({ profile }: Props) {
  const router = useRouter();
  const [fullName, setFullName]   = useState(profile.full_name ?? '');
  const [phone, setPhone]         = useState(profile.phone ?? '');
  const [countryCode, setCountry] = useState(profile.country_code ?? '');
  const [cityCode, setCity]       = useState(profile.city_code ?? '');
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState('');

  const inputStyle = { border: '1px solid #E8E4DF', color: '#1A1714' };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/v1/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, phone, country_code: countryCode, city_code: cityCode }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? 'Erreur lors de la sauvegarde.');
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl p-6 space-y-5"
      style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
    >
      {/* Role badge */}
      <div className="flex items-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
          style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
        >
          {profile.role}
        </span>
      </div>

      {/* Full name */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
          Nom complet
        </label>
        <input
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Jean Dupont"
          className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
          Téléphone
        </label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+229 XX XX XX XX"
          className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
          style={inputStyle}
        />
      </div>

      {/* Country + City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Code pays
          </label>
          <input
            value={countryCode}
            onChange={e => setCountry(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="BJ"
            maxLength={2}
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Code ville
          </label>
          <input
            value={cityCode}
            onChange={e => setCity(e.target.value.toUpperCase().slice(0, 5))}
            placeholder="CTN"
            maxLength={5}
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>

      {error && <p className="text-sm" style={{ color: '#9B1C1C' }}>{error}</p>}

      <button
        type="submit"
        disabled={saving || saved}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium"
        style={{ backgroundColor: saved ? '#2A5C45' : '#1A1714', opacity: saving ? 0.7 : 1 }}
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? 'Enregistré !' : saving ? 'Enregistrement…' : 'Sauvegarder'}
      </button>
    </form>
  );
}
