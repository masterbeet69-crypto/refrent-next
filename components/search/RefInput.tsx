'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { isValidRefCode } from '@/lib/utils/ref';

export function RefInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = value.trim().toUpperCase();
    if (!isValidRefCode(code)) {
      setError('Format invalide. Exemple : REF-BJ-CTN-00001');
      return;
    }
    setError('');
    router.push(`/fiche/${code}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xl">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          placeholder="REF-BJ-CTN-00001"
          className="
            flex-1 px-4 py-3 rounded-r3 border border-brd bg-surf
            font-mono text-sm text-ink placeholder:text-ink4
            focus:outline-none focus:border-acc focus:ring-1 focus:ring-acc
          "
          aria-label="Code REF du bien"
        />
        <button
          type="submit"
          className="bg-acc text-surf px-5 py-3 rounded-r3 hover:bg-accd transition-colors flex items-center gap-2 font-medium"
        >
          <Search size={18} />
          Vérifier
        </button>
      </div>
      {error && <p className="text-sm text-err">{error}</p>}
    </form>
  );
}
