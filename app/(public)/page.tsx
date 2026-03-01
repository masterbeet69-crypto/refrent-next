'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { StatusPill } from '@/components/ui/Pill';
import { Search, Upload, CheckCircle2, Shield, LayoutDashboard, LogIn } from 'lucide-react';
import { autoFormatRefCode } from '@/lib/utils/ref';

// Strict new format — no legacy REF- accepted on homepage
const REFERENT_REGEX = /^REFERENT-[A-Z]{2}-[A-Z]{2,5}-\d+$/;

const demoRefs = [
  'REFERENT-BJ-CTN-5530',
  'REFERENT-BJ-CTN-7714',
  'REFERENT-BJ-CTN-1092',
];

function readRoleCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split(';').find(c => c.trim().startsWith('rf_role='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function dashboardPath(role: string): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'agent') return '/agent/dashboard';
  return '/user/dashboard';
}

interface QuotaInfo {
  remaining: number | null;
  used: number;
  limit: number;
  unlimited: boolean;
}

export default function LandingPage() {
  const router = useRouter();
  const [refCode, setRefCode] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const { openAuthModal } = useAuthModal();

  // Sync role from cookie
  useEffect(() => {
    const syncRole = () => setRole(readRoleCookie());
    syncRole();
    window.addEventListener('auth:change', syncRole);
    return () => window.removeEventListener('auth:change', syncRole);
  }, []);

  // Fetch quota on mount (refreshes when user comes back after a search)
  useEffect(() => {
    fetch('/api/v1/quota')
      .then(r => r.json())
      .then((d: QuotaInfo) => setQuota(d))
      .catch(() => {});
  }, []);

  const handleSearch = (ref?: string) => {
    const raw = ref ?? refCode;
    const q = raw.trim().toUpperCase();
    if (!q) return;
    if (!REFERENT_REGEX.test(q)) {
      setError('Format invalide. Exemple : REFERENT-BJ-CTN-00001');
      return;
    }
    setError('');
    router.push(`/fiche/${q}`);
  };

  // Build the quota badge content
  function QuotaBadge() {
    if (!quota) return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
      >
        <Shield className="w-3.5 h-3.5" />
        5 recherches gratuites / semaine
      </div>
    );

    if (quota.unlimited || role) return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
      >
        <Shield className="w-3.5 h-3.5" />
        Recherches illimitées
      </div>
    );

    const { remaining, limit } = quota;

    if (remaining === 0) return (
      <button
        onClick={() => openAuthModal('login')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
        style={{ backgroundColor: '#FDEDED', color: '#9B1C1C' }}
      >
        <LogIn className="w-3.5 h-3.5" />
        Quota atteint — Connectez-vous
      </button>
    );

    if (remaining !== null && remaining < limit) return (
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: '#FEF3CD', color: '#8A5A00' }}
        >
          <Shield className="w-3.5 h-3.5" />
          Il vous reste {remaining} recherche{remaining > 1 ? 's' : ''}
        </div>
        <button
          onClick={() => openAuthModal('register')}
          className="text-xs font-medium underline transition-opacity hover:opacity-70"
          style={{ color: '#2A5C45' }}
        >
          Illimité →
        </button>
      </div>
    );

    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
      >
        <Shield className="w-3.5 h-3.5" />
        5 recherches gratuites / semaine
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5F2' }}>
      <Nav />

      {/* ── HERO ── */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Eyebrow */}
          <div className="inline-flex">
            <div
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: '#EAF2EC', color: '#2A5C45', fontFamily: 'var(--font-mono)' }}
            >
              PARTOUT EN AFRIQUE
            </div>
          </div>

          {/* Title — jeu de couleurs */}
          <h1
            className="text-5xl md:text-6xl max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-fraunces)', lineHeight: 1.1, color: '#1A1714' }}
          >
            Vérifiez un{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2A5C45 0%, #7B9E44 50%, #C68642 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              logement
            </span>
            {' '}avant de{' '}
            <span style={{ color: '#2A5C45' }}>vous déplacer.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5A5550' }}>
            Refrent vous permet de vérifier instantanément la disponibilité d&apos;un bien immobilier
            à travers toute l&apos;Afrique avec un simple code de référence.
          </p>

          {/* Search card */}
          <div
            className="rounded-2xl p-8 space-y-4"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,.10)' }}
          >
            {/* Input row */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="REFERENT-BJ-CTN-00001"
                value={refCode}
                onChange={e => { setRefCode(autoFormatRefCode(e.target.value)); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-6 py-4 rounded-lg outline-none transition-all"
                style={{
                  border: `1px solid ${error ? '#9B1C1C' : '#E8E4DF'}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  color: '#1A1714',
                }}
                onFocus={e => (e.target.style.borderColor = error ? '#9B1C1C' : '#2A5C45')}
                onBlur={e => (e.target.style.borderColor = error ? '#9B1C1C' : '#E8E4DF')}
              />
              <button
                onClick={() => handleSearch()}
                className="px-8 py-4 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                style={{ backgroundColor: '#2A5C45' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1E4231')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2A5C45')}
              >
                <Search className="w-5 h-5" />
                Rechercher
              </button>
            </div>

            {error && (
              <p className="text-sm text-left" style={{ color: '#9B1C1C' }}>{error}</p>
            )}

            {/* Demo chips + quota badge on same line */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex flex-wrap gap-2">
                {demoRefs.map(ref => (
                  <button
                    key={ref}
                    onClick={() => handleSearch(ref)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                    style={{ backgroundColor: '#EFECE5', color: '#5A5550', fontFamily: 'var(--font-mono)' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#E8E4DF')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#EFECE5')}
                  >
                    {ref}
                  </button>
                ))}
              </div>
              <QuotaBadge />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="comment-ca-marche" className="py-20 px-6" style={{ backgroundColor: '#EFECE5' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-center mb-16"
            style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714', fontSize: '2rem' }}
          >
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload,       title: "L'agent publie",  desc: "Un agent immobilier ou propriétaire publie son bien et reçoit un code REFERENT unique." },
              { icon: Search,       title: 'Vous vérifiez',   desc: 'Entrez le code REFERENT pour vérifier instantanément le statut réel du bien immobilier.' },
              { icon: CheckCircle2, title: 'Vous agissez',    desc: "Contactez directement l'agent si le bien est disponible. Économisez temps et argent." },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl p-8 space-y-4"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#EAF2EC' }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#2A5C45' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.25rem', color: '#1A1714' }}>
                  {title}
                </h3>
                <p style={{ color: '#5A5550', fontSize: '14px' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATUS LEGEND ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F7F5F2' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-center mb-16"
            style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714', fontSize: '2rem' }}
          >
            Les statuts de propriété
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { status: 'Disponible',   borderColor: '#2A5C45', desc: 'Le bien est disponible à la visite et à la location/vente' },
              { status: 'Réservé',      borderColor: '#8A5A00', desc: "Le bien est réservé, mais la transaction n'est pas finalisée" },
              { status: 'Occupé',       borderColor: '#9B1C1C', desc: "Le bien est occupé et n'est plus disponible actuellement" },
              { status: 'Indisponible', borderColor: '#6B6560', desc: 'Le bien a été retiré de la circulation par le propriétaire' },
            ].map(({ status, borderColor, desc }) => (
              <div
                key={status}
                className="rounded-xl p-6 space-y-3"
                style={{ backgroundColor: '#FFFFFF', borderLeft: `4px solid ${borderColor}` }}
              >
                <StatusPill status={status} showDot={false} />
                <p className="text-sm" style={{ color: '#5A5550' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#1A1714' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { value: '12 847', label: 'Biens actifs' },
              { value: '28',     label: 'Pays couverts' },
              { value: '3 421',  label: 'Agents certifiés' },
              { value: '47 892', label: 'Vérifications ce mois' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center space-y-2">
                <div
                  className="text-5xl font-semibold"
                  style={{ fontFamily: 'var(--font-fraunces)', color: '#2A5C45' }}
                >
                  {value}
                </div>
                <p style={{ color: '#8A837C' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT CTA — auth-aware ── */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: '#1A1714', borderTop: '1px solid #2A2724' }}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-12 text-center space-y-6"
            style={{ backgroundColor: '#2A2724' }}
          >
            {role ? (
              <>
                <h2
                  className="text-white"
                  style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.75rem' }}
                >
                  Bienvenue de retour !
                </h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: '#8A837C' }}>
                  Accédez à votre tableau de bord pour gérer vos biens, suivre vos alertes et consulter votre historique.
                </p>
                <Link
                  href={dashboardPath(role)}
                  className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#2A5C45' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1E4231')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2A5C45')}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Accéder au tableau de bord
                </Link>
              </>
            ) : (
              <>
                <h2
                  className="text-white"
                  style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.75rem' }}
                >
                  Vous êtes agent immobilier ?
                </h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: '#8A837C' }}>
                  Rejoignez des milliers d&apos;agents qui utilisent Refrent pour gérer leurs biens
                  et gagner en crédibilité auprès de leurs clients.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-8 py-4 text-white rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: '#2A5C45' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1E4231')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2A5C45')}
                  >
                    Créer un compte agent
                  </button>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-8 py-4 rounded-lg font-medium"
                    style={{ color: '#8A837C', border: '1px solid #3A3734' }}
                  >
                    Se connecter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
