import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { StatusPill } from '@/components/ui/Pill';
import { formatPrice, formatDate } from '@/lib/utils/format';

export default async function AgentPropertiesPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;
  if (!jwt) return <p style={{ color: '#8A837C' }}>Session expirée.</p>;

  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return <p style={{ color: '#8A837C' }}>Session expirée.</p>;

  const { data: props } = await sb
    .from('properties')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
          Mes biens
        </h1>
        <Link
          href="/agent/publish"
          className="px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#2A5C45' }}
        >
          + Publier un bien
        </Link>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#EFECE5' }}>
            <tr>
              {['Code REF', 'District', 'Prix', 'Statut', 'Ajouté le'].map(h => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#8A837C' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props?.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}>
                <td className="px-6 py-3 text-xs" style={{ color: '#1A1714', fontFamily: 'var(--font-mono)' }}>
                  {p.ref_code}
                </td>
                <td className="px-6 py-3 text-sm" style={{ color: '#5A5550' }}>{p.district ?? '—'}</td>
                <td className="px-6 py-3 text-sm" style={{ color: '#1A1714' }}>
                  {p.price ? formatPrice(p.price, p.currency ?? 'FCFA') : '—'}
                </td>
                <td className="px-6 py-3">
                  <StatusPill status={p.status} size="sm" />
                </td>
                <td className="px-6 py-3 text-xs" style={{ color: '#8A837C' }}>
                  {formatDate(p.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!props || props.length === 0) && (
          <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>
            Aucun bien.{' '}
            <Link href="/agent/publish" className="font-medium" style={{ color: '#2A5C45' }}>
              Publiez votre premier bien.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
