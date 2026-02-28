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
      <h1 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Utilisateurs
      </h1>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#EFECE5' }}>
            <tr>
              {['Nom', 'Email', 'Rôle', 'Pays', 'Inscrit le', 'Actif'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#8A837C' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles?.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}>
                <td className="px-6 py-3 text-sm font-medium" style={{ color: '#1A1714' }}>{p.full_name}</td>
                <td className="px-6 py-3 text-xs" style={{ color: '#8A837C' }}>{p.email}</td>
                <td className="px-6 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                    style={{ backgroundColor: '#EAF2EC', color: '#2A5C45' }}
                  >
                    {p.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm" style={{ color: '#5A5550' }}>
                  {p.country_code ? countryName(p.country_code) : '—'}
                </td>
                <td className="px-6 py-3 text-xs" style={{ color: '#8A837C' }}>{formatDate(p.created_at)}</td>
                <td className="px-6 py-3">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.is_active ? '#2A5C45' : '#9B1C1C' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!profiles || profiles.length === 0) && (
          <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>Aucun utilisateur.</p>
        )}
      </div>
    </div>
  );
}
