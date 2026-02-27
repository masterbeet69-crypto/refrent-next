'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
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

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-ink mb-6">Publier un bien</h1>
      <form onSubmit={handleSubmit} className="bg-surf rounded-r3 shadow-sh1 p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink2">Pays</label>
            <select value={country} onChange={handleCountryChange}
              className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc">
              {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
                <option key={cc} value={cc}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink2">Ville</label>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc">
              {cities.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink2">Type</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc">
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink2">Statut initial</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Prix (FCFA)" type="number" value={price}
            onChange={e => setPrice(e.target.value)} placeholder="150000" />
          <Input label="Pièces" type="number" value={rooms}
            onChange={e => setRooms(e.target.value)} placeholder="3" min="1" max="20" />
        </div>

        <Input label="Quartier / District" value={district}
          onChange={e => setDistrict(e.target.value)} placeholder="Akpakpa" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink2">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
            className="w-full px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc resize-none"
            placeholder="Description optionnelle du bien..." />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Publier le bien
        </Button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
