'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { isValidRefCode } from '@/lib/utils/ref';

export function RefInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
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
          onChange={e => { setValue(e.target.value.toUpperCase()); setError(''); }}
          placeholder="REF-BJ-CTN-00001"
          className="flex-1 px-4 py-3 rounded-xl outline-none transition-all text-sm"
          style={{
            border: `1px solid ${focused ? '#2A5C45' : '#E8E4DF'}`,
            fontFamily: 'var(--font-mono)',
            color: '#1A1714',
            backgroundColor: '#FFFFFF',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Code REF du bien"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl text-white font-medium flex items-center gap-2 transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#2A5C45' }}
        >
          <Search size={18} />
          Vérifier
        </button>
      </div>
      {error && (
        <p className="text-sm" style={{ color: '#9B1C1C' }}>{error}</p>
      )}
    </form>
  );
}
