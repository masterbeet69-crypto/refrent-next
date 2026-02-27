import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/admin-guard';

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error;

  let body: { password?: string; users?: number; agents?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 });
  }

  const { password, users = 450, agents = 50 } = body;

  if (!password || password !== process.env.ADMIN_SEED_PASSWORD) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 403 });
  }

  const sb = createServerSupabase();
  const { data, error } = await sb.rpc('seed_bulk_data', {
    p_users:  Math.min(users,  500),
    p_agents: Math.min(agents, 100),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, result: data });
}
