'use client';
import { Copy } from 'lucide-react';

export function RefCodeDisplay({ code }: { code: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-bg2 border border-brd rounded-r2 px-3 py-1.5">
      <span className="font-mono text-sm text-ink2">{code}</span>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="text-ink4 hover:text-acc transition-colors"
        title="Copier le code REF"
        type="button"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}
