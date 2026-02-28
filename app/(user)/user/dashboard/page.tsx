import { cookies } from 'next/headers';
import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { RefInput } from '@/components/search/RefInput';
import { formatDate } from '@/lib/utils/format';

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;

  let recentSearches: Array<{ ref_code: string; result_found: boolean; created_at: string }> = [];

  if (jwt) {
    const sb = createServerSupabase();
    const { data: { user } } = await sb.auth.getUser(jwt);
    if (user) {
      const { data } = await sb
        .from('search_logs')
        .select('ref_code, result_found, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      recentSearches = data ?? [];
    }
  }

  return (
    <div>
      <h1
        className="text-2xl mb-8"
        style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
      >
        Tableau de bord
      </h1>

      {/* Search card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <h2
          className="text-base font-semibold mb-4"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
        >
          Vérifier un code REF
        </h2>
        <RefInput />
      </div>

      {/* Recent searches */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #E8E4DF' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: '#1A1714' }}>
            Recherches récentes
          </h2>
          <Link
            href="/user/history"
            className="text-xs font-medium"
            style={{ color: '#2A5C45' }}
          >
            Voir tout →
          </Link>
        </div>
        {recentSearches.length > 0 ? (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#EFECE5' }}>
              <tr>
                {['Code REF', 'Trouvé', 'Date'].map(h => (
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
              {recentSearches.map((s, i) => (
                <tr key={i} style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}>
                  <td className="px-6 py-3">
                    <Link
                      href={`/fiche/${s.ref_code}`}
                      className="text-xs font-medium hover:underline"
                      style={{ color: '#2A5C45', fontFamily: 'var(--font-mono)' }}
                    >
                      {s.ref_code}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className="text-xs font-medium"
                      style={{ color: s.result_found ? '#2A5C45' : '#9B1C1C' }}
                    >
                      {s.result_found ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs" style={{ color: '#8A837C' }}>
                    {formatDate(s.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>
            Aucune recherche effectuée.
          </p>
        )}
      </div>
    </div>
  );
}
