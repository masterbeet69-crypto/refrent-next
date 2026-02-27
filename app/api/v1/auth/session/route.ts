import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const jwt = req.cookies.get('rf_jwt')?.value;
  if (!jwt) return NextResponse.json({ authenticated: false });
  const sb = createServerSupabase();
  const { data: { user }, error } = await sb.auth.getUser(jwt);
  if (error || !user) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, user_id: user.id });
}
