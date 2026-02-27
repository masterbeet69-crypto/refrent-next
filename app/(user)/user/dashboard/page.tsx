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
      <h1 className="font-display text-2xl text-ink mb-6">Tableau de bord</h1>

      <div className="bg-surf rounded-r3 shadow-sh1 p-6 mb-6">
        <h2 className="font-semibold text-ink mb-3">Vérifier un code REF</h2>
        <RefInput />
      </div>

      <div className="bg-surf rounded-r3 shadow-sh1 overflow-hidden">
        <div className="px-5 py-3 border-b border-brd flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Recherches récentes</h2>
          <Link href="/user/history" className="text-xs text-acc hover:underline">
            Voir tout
          </Link>
        </div>
        {recentSearches.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-bg2 text-ink3 text-xs uppercase">
              <tr>
                {['Code REF', 'Trouvé', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brd">
              {recentSearches.map((s, i) => (
                <tr key={i} className="hover:bg-bg">
                  <td className="px-4 py-3">
                    <Link href={`/fiche/${s.ref_code}`} className="font-mono text-xs text-acc hover:underline">
                      {s.ref_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${s.result_found ? 'text-acc' : 'text-err'}`}>
                      {s.result_found ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink3 text-xs">{formatDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-8 text-ink3 text-sm">Aucune recherche effectuée.</p>
        )}
      </div>
    </div>
  );
}
