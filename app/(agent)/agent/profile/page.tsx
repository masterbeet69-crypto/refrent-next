import { requireAgent } from '@/lib/auth/session';
import { createServerSupabase } from '@/lib/supabase/server';
import { AgentProfileForm } from './AgentProfileForm';

export default async function AgentProfilePage() {
  const profile = await requireAgent();
  const sb = createServerSupabase();
  const { data: agent } = await sb
    .from('agents')
    .select('name, email, phone, agency_name, bio, city, kyc_status, status')
    .eq('user_id', profile.id)
    .single();

  if (!agent) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
          Mon profil
        </h1>
        <p className="text-sm" style={{ color: '#8A837C' }}>
          Profil agent introuvable. Contactez l&apos;administrateur.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Mon profil agent
      </h1>
      <AgentProfileForm agent={agent} />
    </div>
  );
}
