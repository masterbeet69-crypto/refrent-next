'use client';
import { useState } from 'react';

interface SeedResult {
  users_inserted:      number;
  agents_inserted:     number;
  properties_inserted: number;
  logs_inserted:       number;
}

export default function SeedPage() {
  const [pass, setPass]       = useState('');
  const [result, setResult]   = useState<SeedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function handleSeed() {
    if (!confirm('Générer ~500 utilisateurs fictifs dans la base de données ?')) return;
    setLoading(true);
    setResult(null);

    const res = await fetch('/api/v1/admin/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    });
    setLoading(false);

    if (!res.ok) {
      const d = await res.json();
      setToast({ message: d.error ?? 'Erreur lors du seed.', type: 'error' });
      return;
    }

    const { result: seedResult } = await res.json();
    setResult(seedResult as SeedResult);
    setToast({ message: 'Données générées avec succès !', type: 'success' });
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Données de démonstration
      </h1>
      <p className="text-sm mb-6" style={{ color: '#8A837C' }}>
        Génère des agents, utilisateurs et propriétés fictifs. Les comptes utilisent le domaine{' '}
        <code
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ fontFamily: 'var(--font-mono)', backgroundColor: '#EFECE5', color: '#5A5550' }}
        >
          @refrent-demo.invalid
        </code>
        . Opération idempotente — les doublons sont ignorés.
      </p>

      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: '#1A1714' }}>
            Mot de passe de seed
          </label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{ border: '1px solid #E8E4DF', color: '#1A1714', backgroundColor: '#FFFFFF' }}
          />
        </div>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-white font-medium transition-opacity"
          style={{ backgroundColor: '#2A5C45', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Génération en cours…' : 'Générer ~500 utilisateurs fictifs'}
        </button>

        {result && (
          <div
            className="rounded-xl p-4 text-sm space-y-1"
            style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
          >
            <div>Agents créés : <strong>{result.agents_inserted}</strong></div>
            <div>Utilisateurs créés : <strong>{result.users_inserted}</strong></div>
            <div>Propriétés créées : <strong>{result.properties_inserted}</strong></div>
            <div>Logs créés : <strong>{result.logs_inserted}</strong></div>
          </div>
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
