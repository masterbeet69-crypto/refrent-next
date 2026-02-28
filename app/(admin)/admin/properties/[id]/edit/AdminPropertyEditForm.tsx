'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';
import { motion } from 'motion/react';

const STATUSES = [
  { value: 'available',  label: 'Disponible',   color: '#2A5C45', bg: '#EAF2EC' },
  { value: 'reserved',   label: 'Réservé',       color: '#8A5A00', bg: '#FEF3CD' },
  { value: 'occupied',   label: 'Occupé',        color: '#9B1C1C', bg: '#FDEDED' },
  { value: 'visiting',   label: 'En visite',     color: '#3730A3', bg: '#EEF2FF' },
  { value: 'unavailable',label: 'Indisponible',  color: '#6B6560', bg: '#F0EFEE' },
];

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: Record<string, any>;
}

export function AdminPropertyEditForm({ property: p }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(p.status ?? 'available');
  const [type, setType]     = useState<string>((p.type as string) ?? '');
  const [city, setCity]     = useState<string>((p.city as string) ?? '');
  const [neighborhood, setNeighborhood] = useState<string>((p.neighborhood as string) ?? '');
  const [price, setPrice]   = useState<string>(p.price ? String(p.price) : '');
  const [desc, setDesc]     = useState<string>((p.description as string) ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/v1/admin/properties/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        type: type || null,
        city: city || null,
        neighborhood: neighborhood || null,
        price: price ? Number(price) : null,
        description: desc || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    }
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-6"
      style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
    >
      {/* Status */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#8A837C' }}>
          Statut
        </label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
              style={{
                backgroundColor: status === s.value ? s.bg : 'transparent',
                color: s.color,
                borderColor: status === s.value ? s.color : '#E8E4DF',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Type de bien
          </label>
          <input
            value={type}
            onChange={e => setType(e.target.value)}
            placeholder="Appartement, Villa…"
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ border: '1px solid #E8E4DF', color: '#1A1714' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Prix (FCFA)
          </label>
          <input
            value={price}
            onChange={e => setPrice(e.target.value.replace(/\D/g, ''))}
            placeholder="45000"
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ border: '1px solid #E8E4DF', color: '#1A1714', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Ville
          </label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Cotonou"
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ border: '1px solid #E8E4DF', color: '#1A1714' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Quartier
          </label>
          <input
            value={neighborhood}
            onChange={e => setNeighborhood(e.target.value)}
            placeholder="Haie Vive"
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ border: '1px solid #E8E4DF', color: '#1A1714' }}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
          Description
        </label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={4}
          placeholder="Description du bien…"
          className="w-full px-4 py-2.5 rounded-xl outline-none text-sm resize-none"
          style={{ border: '1px solid #E8E4DF', color: '#1A1714' }}
        />
      </div>

      {/* Save */}
      <motion.button
        onClick={handleSave}
        disabled={saving || saved}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium"
        style={{
          backgroundColor: saved ? '#2A5C45' : '#1A1714',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <Check className="w-4 h-4" />
        ) : null}
        {saved ? 'Enregistré !' : saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
      </motion.button>
    </div>
  );
}
