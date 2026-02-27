import { createServerSupabase } from '@/lib/supabase/server';
import {
  Users, Building2, Search, UserCheck, Home, TrendingUp,
} from 'lucide-react';

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

  const cards = [
    { label: 'Utilisateurs',       value: stats.users,      icon: Users,      color: 'text-acc' },
    { label: 'Agents',             value: stats.agents,     icon: UserCheck,  color: 'text-inf' },
    { label: 'Propriétés',         value: stats.properties, icon: Building2,  color: 'text-warn' },
    { label: 'Disponibles',        value: stats.available,  icon: Home,       color: 'text-acc' },
    { label: 'Recherches totales', value: stats.searches,   icon: Search,     color: 'text-ink3' },
    { label: 'Recherches 7j',      value: stats.searches7d, icon: TrendingUp, color: 'text-accd' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-surf rounded-r3 shadow-sh1 p-5 flex items-start gap-3">
            <div className={`mt-1 ${c.color}`}>
              <c.icon size={20} />
            </div>
            <div>
              <div className="text-ink3 text-xs mb-1">{c.label}</div>
              <div className="font-display text-3xl text-ink">
                {c.value.toLocaleString('fr-FR')}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surf rounded-r3 shadow-sh1 p-5">
        <h2 className="font-semibold text-ink mb-3 text-sm">Activité récente</h2>
        <p className="text-ink3 text-sm">
          Les graphiques d&apos;activité seront disponibles après connexion des données en temps réel.
        </p>
      </div>
    </div>
  );
}
