'use client';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';

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
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-2">Feature Flags</h1>
      <p className="text-ink3 text-sm mb-6">
        Activez ou désactivez les fonctionnalités sans redéploiement.
      </p>

      <div className="bg-surf rounded-r3 shadow-sh1 divide-y divide-brd">
        {flags.map(f => (
          <div key={f.key} className="flex items-center justify-between px-6 py-4">
            <div>
              <div className="font-mono text-sm text-ink">{f.key}</div>
              <div className="text-xs text-ink3 mt-0.5">{f.description}</div>
            </div>
            <button
              onClick={() => toggle(f.key, !f.enabled)}
              aria-label={f.enabled ? 'Désactiver' : 'Activer'}
              className={`
                relative w-11 h-6 rounded-rf transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-acc
                ${f.enabled ? 'bg-acc' : 'bg-brd'}
              `}
            >
              <span
                className={`
                  absolute top-1 w-4 h-4 rounded-full bg-surf transition-transform shadow-sh1
                  ${f.enabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        ))}
        {flags.length === 0 && (
          <p className="text-center py-8 text-ink3 text-sm">Aucun flag configuré.</p>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
