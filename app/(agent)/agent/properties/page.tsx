import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { StatusPill } from '@/components/ui/Pill';
import { formatPrice, formatDate } from '@/lib/utils/format';

export default async function AgentPropertiesPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;
  if (!jwt) return <p className="text-ink3">Session expirée.</p>;

  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return <p className="text-ink3">Session expirée.</p>;

  const { data: props } = await sb
    .from('properties')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Mes biens</h1>
        <Link
          href="/agent/publish"
          className="bg-acc text-surf px-4 py-2 rounded-r2 text-sm hover:bg-accd transition-colors"
        >
          + Publier un bien
        </Link>
      </div>

      <div className="bg-surf rounded-r3 shadow-sh1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg2 text-ink3 text-xs uppercase">
            <tr>
              {['Code REF', 'District', 'Prix', 'Statut', 'Ajouté le'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brd">
            {props?.map(p => (
              <tr key={p.id} className="hover:bg-bg">
                <td className="px-4 py-3 font-mono text-xs text-ink">{p.ref_code}</td>
                <td className="px-4 py-3 text-ink3">{p.district ?? '—'}</td>
                <td className="px-4 py-3 text-ink">
                  {p.price ? formatPrice(p.price, p.currency ?? 'FCFA') : '—'}
                </td>
                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                <td className="px-4 py-3 text-ink3 text-xs">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!props || props.length === 0) && (
          <p className="text-center py-8 text-ink3 text-sm">
            Aucun bien.{' '}
            <Link href="/agent/publish" className="text-acc hover:underline">
              Publiez votre premier bien.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
