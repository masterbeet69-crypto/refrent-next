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
      <h1 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Propriétés
      </h1>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#EFECE5' }}>
            <tr>
              {['Code REF', 'Ville', 'Type', 'Prix', 'Statut', 'Ajouté le'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#8A837C' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props?.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}>
                <td className="px-6 py-3 text-xs" style={{ color: '#1A1714', fontFamily: 'var(--font-mono)' }}>{p.ref_code}</td>
                <td className="px-6 py-3 text-sm" style={{ color: '#5A5550' }}>{cityName(p.country_code, p.city_code)}</td>
                <td className="px-6 py-3 text-sm capitalize" style={{ color: '#5A5550' }}>{p.property_type ?? '—'}</td>
                <td className="px-6 py-3 text-sm" style={{ color: '#1A1714' }}>
                  {p.price ? formatPrice(p.price, p.currency ?? 'FCFA') : '—'}
                </td>
                <td className="px-6 py-3"><StatusPill status={p.status} size="sm" /></td>
                <td className="px-6 py-3 text-xs" style={{ color: '#8A837C' }}>{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!props || props.length === 0) && (
          <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>Aucune propriété.</p>
        )}
      </div>
    </div>
  );
}
