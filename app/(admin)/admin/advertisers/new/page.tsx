'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Check } from 'lucide-react';

export default function NewAdvertiserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Le nom et l\'email sont obligatoires.');
      return;
    }
    setSaving(true);
    setError('');
    const res = await fetch('/api/v1/admin/advertisers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => router.push('/admin/advertisers'), 1200);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? 'Erreur lors de la création.');
    }
  }

  const inputStyle = {
    border: '1px solid #E8E4DF',
    color: '#1A1714',
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/advertisers"
          className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#8A837C' }}
        >
          <ArrowLeft size={16} />
          Retour
        </Link>
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
          Nouvel annonceur
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-5"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        {/* Name + Company */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
              Nom <span style={{ color: '#9B1C1C' }}>*</span>
            </label>
            <input
              {...field('name')}
              placeholder="Jean Dupont"
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
              Entreprise
            </label>
            <input
              {...field('company')}
              placeholder="ImmoConnect Bénin"
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
              Email <span style={{ color: '#9B1C1C' }}>*</span>
            </label>
            <input
              {...field('email')}
              type="email"
              placeholder="contact@exemple.com"
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
              Téléphone
            </label>
            <input
              {...field('phone')}
              placeholder="+229 XX XX XX XX"
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Site web
          </label>
          <input
            {...field('website')}
            placeholder="https://exemple.com"
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={inputStyle}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>
            Notes internes
          </label>
          <textarea
            {...field('notes')}
            rows={3}
            placeholder="Informations complémentaires…"
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm resize-none"
            style={inputStyle}
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: '#9B1C1C' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || saved}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-opacity"
          style={{
            backgroundColor: saved ? '#2A5C45' : '#1A1714',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? 'Créé ! Redirection…' : saving ? 'Création…' : 'Créer l\'annonceur'}
        </button>
      </form>
    </div>
  );
}
