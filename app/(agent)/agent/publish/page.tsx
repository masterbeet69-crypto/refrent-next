'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AFRICA_REGIONS } from '@/lib/utils/country';
import { Loader2, Check, ChevronDown } from 'lucide-react';

// Exact values accepted by the DB CHECK constraint (case-sensitive)
const PROPERTY_TYPES = [
  'Appartement',
  'Maison',
  'Villa',
  'Studio',
  'Bureau',
  'Chambre',
  'Duplex',
  'Entrepôt',
  'Résidence',
  'Rez-de-chaussée',
];

const STATUSES = [
  { value: 'available',   label: 'Disponible' },
  { value: 'reserved',    label: 'Réservé' },
  { value: 'occupied',    label: 'Occupé' },
  { value: 'unavailable', label: 'Indisponible' },
];

const inputCls = 'w-full px-4 py-3 rounded-xl outline-none text-sm transition-colors';
const inputStyle = { border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' };
const focusStyle = { border: '1px solid #2A5C45' };

export default function PublishPage() {
  const router = useRouter();

  const [country, setCountry]     = useState('BJ');
  const [city, setCity]           = useState('CTN');
  const [type, setType]           = useState(PROPERTY_TYPES[0]);
  const [status, setStatus]       = useState('available');
  const [price, setPrice]         = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [desc, setDesc]           = useState('');

  const [loading, setLoading]     = useState(false);
  const [saved, setSaved]         = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [refCode, setRefCode]     = useState('');

  const region = AFRICA_REGIONS[country as keyof typeof AFRICA_REGIONS];
  const cities = region ? Object.entries(region.cities) : [];

  function handleCountryChange(cc: string) {
    const reg = AFRICA_REGIONS[cc as keyof typeof AFRICA_REGIONS];
    setCountry(cc);
    setCity(reg ? Object.keys(reg.cities)[0] : '');
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      e.price = 'Le prix est obligatoire (valeur > 0).';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setServerError('');
    setLoading(true);

    const res = await fetch('/api/v1/agent/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country_code: country,
        city_code:    city,
        type,
        status,
        price:        Number(price),
        district:     neighborhood || null,
        description:  desc || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setServerError(d.error ?? 'Une erreur est survenue. Veuillez réessayer.');
      return;
    }

    const { property } = await res.json();
    setRefCode(property.ref_code ?? '');
    setSaved(true);
    setTimeout(() => router.push('/agent/properties'), 3000);
  }

  if (saved) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
          Publier un bien
        </h1>
        <div
          className="rounded-2xl p-8 text-center space-y-4"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: '#EAF2EC' }}
          >
            <Check className="w-7 h-7" style={{ color: '#2A5C45' }} />
          </div>
          <h2 className="text-xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
            Bien publié avec succès !
          </h2>
          <p className="text-sm" style={{ color: '#5A5550' }}>
            Votre bien a reçu le code de référence :
          </p>
          <div
            className="px-4 py-3 rounded-xl text-sm font-semibold tracking-wider"
            style={{ backgroundColor: '#EAF2EC', color: '#2A5C45', fontFamily: 'var(--font-mono)' }}
          >
            {refCode}
          </div>
          <p className="text-xs" style={{ color: '#8A837C' }}>
            Redirection vers vos biens dans quelques secondes…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Publier un bien
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-5"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        {/* Pays + Ville */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>Pays</label>
            <div className="relative">
              <select
                value={country}
                onChange={e => handleCountryChange(e.target.value)}
                className={inputCls + ' appearance-none pr-8'}
                style={inputStyle}
              >
                {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
                  <option key={cc} value={cc}>{r.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8A837C' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>Ville</label>
            <div className="relative">
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className={inputCls + ' appearance-none pr-8'}
                style={inputStyle}
              >
                {cities.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8A837C' }} />
            </div>
          </div>
        </div>

        {/* Type de bien */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>Type de bien</label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="px-3 py-1.5 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: type === t ? '#EAF2EC' : '#F7F5F2',
                  color: type === t ? '#2A5C45' : '#5A5550',
                  border: type === t ? '1.5px solid #2A5C45' : '1.5px solid transparent',
                  fontWeight: type === t ? 600 : 400,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Prix + Statut */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
              Prix / mois (FCFA) <span style={{ color: '#9B1C1C' }}>*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={e => { setPrice(e.target.value); setErrors(prev => ({ ...prev, price: '' })); }}
              placeholder="150 000"
              min={1}
              className={inputCls}
              style={errors.price ? { ...inputStyle, border: '1px solid #9B1C1C' } : inputStyle}
              onFocus={e => { if (!errors.price) e.target.style.borderColor = '#2A5C45'; }}
              onBlur={e => { e.target.style.borderColor = errors.price ? '#9B1C1C' : '#E8E4DF'; }}
            />
            {errors.price && <p className="mt-1 text-xs" style={{ color: '#9B1C1C' }}>{errors.price}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>Statut initial</label>
            <div className="relative">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className={inputCls + ' appearance-none pr-8'}
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, inputStyle)}
              >
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8A837C' }} />
            </div>
          </div>
        </div>

        {/* Quartier */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>Quartier</label>
          <input
            type="text"
            value={neighborhood}
            onChange={e => setNeighborhood(e.target.value)}
            placeholder="Haie Vive, Akpakpa…"
            className={inputCls}
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => Object.assign(e.target.style, inputStyle)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>Description</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            placeholder="Décrivez brièvement le bien : luminosité, équipements, accès…"
            className={inputCls + ' resize-none'}
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => Object.assign(e.target.style, inputStyle)}
          />
        </div>

        {serverError && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ backgroundColor: '#FDEDED', color: '#9B1C1C', border: '1px solid #FECACA' }}
          >
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-medium transition-opacity"
          style={{ backgroundColor: '#2A5C45', opacity: loading ? 0.7 : 1 }}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Publication en cours…' : 'Publier le bien'}
        </button>
      </form>
    </div>
  );
}
