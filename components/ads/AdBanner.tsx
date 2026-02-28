import { createServerSupabase } from '@/lib/supabase/server';
import { ExternalLink } from 'lucide-react';

interface Props {
  placement: 'landing_hero' | 'browse_inline' | 'fiche_sidebar' | 'global_banner';
  className?: string;
}

export async function AdBanner({ placement, className = '' }: Props) {
  let campaign: Record<string, unknown> | null = null;

  try {
    const sb = createServerSupabase();
    const { data } = await sb
      .from('ad_campaigns')
      .select('*, advertisers(name, logo_url)')
      .eq('placement', placement)
      .eq('is_active', true)
      .or('ends_at.is.null,ends_at.gt.' + new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    campaign = data;
  } catch {
    // Table might not exist yet → silently return nothing
    return null;
  }

  if (!campaign) return null;

  const advertiser = campaign.advertisers as { name?: string; logo_url?: string } | null;

  return (
    <a
      href={campaign.link_url as string}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`block rounded-2xl overflow-hidden transition-opacity hover:opacity-90 ${className}`}
      style={{
        backgroundColor: '#1A1714',
        textDecoration: 'none',
      }}
    >
      {campaign.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={campaign.image_url as string}
          alt={campaign.title as string}
          className="w-full object-cover"
          style={{ maxHeight: 120 }}
        />
      ) : (
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#2A5C45', color: '#FFFFFF' }}
              >
                Annonce
              </span>
              {advertiser?.name && (
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {advertiser.name}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white truncate">
              {campaign.title as string}
            </p>
            {(campaign.description as string | null | undefined) && (
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {String(campaign.description)}
              </p>
            )}
          </div>
          <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
        </div>
      )}
    </a>
  );
}
