import { createServerSupabase } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/format';
import { countryName } from '@/lib/utils/country';

export default async function AdminUsersPage() {
  const sb = createServerSupabase();
  const { data: profiles } = await sb
    .from('profiles')
    .select('*')
    .neq('role', 'agent')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Utilisateurs</h1>
      <div className="bg-surf rounded-r3 shadow-sh1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg2 text-ink3 text-xs uppercase">
            <tr>
              {['Nom', 'Email', 'Rôle', 'Pays', 'Inscrit le', 'Actif'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brd">
            {profiles?.map(p => (
              <tr key={p.id} className="hover:bg-bg">
                <td className="px-4 py-3 font-medium text-ink">{p.full_name}</td>
                <td className="px-4 py-3 text-ink3 text-xs">{p.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-accl text-acc text-xs px-2 py-0.5 rounded-rf capitalize">
                    {p.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink3">
                  {p.country_code ? countryName(p.country_code) : '—'}
                </td>
                <td className="px-4 py-3 text-ink3 text-xs">{formatDate(p.created_at)}</td>
                <td className="px-4 py-3">
                  <span className={`w-2 h-2 rounded-full inline-block ${p.is_active ? 'bg-acc' : 'bg-err'}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!profiles || profiles.length === 0) && (
          <p className="text-center py-8 text-ink3 text-sm">Aucun utilisateur.</p>
        )}
      </div>
    </div>
  );
}
