import { createServerSupabase } from '@/lib/supabase/server';
import { StatusPill } from '@/components/ui/Pill';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { cityName } from '@/lib/utils/country';

export default async function AdminPropertiesPage() {
  const sb = createServerSupabase();
  const { data: props } = await sb
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Propriétés</h1>
      <div className="bg-surf rounded-r3 shadow-sh1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg2 text-ink3 text-xs uppercase">
            <tr>
              {['Code REF', 'Ville', 'Type', 'Prix', 'Statut', 'Ajouté le'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brd">
            {props?.map(p => (
              <tr key={p.id} className="hover:bg-bg">
                <td className="px-4 py-3 font-mono text-xs text-ink">{p.ref_code}</td>
                <td className="px-4 py-3 text-ink3">
                  {cityName(p.country_code, p.city_code)}
                </td>
                <td className="px-4 py-3 text-ink3 capitalize">{p.property_type ?? '—'}</td>
                <td className="px-4 py-3 text-ink">
                  {p.price ? formatPrice(p.price, p.currency ?? 'FCFA') : '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-4 py-3 text-ink3 text-xs">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!props || props.length === 0) && (
          <p className="text-center py-8 text-ink3 text-sm">Aucune propriété.</p>
        )}
      </div>
    </div>
  );
}
