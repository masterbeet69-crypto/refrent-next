import { createServerSupabase } from '@/lib/supabase/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { StatusPill } from '@/components/ui/Pill';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/format';
import { CountrySelect } from './CountrySelect';
import { AdBanner } from '@/components/ads/AdBanner';

interface Props {
  searchParams: Promise<{ country?: string; city?: string; status?: string; type?: string }>;
}

const STATUS_FILTER_LABELS: Record<string, string> = {
  available:   'Disponible',
  reserved:    'Réservé',
  occupied:    'Occupé',
  unavailable: 'Indisponible',
};

export default async function BrowsePage({ searchParams }: Props) {
  const sp = await searchParams;
  const { country, city, status, type } = sp;

  const sb = createServerSupabase();
  let query = sb.from('properties').select('*').order('created_at', { ascending: false }).limit(60);
  if (country) query = query.eq('country_code', country);
  if (city)    query = query.eq('city_code', city);
  if (status)  query = query.eq('status', status);
  if (type)    query = query.eq('property_type', type);

  const { data: props } = await query;

  const activeParams = Object.fromEntries(
    Object.entries(sp).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1
          className="text-3xl mb-2"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
        >
          Explorer les biens
        </h1>
        <p className="text-sm mb-6" style={{ color: '#8A837C' }}>
          {props?.length ?? 0} bien{(props?.length ?? 0) !== 1 ? 's' : ''} trouvé{(props?.length ?? 0) !== 1 ? 's' : ''}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <CountrySelect defaultValue={country ?? ''} currentParams={activeParams} />

          {Object.entries(STATUS_FILTER_LABELS).map(([s, label]) => (
            <Link
              key={s}
              href={`/browse?${new URLSearchParams({ ...activeParams, status: s })}`}
              className="px-3 py-2 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: status === s ? '#2A5C45' : '#FFFFFF',
                color: status === s ? '#FFFFFF' : '#5A5550',
                border: `1px solid ${status === s ? '#2A5C45' : '#E8E4DF'}`,
              }}
            >
              {label}
            </Link>
          ))}

          {(country || city || status || type) && (
            <Link
              href="/browse"
              className="px-3 py-2 rounded-lg text-xs transition-colors"
              style={{ border: '1px solid #E8E4DF', color: '#8A837C', backgroundColor: '#FFFFFF' }}
            >
              Réinitialiser
            </Link>
          )}
        </div>

        {/* Ad banner */}
        <AdBanner placement="browse_inline" className="mb-2" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {props?.map(p => (
            <Link
              key={p.id}
              href={`/fiche/${p.ref_code}`}
              className="rounded-2xl p-5 block transition-shadow hover:shadow-md"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className="text-xs"
                  style={{ color: '#8A837C', fontFamily: 'var(--font-mono)' }}
                >
                  {p.ref_code}
                </span>
                <StatusPill status={p.status} size="sm" />
              </div>
              <div className="font-medium mb-1" style={{ color: '#1A1714' }}>
                {p.city_name ?? p.city_code}
              </div>
              {p.district && (
                <div className="text-sm" style={{ color: '#8A837C' }}>{p.district}</div>
              )}
              {p.price && (
                <div className="font-semibold mt-2 text-sm" style={{ color: '#2A5C45' }}>
                  {formatPrice(p.price, p.currency ?? 'FCFA')}
                </div>
              )}
            </Link>
          ))}
        </div>

        {(!props || props.length === 0) && (
          <div className="text-center py-16">
            <p style={{ color: '#8A837C' }}>Aucun bien trouvé pour ces critères.</p>
            <Link
              href="/browse"
              className="hover:underline text-sm mt-2 inline-block"
              style={{ color: '#2A5C45' }}
            >
              Voir tous les biens
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
