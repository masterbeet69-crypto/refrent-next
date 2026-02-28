import { createServerSupabase } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/format';
import { Megaphone, ExternalLink, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

async function fetchAdvertisersData() {
  const sb = createServerSupabase();
  const [{ data: advertisers, error: ae }, { data: campaigns, error: ce }] = await Promise.all([
    sb.from('advertisers').select('*').order('created_at', { ascending: false }),
    sb.from('ad_campaigns').select('*, advertisers(name)').order('created_at', { ascending: false }),
  ]);
  return { advertisers, campaigns, needsMigration: !!(ae || ce) };
}

export default async function AdminAdvertisersPage() {
  const { advertisers, campaigns, needsMigration } = await fetchAdvertisersData();

  if (needsMigration) {
    return (
      <div>
        <h1 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
          Annonceurs
        </h1>
        <div
          className="rounded-2xl p-8 space-y-4"
          style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#8A5A00' }} />
            <h2 className="font-semibold" style={{ color: '#8A5A00' }}>Migration requise</h2>
          </div>
          <p className="text-sm" style={{ color: '#8A5A00' }}>
            La table <code className="px-1 py-0.5 rounded" style={{ backgroundColor: '#FEF3CD' }}>advertisers</code> n&apos;existe pas encore.
            Exécutez le fichier de migration dans le SQL Editor de Supabase.
          </p>
          <div
            className="rounded-lg p-4 text-xs font-mono"
            style={{ backgroundColor: '#1A1714', color: '#EAF2EC' }}
          >
            docs/migrations/002_advertisers.sql
          </div>
          <p className="text-sm" style={{ color: '#8A5A00' }}>
            Copiez le contenu de ce fichier et exécutez-le dans{' '}
            <a
              href="https://supabase.com/dashboard/project/ofixrazipcbywhhqxbxb/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              Supabase SQL Editor ↗
            </a>
          </p>
        </div>
      </div>
    );
  }

  const activeAds = campaigns?.filter(c => c.is_active) ?? [];
  const totalImpressions = campaigns?.reduce((s, c) => s + (c.impressions ?? 0), 0) ?? 0;
  const totalClicks = campaigns?.reduce((s, c) => s + (c.clicks ?? 0), 0) ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
          Annonceurs
        </h1>
        <Link
          href="/admin/advertisers/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#2A5C45' }}
        >
          <Megaphone size={16} />
          Nouvel annonceur
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Annonceurs actifs', value: advertisers?.filter(a => a.is_active).length ?? 0, color: '#2A5C45', bg: '#EAF2EC' },
          { label: 'Campagnes actives', value: activeAds.length, color: '#3730A3', bg: '#EEF2FF' },
          { label: 'Impressions totales', value: totalImpressions.toLocaleString('fr'), color: '#8A5A00', bg: '#FEF3CD' },
          { label: 'Clics totaux', value: totalClicks.toLocaleString('fr'), color: '#9B1C1C', bg: '#FDEDED' },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A837C' }}>{label}</p>
            <p
              className="text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-fraunces)', color }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Advertisers table */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#1A1714' }}>Liste des annonceurs</h2>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#EFECE5' }}>
              <tr>
                {['Nom', 'Entreprise', 'Email', 'Site web', 'Inscrit le', 'Actif'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#8A837C' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {advertisers?.map((a, i) => (
                <tr key={a.id} style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: '#1A1714' }}>{a.name}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: '#5A5550' }}>{a.company ?? '—'}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#8A837C' }}>{a.email}</td>
                  <td className="px-5 py-3">
                    {a.website ? (
                      <a
                        href={a.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs"
                        style={{ color: '#2A5C45' }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {a.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#8A837C' }}>{formatDate(a.created_at)}</td>
                  <td className="px-5 py-3">
                    {a.is_active
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: '#2A5C45' }} />
                      : <XCircle className="w-4 h-4" style={{ color: '#9B1C1C' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!advertisers || advertisers.length === 0) && (
            <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>Aucun annonceur. Ajoutez-en un pour commencer.</p>
          )}
        </div>
      </div>

      {/* Campaigns table */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#1A1714' }}>Campagnes publicitaires</h2>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#EFECE5' }}>
              <tr>
                {['Titre', 'Annonceur', 'Placement', 'Impressions', 'Clics', 'Fin', 'Active'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#8A837C' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns?.map((c, i) => {
                const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={c.id} style={{ borderTop: i > 0 ? '1px solid #F0EFEE' : 'none' }}>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: '#1A1714' }}>{c.title}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: '#5A5550' }}>
                      {(c.advertisers as { name: string } | null)?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}
                      >
                        {c.placement}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: '#5A5550' }}>
                      {(c.impressions as number).toLocaleString('fr')}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: '#5A5550' }}>
                      {(c.clicks as number).toLocaleString('fr')}
                      <span className="text-xs ml-1" style={{ color: '#8A837C' }}>({ctr}%)</span>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: '#8A837C' }}>
                      {c.ends_at ? formatDate(c.ends_at as string) : 'Sans fin'}
                    </td>
                    <td className="px-5 py-3">
                      {c.is_active
                        ? <CheckCircle2 className="w-4 h-4" style={{ color: '#2A5C45' }} />
                        : <XCircle className="w-4 h-4" style={{ color: '#9B1C1C' }} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!campaigns || campaigns.length === 0) && (
            <p className="text-center py-10 text-sm" style={{ color: '#8A837C' }}>Aucune campagne configurée.</p>
          )}
        </div>
      </div>
    </div>
  );
}
