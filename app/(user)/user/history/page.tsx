import { cookies } from 'next/headers';
import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';

export default async function UserHistoryPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;
  if (!jwt) return <p className="text-ink3">Session expirée.</p>;

  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return <p className="text-ink3">Session expirée.</p>;

  const { data: history } = await sb
    .from('search_logs')
    .select('ref_code, result_found, country_code, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Historique des recherches</h1>
      <div className="bg-surf rounded-r3 shadow-sh1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg2 text-ink3 text-xs uppercase">
            <tr>
              {['Code REF', 'Trouvé', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brd">
            {history?.map((s, i) => (
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
        {(!history || history.length === 0) && (
          <p className="text-center py-8 text-ink3 text-sm">Aucune recherche dans l&apos;historique.</p>
        )}
      </div>
    </div>
  );
}
