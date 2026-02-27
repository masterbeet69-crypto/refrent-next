import { createServerSupabase } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/format';
import { countryName, cityName } from '@/lib/utils/country';

export default async function AdminAgentsPage() {
  const sb = createServerSupabase();
  const { data: agents } = await sb
    .from('profiles')
    .select('*')
    .eq('role', 'agent')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Agents</h1>
      <div className="bg-surf rounded-r3 shadow-sh1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg2 text-ink3 text-xs uppercase">
            <tr>
              {['Nom', 'Email', 'Pays', 'Ville', 'Inscrit le', 'Actif'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brd">
            {agents?.map(a => (
              <tr key={a.id} className="hover:bg-bg">
                <td className="px-4 py-3 font-medium text-ink">{a.full_name}</td>
                <td className="px-4 py-3 text-ink3 text-xs">{a.email}</td>
                <td className="px-4 py-3 text-ink3">
                  {a.country_code ? countryName(a.country_code) : '—'}
                </td>
                <td className="px-4 py-3 text-ink3">
                  {a.country_code && a.city_code ? cityName(a.country_code, a.city_code) : '—'}
                </td>
                <td className="px-4 py-3 text-ink3 text-xs">{formatDate(a.created_at)}</td>
                <td className="px-4 py-3">
                  <span className={`w-2 h-2 rounded-full inline-block ${a.is_active ? 'bg-acc' : 'bg-err'}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!agents || agents.length === 0) && (
          <p className="text-center py-8 text-ink3 text-sm">Aucun agent.</p>
        )}
      </div>
    </div>
  );
}
