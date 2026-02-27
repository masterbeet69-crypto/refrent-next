import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
  }

  const sb = createServerSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });

  const { session, user } = data;
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single();

  const res = NextResponse.json({ ok: true });
  const cookieOpts = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: session.expires_in,
  };
  res.cookies.set('rf_jwt', session.access_token, { ...cookieOpts, httpOnly: true });
  res.cookies.set('rf_role', profile?.role ?? 'user', { ...cookieOpts, httpOnly: false });
  return res;
}
