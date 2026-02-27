import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

export async function getSession() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('rf_jwt')?.value;
  if (!jwt) return null;
  const sb = createServerSupabase();
  const { data: { user }, error } = await sb.auth.getUser(jwt);
  if (error || !user) return null;
  return user;
}

export async function getCurrentProfile() {
  const user = await getSession();
  if (!user) return null;
  const sb = createServerSupabase();
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
  return data ?? null;
}

export async function requireUser() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login?next=/user/dashboard');
  return profile;
}

export async function requireAgent() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'agent') redirect('/login?error=unauthorized');
  return profile;
}

export async function requireAdvertiser() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'advertiser') redirect('/login?error=unauthorized');
  return profile;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'admin') redirect('/login?error=unauthorized');
  return profile;
}
