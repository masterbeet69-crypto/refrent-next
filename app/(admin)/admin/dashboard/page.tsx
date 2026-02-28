import { createServerSupabase } from '@/lib/supabase/server';
import { Users, Building2, Search, UserCheck, TrendingUp, Home } from 'lucide-react';
import { StatusPill } from '@/components/ui/Pill';
import { formatDate } from '@/lib/utils/format';
import { AdminCharts } from './AdminCharts';

async function getStats() {
  const sb = createServerSupabase();
  const [users, properties, logs, agents, available, searches7d] = await Promise.all([
    sb.from('profiles').select('*', { count: 'exact', head: true }),
    sb.from('properties').select('*', { count: 'exact', head: true }),
    sb.from('search_logs').select('*', { count: 'exact', head: true }),
    sb.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'agent'),
    sb.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    sb.from('search_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
  ]);
  return {
    users:      users.count      ?? 0,
    properties: properties.count ?? 0,
    searches:   logs.count       ?? 0,
    agents:     agents.count     ?? 0,
    available:  available.count  ?? 0,
    searches7d: searches7d.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const sb = createServerSupabase();

  const { data: recentProps } = await sb
    .from('properties')
    .select('ref_code, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const cards = [
    { label: 'Utilisateurs',       value: stats.users,      icon: Users,      bg: '#EAF2EC', iconColor: '#2A5C45' },
    { label: 'Agents',             value: stats.agents,     icon: UserCheck,  bg: '#EAF2EC', iconColor: '#2A5C45' },
    { label: 'Propriétés totales', value: stats.properties, icon: Building2,  bg: '#FEF3CD', iconColor: '#8A5A00' },
    { label: 'Disponibles',        value: stats.available,  icon: Home,       bg: '#EAF2EC', iconColor: '#2A5C45' },
    { label: 'Recherches totales', value: stats.searches,   icon: Search,     bg: '#F0EFEE', iconColor: '#6B6560' },
    { label: 'Recherches (7j)',    value: stats.searches7d, icon: TrendingUp, bg: '#EAF2EC', iconColor: '#2A5C45' },
  ];

  return (
    <div>
      <h1
        className="text-2xl mb-8"
        style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
      >
        Tableau de bord
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div
            key={c.label}
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: c.bg }}
            >
              <c.icon size={18} style={{ color: c.iconColor }} />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: '#8A837C' }}>{c.label}</p>
              <p
                className="text-3xl font-semibold"
                style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
              >
                {c.value.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AdminCharts stats={stats} />

      {/* Recent properties */}
      <div
        className="rounded-2xl overflow-hidden mt-8"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: '1px solid #E8E4DF' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: '#1A1714' }}>
            Propriétés récentes
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#EFECE5' }}>
            <tr>
              {['Code REF', 'Statut', 'Ajouté le'].map(h => (
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
            {recentProps?.map((p, i) => (
              <tr
                key={p.ref_code}
                style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}
              >
                <td
                  className="px-6 py-3 text-xs"
                  style={{ color: '#1A1714', fontFamily: 'var(--font-mono)' }}
                >
                  {p.ref_code}
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
        {(!recentProps || recentProps.length === 0) && (
          <p className="text-center py-8 text-sm" style={{ color: '#8A837C' }}>
            Aucune propriété.
          </p>
        )}
      </div>
    </div>
  );
}
