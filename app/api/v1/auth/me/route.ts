import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const jwt = req.cookies.get('rf_jwt')?.value;
  if (!jwt) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const sb = createServerSupabase();
  const { data: { user }, error } = await sb.auth.getUser(jwt);
  if (error || !user) return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  return NextResponse.json({ profile });
}
