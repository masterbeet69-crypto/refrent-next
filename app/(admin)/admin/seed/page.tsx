'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

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
      <h1 className="font-display text-2xl text-ink mb-2">Données de démonstration</h1>
      <p className="text-ink3 text-sm mb-6">
        Génère des agents, utilisateurs et propriétés fictifs. Les comptes utilisent le domaine{' '}
        <code className="font-mono bg-bg2 px-1 rounded text-xs">@refrent-demo.invalid</code>.
        Opération idempotente — les doublons sont ignorés.
      </p>

      <div className="bg-surf rounded-r3 shadow-sh1 p-6 flex flex-col gap-4">
        <Input
          label="Mot de passe de seed"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="••••••••"
        />
        <Button onClick={handleSeed} loading={loading} className="w-full">
          Générer ~500 utilisateurs fictifs
        </Button>

        {result && (
          <div className="bg-accl rounded-r2 p-4 text-sm text-accd space-y-1">
            <div>Agents créés : <strong>{result.agents_inserted}</strong></div>
            <div>Utilisateurs créés : <strong>{result.users_inserted}</strong></div>
            <div>Propriétés créées : <strong>{result.properties_inserted}</strong></div>
            <div>Logs créés : <strong>{result.logs_inserted}</strong></div>
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
