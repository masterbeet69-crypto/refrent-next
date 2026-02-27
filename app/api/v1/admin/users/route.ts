import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/admin-guard';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error;

  const { searchParams } = req.nextUrl;
  const role  = searchParams.get('role');
  const page  = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = 25;
  const sb    = createServerSupabase();

  let query = sb.from('profiles').select('*', { count: 'exact' });
  if (role) query = query.eq('role', role);

  const { data, count, error } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profiles: data ?? [], total: count ?? 0, page, limit });
}

export async function PATCH(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error;

  const { id, role } = await req.json();
  const VALID_ROLES = ['user', 'agent', 'advertiser', 'admin'];
  if (!id || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  const sb = createServerSupabase();
  const { error } = await sb.from('profiles').update({ role }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
