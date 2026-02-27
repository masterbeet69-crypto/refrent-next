import { createServerSupabase } from '@/lib/supabase/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { StatusPill } from '@/components/ui/Pill';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/format';
import { CountrySelect } from './CountrySelect';

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
        <h1 className="font-display text-3xl text-ink mb-2">Explorer les biens</h1>
        <p className="text-ink3 text-sm mb-6">
          {props?.length ?? 0} bien{(props?.length ?? 0) !== 1 ? 's' : ''} trouvé{(props?.length ?? 0) !== 1 ? 's' : ''}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <CountrySelect defaultValue={country ?? ''} currentParams={activeParams} />

          {Object.entries(STATUS_FILTER_LABELS).map(([s, label]) => (
            <Link
              key={s}
              href={`/browse?${new URLSearchParams({ ...activeParams, status: s })}`}
              className={`px-3 py-2 rounded-r2 border text-xs transition-colors
                ${status === s
                  ? 'bg-acc text-surf border-acc'
                  : 'bg-surf text-ink3 border-brd hover:border-acc'}`}
            >
              {label}
            </Link>
          ))}

          {(country || city || status || type) && (
            <Link
              href="/browse"
              className="px-3 py-2 rounded-r2 border border-brd text-xs text-ink3 hover:border-acc transition-colors"
            >
              Réinitialiser
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {props?.map(p => (
            <Link
              key={p.id}
              href={`/fiche/${p.ref_code}`}
              className="bg-surf rounded-r3 shadow-sh1 p-5 hover:shadow-sh2 transition-shadow block"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs text-ink3">{p.ref_code}</span>
                <StatusPill status={p.status} />
              </div>
              <div className="text-ink font-medium mb-1">
                {p.city_name ?? p.city_code}
              </div>
              {p.district && (
                <div className="text-ink3 text-sm">{p.district}</div>
              )}
              {p.price && (
                <div className="text-acc font-semibold mt-2 text-sm">
                  {formatPrice(p.price, p.currency ?? 'FCFA')}
                </div>
              )}
            </Link>
          ))}
        </div>

        {(!props || props.length === 0) && (
          <div className="text-center py-16">
            <p className="text-ink3">Aucun bien trouvé pour ces critères.</p>
            <Link href="/browse" className="text-acc hover:underline text-sm mt-2 inline-block">
              Voir tous les biens
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
