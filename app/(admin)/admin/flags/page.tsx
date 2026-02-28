'use client';
import { useEffect, useState } from 'react';

interface Flag {
  key: string;
  enabled: boolean;
  description: string;
  updated_at: string;
}

export default function FlagsPage() {
  const [flags, setFlags]     = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/v1/admin/flags')
      .then(r => r.json())
      .then(d => { setFlags(d.flags ?? []); setLoading(false); });
  }, []);

  async function toggle(key: string, enabled: boolean) {
    const prev = flags;
    // Optimistic update
    setFlags(fs => fs.map(f => f.key === key ? { ...f, enabled } : f));

    const res = await fetch('/api/v1/admin/flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, enabled }),
    });

    if (!res.ok) {
      setFlags(prev); // rollback
      setToast({ message: 'Erreur lors de la mise à jour.', type: 'error' });
    } else {
      setToast({ message: `Flag "${key}" ${enabled ? 'activé' : 'désactivé'}.`, type: 'success' });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#E8E4DF', borderTopColor: '#2A5C45' }}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Feature Flags
      </h1>
      <p className="text-sm mb-6" style={{ color: '#8A837C' }}>
        Activez ou désactivez les fonctionnalités sans redéploiement.
      </p>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        {flags.map((f, i) => (
          <div
            key={f.key}
            className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}
          >
            <div>
              <div className="text-sm font-medium" style={{ color: '#1A1714', fontFamily: 'var(--font-mono)' }}>{f.key}</div>
              <div className="text-xs mt-0.5" style={{ color: '#8A837C' }}>{f.description}</div>
            </div>
            <button
              onClick={() => toggle(f.key, !f.enabled)}
              aria-label={f.enabled ? 'Désactiver' : 'Activer'}
              className="relative w-11 h-6 rounded-full transition-colors focus:outline-none"
              style={{ backgroundColor: f.enabled ? '#2A5C45' : '#E8E4DF' }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full transition-transform"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                  transform: f.enabled ? 'translateX(22px)' : 'translateX(4px)',
                }}
              />
            </button>
          </div>
        ))}
        {flags.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>Aucun flag configuré.</p>
        )}
      </div>

      {toast && (
        <div
          className="fixed bottom-4 right-4 px-4 py-3 rounded-xl text-white text-sm font-medium"
          style={{ backgroundColor: toast.type === 'error' ? '#9B1C1C' : '#2A5C45' }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
