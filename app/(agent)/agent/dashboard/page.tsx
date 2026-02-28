import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { StatusPill } from '@/components/ui/Pill';
import { formatDate } from '@/lib/utils/format';
import { PlusCircle } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  available:   '#2A5C45',
  reserved:    '#8A5A00',
  occupied:    '#9B1C1C',
  unavailable: '#6B6560',
};

export default async function AgentDashboardPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;
  if (!jwt) return <p style={{ color: '#8A837C' }}>Session expirée.</p>;

  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return <p style={{ color: '#8A837C' }}>Session expirée.</p>;

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
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
        >
          Tableau de bord
        </h1>
        <Link
          href="/agent/publish"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#2A5C45' }}
        >
          <PlusCircle size={16} />
          Publier un bien
        </Link>
      </div>

      {/* Status count cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(byStatus).map(([status, count]) => (
          <div
            key={status}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,.06)',
              borderLeft: `4px solid ${STATUS_COLORS[status] ?? '#6B6560'}`,
            }}
          >
            <StatusPill status={status} showDot={false} size="sm" />
            <p
              className="text-4xl font-semibold mt-3"
              style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
            >
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* Recent properties table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #E8E4DF' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: '#1A1714' }}>
            Mes biens récents
          </h2>
          <Link
            href="/agent/properties"
            className="text-xs font-medium"
            style={{ color: '#2A5C45' }}
          >
            Voir tout →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#EFECE5' }}>
            <tr>
              {['Code REF', 'Statut', 'Ajouté le', ''].map(h => (
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
            {props.slice(0, 10).map((p, i) => (
              <tr
                key={p.id}
                style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}
              >
                <td
                  className="px-6 py-3 text-xs font-medium"
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
                <td className="px-6 py-3">
                  <Link
                    href={`/fiche/${p.ref_code}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
                  >
                    Voir →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {props.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm mb-4" style={{ color: '#8A837C' }}>
              Aucun bien publié pour l&apos;instant.
            </p>
            <Link
              href="/agent/publish"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#2A5C45' }}
            >
              <PlusCircle size={16} />
              Publier votre premier bien
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
