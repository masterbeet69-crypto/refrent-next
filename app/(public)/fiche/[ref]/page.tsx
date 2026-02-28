import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { isValidRefCode } from '@/lib/utils/ref';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { StatusPill } from '@/components/ui/Pill';
import { cityName, countryName } from '@/lib/utils/country';
import { formatPrice, formatDate } from '@/lib/utils/format';
import {
  MapPin, ArrowLeft, Home, BedDouble, Maximize2,
  Layers, Phone, MessageCircle, Heart, Flag, Shield, Star, SearchX,
} from 'lucide-react';

interface Props { params: Promise<{ ref: string }> }

function PropertyNotFound({ ref }: { ref: string }) {
  return (
    <div style={{ backgroundColor: '#F7F5F2', minHeight: '100vh' }}>
      <Nav />
      <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full"
          style={{ backgroundColor: '#EFECE5' }}
        >
          <SearchX className="w-7 h-7" style={{ color: '#8A837C' }} />
        </div>
        <h1
          className="text-3xl"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
        >
          Bien introuvable
        </h1>
        <p style={{ color: '#5A5550' }}>
          Aucun bien ne correspond au code{' '}
          <code
            className="px-2 py-0.5 rounded text-sm"
            style={{ fontFamily: 'var(--font-mono)', backgroundColor: '#EFECE5', color: '#5A5550' }}
          >
            {ref}
          </code>
          . Vérifiez le code et réessayez.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#2A5C45' }}
          >
            Nouvelle recherche
          </Link>
          <Link
            href="/browse"
            className="px-6 py-3 text-sm font-medium rounded-xl transition-colors"
            style={{ border: '1px solid #E8E4DF', color: '#5A5550', backgroundColor: '#FFFFFF' }}
          >
            Explorer les biens
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default async function FichePage({ params }: Props) {
  const { ref: rawRef } = await params;
  const ref = rawRef.toUpperCase();
  if (!isValidRefCode(ref)) return <PropertyNotFound ref={ref} />;

  const sb = createServerSupabase();
  const { data: property } = await sb
    .from('properties')
    .select('*, profiles(full_name, avatar_url)')
    .eq('ref_code', ref)
    .single();

  if (!property) return <PropertyNotFound ref={ref} />;

  const p = property;
  const agentProfile = (p.profiles as { full_name?: string; avatar_url?: string } | null);
  const agentName = agentProfile?.full_name ?? 'Agent Refrent';
  const agentInitials = agentName
    .split(' ')
    .map((n: string) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const city = cityName(p.country_code, p.city_code);
  const country = countryName(p.country_code);
  const propertyType = p.property_type
    ? p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1)
    : 'Bien immobilier';

  return (
    <div style={{ backgroundColor: '#F7F5F2', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO BAND ── */}
      <div style={{ backgroundColor: '#EAF2EC' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
            style={{ color: '#2A5C45' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la recherche
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-3">
              {/* Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#FFFFFF', color: '#2A5C45', fontFamily: 'var(--font-mono)' }}
                >
                  {p.ref_code}
                </span>
                {p.property_type && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={{ backgroundColor: '#FFFFFF', color: '#5A5550' }}
                  >
                    {p.property_type}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-3xl md:text-4xl"
                style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714', lineHeight: 1.1 }}
              >
                {propertyType} à {city}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm" style={{ color: '#5A5550' }}>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>
                  {p.district ? `${p.district}, ` : ''}{city}, {country}
                </span>
              </div>
            </div>

            {/* Status + Price */}
            <div className="flex flex-col items-start lg:items-end gap-3">
              <StatusPill status={p.status} />
              {p.price && (
                <div
                  className="text-2xl font-semibold"
                  style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
                >
                  {formatPrice(p.price, p.currency ?? 'FCFA')}
                </div>
              )}
              <p className="text-xs" style={{ color: '#8A837C' }}>
                Publié le {formatDate(p.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details card */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}
            >
              <h2
                className="mb-5 text-lg"
                style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
              >
                Caractéristiques
              </h2>
              <div className="grid grid-cols-2 gap-5">
                <DetailRow icon={Home} label="Type" value={propertyType} />
                {p.rooms != null && (
                  <DetailRow icon={BedDouble} label="Pièces" value={`${p.rooms} pièce${p.rooms > 1 ? 's' : ''}`} />
                )}
                {p.area_sqm != null && (
                  <DetailRow icon={Maximize2} label="Surface" value={`${p.area_sqm} m²`} />
                )}
                {p.floor != null && (
                  <DetailRow icon={Layers} label="Étage" value={p.floor === 0 ? 'RDC' : `${p.floor}e étage`} />
                )}
                {p.district && (
                  <DetailRow icon={MapPin} label="Quartier" value={p.district} />
                )}
              </div>
            </div>

            {/* Description card */}
            {p.description && (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}
              >
                <h2
                  className="mb-3 text-lg"
                  style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
                >
                  Description
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#5A5550' }}>
                  {p.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right column (sticky) ── */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">

            {/* Action card */}
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: '#1A1714' }}>Statut actuel</span>
                <StatusPill status={p.status} size="sm" />
              </div>

              <div className="space-y-2.5">
                <a
                  href="tel:+22900000000"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#2A5C45' }}
                >
                  <Phone className="w-4 h-4" />
                  Appeler l&apos;agent
                </a>
                <a
                  href="https://wa.me/22900000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              <div
                className="grid grid-cols-2 gap-2 pt-3"
                style={{ borderTop: '1px solid #E8E4DF' }}
              >
                <button
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#EFECE5', color: '#5A5550' }}
                >
                  <Heart className="w-4 h-4" />
                  Favoris
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#FDEDED', color: '#9B1C1C' }}
                >
                  <Flag className="w-4 h-4" />
                  Signaler
                </button>
              </div>
            </div>

            {/* Agent card */}
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}
            >
              <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8A837C' }}>
                Agent responsable
              </h3>

              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #2A5C45, #1E4231)',
                    fontFamily: 'var(--font-fraunces)',
                  }}
                >
                  {agentInitials}
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#1A1714' }}>{agentName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Shield className="w-3 h-3" style={{ color: '#2A5C45' }} />
                    <span className="text-xs" style={{ color: '#2A5C45' }}>Certifié Refrent</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    style={{
                      color: i <= 4 ? '#F59E0B' : '#E8E4DF',
                      fill: i <= 4 ? '#F59E0B' : '#E8E4DF',
                    }}
                  />
                ))}
                <span className="text-xs ml-1" style={{ color: '#8A837C' }}>
                  4.0 · Membre Refrent
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: '#EAF2EC' }}
      >
        <Icon className="w-4 h-4" style={{ color: '#2A5C45' }} />
      </div>
      <div>
        <p className="text-xs mb-0.5" style={{ color: '#8A837C' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: '#1A1714' }}>{value}</p>
      </div>
    </div>
  );
}
