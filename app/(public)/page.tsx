'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { StatusPill } from '@/components/ui/Pill';
import { Search, Upload, CheckCircle2, Shield } from 'lucide-react';

const demoRefs = [
  'REF-BJ-CTN-00001',
  'REF-SN-DKR-00234',
  'REF-CI-ABJ-01567',
];

export default function LandingPage() {
  const router = useRouter();
  const [refCode, setRefCode] = useState('');

  const handleSearch = (ref?: string) => {
    const q = ref || refCode;
    if (!q.trim()) return;
    router.push(`/fiche/${q.trim().toUpperCase()}`);
  };

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

          {/* Title */}
          <h1
            className="text-5xl md:text-6xl max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714', lineHeight: 1.1 }}
          >
            Vérifiez un logement avant de vous déplacer.
          </h1>

          {/* Subtitle */}
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5A5550' }}>
            Refrent vous permet de vérifier instantanément la disponibilité d&apos;un bien immobilier
            à travers toute l&apos;Afrique avec un simple code de référence.
          </p>

          {/* Search card */}
          <div
            className="rounded-2xl p-8 space-y-6"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,.10)' }}
          >
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Entrez le code REF"
                value={refCode}
                onChange={e => setRefCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-6 py-4 rounded-lg outline-none transition-all"
                style={{
                  border: '1px solid #E8E4DF',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  color: '#1A1714',
                }}
                onFocus={e => (e.target.style.borderColor = '#2A5C45')}
                onBlur={e => (e.target.style.borderColor = '#E8E4DF')}
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

            <div className="flex items-center justify-between text-sm">
              <span style={{ color: '#8A837C', fontFamily: 'var(--font-mono)' }}>
                Format : REF-{'{PAYS}'}-{'{VILLE}'}-{'{NNNNN}'}
              </span>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
              >
                <Shield className="w-3.5 h-3.5" />
                5 recherches gratuites / semaine
              </div>
            </div>

            {/* Demo refs */}
            <div className="pt-4 space-y-3" style={{ borderTop: '1px solid #E8E4DF' }}>
              <p className="text-sm" style={{ color: '#8A837C' }}>Essayez avec :</p>
              <div className="flex flex-wrap gap-2">
                {demoRefs.map(ref => (
                  <button
                    key={ref}
                    onClick={() => handleSearch(ref)}
                    className="px-4 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor: '#EFECE5',
                      color: '#5A5550',
                      fontFamily: 'var(--font-mono)',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = '#E8E4DF';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = '#EFECE5';
                    }}
                  >
                    {ref}
                  </button>
                ))}
              </div>
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
              { icon: Upload,        title: "L'agent publie",  desc: "Un agent immobilier ou propriétaire publie son bien et reçoit un code REF unique." },
              { icon: Search,        title: 'Vous vérifiez',   desc: 'Entrez le code REF pour vérifier instantanément le statut réel du bien immobilier.' },
              { icon: CheckCircle2,  title: 'Vous agissez',    desc: 'Contactez directement l\'agent si le bien est disponible. Économisez temps et argent.' },
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
              { status: 'Réservé',      borderColor: '#8A5A00', desc: 'Le bien est réservé, mais la transaction n\'est pas finalisée' },
              { status: 'Occupé',       borderColor: '#9B1C1C', desc: 'Le bien est occupé et n\'est plus disponible actuellement' },
              { status: 'Indisponible', borderColor: '#6B6560', desc: 'Le bien a été retiré de la circulation par le propriétaire' },
            ].map(({ status, borderColor, desc }) => (
              <div
                key={status}
                className="rounded-xl p-6 space-y-3"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderLeft: `4px solid ${borderColor}`,
                }}
              >
                <StatusPill status={status} showDot={false} />
                <p className="text-sm" style={{ color: '#5A5550' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#1A1714', color: '#FFFFFF' }}>
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

      {/* ── AGENT CTA ── */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: '#1A1714', borderTop: '1px solid #2A2724' }}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-12 text-center space-y-6"
            style={{ backgroundColor: '#2A2724' }}
          >
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
            <a
              href="/register"
              className="inline-block px-8 py-4 text-white rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#2A5C45' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1E4231')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2A5C45')}
            >
              Créer un compte agent
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
