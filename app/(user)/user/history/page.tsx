import { cookies } from 'next/headers';
import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';

export default async function UserHistoryPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;
  if (!jwt) return <p style={{ color: '#8A837C' }}>Session expirée.</p>;

  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return <p style={{ color: '#8A837C' }}>Session expirée.</p>;

  const { data: history } = await sb
    .from('search_logs')
    .select('ref_code, result_found, country_code, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Historique des recherches
      </h1>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#EFECE5' }}>
            <tr>
              {['Code REF', 'Trouvé', 'Date'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#8A837C' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history?.map((s, i) => (
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
                  <span className="text-xs font-medium" style={{ color: s.result_found ? '#2A5C45' : '#9B1C1C' }}>
                    {s.result_found ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs" style={{ color: '#8A837C' }}>{formatDate(s.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!history || history.length === 0) && (
          <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>Aucune recherche dans l&apos;historique.</p>
        )}
      </div>
    </div>
  );
}
