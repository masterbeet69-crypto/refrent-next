'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AFRICA_REGIONS } from '@/lib/utils/country';

const PROPERTY_TYPES = [
  { value: 'furnished',   label: 'Meublé' },
  { value: 'unfurnished', label: 'Non meublé' },
  { value: 'studio',      label: 'Studio' },
  { value: 'villa',       label: 'Villa' },
  { value: 'office',      label: 'Bureau' },
  { value: 'commercial',  label: 'Commercial' },
];

const STATUSES = [
  { value: 'available',   label: 'Disponible' },
  { value: 'reserved',    label: 'Réservé' },
  { value: 'occupied',    label: 'Occupé' },
  { value: 'unavailable', label: 'Indisponible' },
];

export default function PublishPage() {
  const [country, setCountry]   = useState('BJ');
  const [city, setCity]         = useState('CTN');
  const [type, setType]         = useState('furnished');
  const [status, setStatus]     = useState('available');
  const [price, setPrice]       = useState('');
  const [rooms, setRooms]       = useState('');
  const [district, setDistrict] = useState('');
  const [desc, setDesc]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const region = AFRICA_REGIONS[country as keyof typeof AFRICA_REGIONS];
  const cities = region ? Object.entries(region.cities) : [];

  function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const cc = e.target.value;
    const reg = AFRICA_REGIONS[cc as keyof typeof AFRICA_REGIONS];
    setCountry(cc);
    setCity(reg ? Object.keys(reg.cities)[0] : '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/v1/agent/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country_code:  country,
        city_code:     city,
        property_type: type,
        status,
        price:    price    ? parseFloat(price) : null,
        rooms:    rooms    ? parseInt(rooms, 10) : null,
        district: district || null,
        description: desc || null,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const d = await res.json();
      setToast({ message: d.error ?? 'Erreur lors de la publication.', type: 'error' });
      return;
    }
    const { property } = await res.json();
    setToast({ message: `Bien publié : ${property.ref_code}`, type: 'success' });
    setTimeout(() => router.push('/agent/properties'), 2000);
  }

  const sel = "w-full px-4 py-3 rounded-xl outline-none text-sm";
  const selStyle = { border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' };

  return (
    <div className="max-w-lg">
      <h1
        className="text-2xl mb-8"
        style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
      >
        Publier un bien
      </h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-4"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pays">
            <select value={country} onChange={handleCountryChange} className={sel} style={selStyle}>
              {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
                <option key={cc} value={cc}>{r.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Ville">
            <select value={city} onChange={e => setCity(e.target.value)} className={sel} style={selStyle}>
              {cities.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Type de bien">
            <select value={type} onChange={e => setType(e.target.value)} className={sel} style={selStyle}>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Statut initial">
            <select value={status} onChange={e => setStatus(e.target.value)} className={sel} style={selStyle}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Prix (FCFA)" type="number" value={price}
            onChange={e => setPrice(e.target.value)} placeholder="150000"
          />
          <TextField
            label="Pièces" type="number" value={rooms}
            onChange={e => setRooms(e.target.value)} placeholder="3" min={1} max={20}
          />
        </div>

        <TextField
          label="Quartier / District" value={district}
          onChange={e => setDistrict(e.target.value)} placeholder="Akpakpa"
        />

        <Field label="Description">
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none"
            style={{ border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' }}
            placeholder="Description optionnelle du bien..."
          />
        </Field>

        {toast && (
          <p className="text-sm" style={{ color: toast.type === 'error' ? '#9B1C1C' : '#2A5C45' }}>
            {toast.message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-white font-medium transition-opacity"
          style={{ backgroundColor: '#2A5C45', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Publication…' : 'Publier le bien'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: '#1A1714' }}>{label}</label>
      {children}
    </div>
  );
}

function TextField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label}>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm"
        style={{ border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' }}
      />
    </Field>
  );
}
