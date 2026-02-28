'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuthModal } from './AuthModalContext';
import { AFRICA_REGIONS } from '@/lib/utils/country';

// ─── Styles partagés ──────────────────────────────────────────────────────────
const selStyle = {
  border: '1px solid #E8E4DF',
  color: '#1A1714',
  backgroundColor: '#FFFFFF',
};

// ─── Field (input avec focus coloré) ─────────────────────────────────────────
function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: '#1A1714' }}>
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm"
        style={{
          border: `1px solid ${focused ? '#2A5C45' : '#E8E4DF'}`,
          color: '#1A1714',
          backgroundColor: '#FFFFFF',
        }}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      />
    </div>
  );
}

// ─── Bouton OAuth (désactivé) ─────────────────────────────────────────────────
const GoogleIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

function OAuthButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Bientôt disponible"
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
      style={{
        border: '1px solid #E8E4DF',
        color: '#5A5550',
        backgroundColor: '#FFFFFF',
        opacity: 0.55,
        cursor: 'not-allowed',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Formulaire de connexion ──────────────────────────────────────────────────
function LoginForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr]     = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setErr(d.error ?? 'Identifiants incorrects.');
      return;
    }
    onClose();
    window.dispatchEvent(new Event('auth:change'));
    // Rediriger vers le dashboard selon le rôle
    const role = document.cookie.split(';').find(c => c.trim().startsWith('rf_role='))?.split('=')[1];
    if (role === 'admin') router.push('/admin/dashboard');
    else if (role === 'agent') router.push('/agent/dashboard');
    else router.push('/user/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Field
        label="Mot de passe"
        type="password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        required
        autoComplete="current-password"
      />
      {err && <p className="text-sm" style={{ color: '#9B1C1C' }}>{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-white font-medium transition-opacity"
        style={{ backgroundColor: '#2A5C45', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}

// ─── Formulaire d'inscription ─────────────────────────────────────────────────
type RegForm = {
  full_name: string; email: string; password: string;
  role: string; country_code: string; city_code: string;
};

function RegisterForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<RegForm>({
    full_name: '', email: '', password: '',
    role: 'user', country_code: 'BJ', city_code: 'CTN',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');
  const router = useRouter();

  const region = AFRICA_REGIONS[form.country_code as keyof typeof AFRICA_REGIONS];
  const cities = region ? Object.entries(region.cities) : [];

  const set = (k: keyof RegForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const cc = e.target.value;
    const r = AFRICA_REGIONS[cc as keyof typeof AFRICA_REGIONS];
    const firstCity = r ? Object.keys(r.cities)[0] : '';
    setForm(f => ({ ...f, country_code: cc, city_code: firstCity }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json();
      setErr(d.error ?? "Erreur lors de l'inscription.");
      setLoading(false);
      return;
    }
    // Auto-login immédiat
    const loginRes = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    setLoading(false);
    if (loginRes.ok) {
      onClose();
      window.dispatchEvent(new Event('auth:change'));
      const role = document.cookie.split(';').find(c => c.trim().startsWith('rf_role='))?.split('=')[1];
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'agent') router.push('/agent/dashboard');
      else router.push('/user/dashboard');
    } else {
      setErr('Compte créé ! Veuillez vous connecter.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Toggle Particulier / Agent */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #E8E4DF' }}>
        {[
          { value: 'user',  label: 'Particulier' },
          { value: 'agent', label: 'Agent immobilier' },
        ].map(r => (
          <button
            key={r.value}
            type="button"
            onClick={() => setForm(f => ({ ...f, role: r.value }))}
            className="flex-1 py-2.5 text-sm font-medium transition-colors"
            style={{
              backgroundColor: form.role === r.value ? '#2A5C45' : '#FFFFFF',
              color: form.role === r.value ? '#FFFFFF' : '#5A5550',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <Field
        label="Nom complet"
        value={form.full_name}
        onChange={set('full_name')}
        required
        autoComplete="name"
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={set('email')}
        required
        autoComplete="email"
      />
      <Field
        label="Mot de passe (8 caractères min.)"
        type="password"
        value={form.password}
        onChange={set('password')}
        required
        minLength={8}
        autoComplete="new-password"
      />

      {/* Pays + Ville */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: '#1A1714' }}>Pays</label>
          <select
            value={form.country_code}
            onChange={handleCountryChange}
            className="w-full px-3 py-3 rounded-xl outline-none text-sm"
            style={selStyle}
          >
            {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
              <option key={cc} value={cc}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: '#1A1714' }}>Ville</label>
          <select
            value={form.city_code}
            onChange={set('city_code')}
            className="w-full px-3 py-3 rounded-xl outline-none text-sm"
            style={selStyle}
          >
            {cities.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {err && <p className="text-sm" style={{ color: '#9B1C1C' }}>{err}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-white font-medium transition-opacity"
        style={{ backgroundColor: '#2A5C45', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Création du compte…' : 'Créer mon compte'}
      </button>
    </form>
  );
}

// ─── Modale principale ────────────────────────────────────────────────────────
export function AuthModal() {
  const { open, mode, closeAuthModal } = useAuthModal();
  const [tab, setTab] = useState<'login' | 'register'>(mode);

  // Sync l'onglet avec le mode quand la modale s'ouvre
  useEffect(() => {
    if (open) setTab(mode);
  }, [open, mode]);

  // Fermeture avec Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAuthModal();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeAuthModal]);

  // Bloquer le scroll de body
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Animation CSS */}
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .modal-card { animation: modal-in 0.2s ease-out; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={e => { if (e.target === e.currentTarget) closeAuthModal(); }}
      >
        {/* Carte modale */}
        <div
          className="modal-card w-full max-w-md rounded-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={tab === 'login' ? 'Connexion' : 'Inscription'}
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 40px rgba(0,0,0,.20)',
          }}
        >
          {/* Tabs header */}
          <div className="relative flex" style={{ borderBottom: '1px solid #E8E4DF' }}>
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-4 text-sm font-medium transition-colors"
                style={{
                  color: tab === t ? '#1A1714' : '#8A837C',
                  borderBottom: tab === t ? '2px solid #2A5C45' : '2px solid transparent',
                }}
              >
                {t === 'login' ? 'Connexion' : "S'inscrire"}
              </button>
            ))}
            {/* Bouton fermer */}
            <button
              onClick={closeAuthModal}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors"
              style={{ color: '#8A837C' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#F7F5F2')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Corps */}
          <div className="p-8 space-y-5">
            <h2
              className="text-2xl"
              style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
            >
              {tab === 'login' ? 'Bon retour !' : 'Créer un compte'}
            </h2>

            {/* OAuth (désactivés, configurables plus tard) */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <OAuthButton icon={GoogleIcon}   label="Google"   />
                <OAuthButton icon={FacebookIcon} label="Facebook" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: '#E8E4DF' }} />
                <span className="text-xs" style={{ color: '#8A837C' }}>ou</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E8E4DF' }} />
              </div>
            </div>

            {/* Formulaire actif */}
            {tab === 'login'
              ? <LoginForm    onClose={closeAuthModal} />
              : <RegisterForm onClose={closeAuthModal} />
            }
          </div>
        </div>
      </div>
    </>
  );
}
