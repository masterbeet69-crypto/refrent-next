import { cookies } from 'next/headers';
import { createServerSupabase } from '@/lib/supabase/server';
import { StatusPill } from '@/components/ui/Pill';
import { formatDate } from '@/lib/utils/format';

export default async function AgentDashboardPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;
  if (!jwt) return <p className="text-ink3">Session expirée.</p>;

  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return <p className="text-ink3">Session expirée.</p>;

  const { data: properties } = await sb
    .from('properties')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const props = properties ?? [];
  const byStatus = {
    available:   props.filter(p => p.status === 'available').length,
    reserved:    props.filter(p => p.status === 'reserved').length,
    occupied:    props.filter(p => p.status === 'occupied').length,
    unavailable: props.filter(p => p.status === 'unavailable').length,
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(byStatus).map(([status, count]) => (
          <div key={status} className="bg-surf rounded-r3 shadow-sh1 p-4">
            <StatusPill status={status} />
            <div className="font-display text-3xl text-ink mt-2">{count}</div>
          </div>
        ))}
      </div>

      <div className="bg-surf rounded-r3 shadow-sh1 overflow-hidden">
        <div className="px-5 py-3 border-b border-brd">
          <h2 className="font-semibold text-ink text-sm">Mes biens récents</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-bg2 text-ink3 text-xs uppercase">
            <tr>
              {['Code REF', 'Statut', 'Ajouté le'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brd">
            {props.slice(0, 10).map(p => (
              <tr key={p.id} className="hover:bg-bg">
                <td className="px-4 py-3 font-mono text-xs text-ink">{p.ref_code}</td>
                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                <td className="px-4 py-3 text-ink3 text-xs">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {props.length === 0 && (
          <p className="text-center py-8 text-ink3 text-sm">Aucun bien publié.</p>
        )}
      </div>
    </div>
  );
}
