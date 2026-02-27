import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/admin-guard';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error;

  const { searchParams } = req.nextUrl;
  const status  = searchParams.get('status');
  const country = searchParams.get('country');
  const page    = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit   = 25;
  const sb      = createServerSupabase();

  let query = sb.from('properties').select('*', { count: 'exact' });
  if (status)  query = query.eq('status', status);
  if (country) query = query.eq('country_code', country);

  const { data, count, error } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ properties: data ?? [], total: count ?? 0, page, limit });
}

export async function PATCH(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error;

  const { id, status } = await req.json();
  const VALID_STATUSES = ['available', 'reserved', 'occupied', 'unavailable'];
  if (!id || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  const sb = createServerSupabase();
  const { error } = await sb.from('properties')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
