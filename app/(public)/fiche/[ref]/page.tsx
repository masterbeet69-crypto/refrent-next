import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { isValidRefCode } from '@/lib/utils/ref';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { StatusPill } from '@/components/ui/Pill';
import { RefCodeDisplay } from '@/components/property/RefCodeDisplay';
import { cityName, countryName } from '@/lib/utils/country';
import { formatPrice, formatDate } from '@/lib/utils/format';

interface Props { params: Promise<{ ref: string }> }

export default async function FichePage({ params }: Props) {
  const { ref: rawRef } = await params;
  const ref = rawRef.toUpperCase();
  if (!isValidRefCode(ref)) notFound();

  const sb = createServerSupabase();
  const { data: property } = await sb
    .from('properties')
    .select('*')
    .eq('ref_code', ref)
    .single();

  if (!property) notFound();

  const p = property;

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-surf rounded-r3 shadow-sh2 p-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <RefCodeDisplay code={p.ref_code} />
              <h1 className="font-display text-2xl text-ink mt-3">
                {p.property_type
                  ? p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1)
                  : 'Bien immobilier'
                }
                {' · '}
                {cityName(p.country_code, p.city_code)}, {countryName(p.country_code)}
              </h1>
              {p.district && <p className="text-ink3 text-sm mt-1">{p.district}</p>}
            </div>
            <StatusPill status={p.status} />
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {p.price && (
              <StatBox label="Prix" value={formatPrice(p.price, p.currency ?? 'FCFA')} />
            )}
            {p.rooms != null && (
              <StatBox label="Pièces" value={`${p.rooms} pièce${p.rooms > 1 ? 's' : ''}`} />
            )}
            {p.area_sqm != null && (
              <StatBox label="Surface" value={`${p.area_sqm} m²`} />
            )}
            {p.floor != null && (
              <StatBox label="Étage" value={p.floor === 0 ? 'RDC' : `${p.floor}e`} />
            )}
          </div>

          {p.description && (
            <div className="mb-6">
              <h2 className="font-semibold text-ink mb-2">Description</h2>
              <p className="text-ink3 text-sm leading-relaxed">{p.description}</p>
            </div>
          )}

          <div className="text-xs text-ink4 border-t border-brd pt-4 mt-4">
            Publié le {formatDate(p.created_at)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg2 rounded-r2 px-3 py-2">
      <div className="text-xs text-ink4">{label}</div>
      <div className="font-medium text-ink text-sm">{value}</div>
    </div>
  );
}
