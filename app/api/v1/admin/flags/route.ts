import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/admin-guard';

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error;

  const sb = createServerSupabase();
  const { data, error } = await sb
    .from('feature_flags')
    .select('*')
    .order('key');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ flags: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error;

  const { key, enabled } = await req.json();
  if (!key || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  const sb = createServerSupabase();
  const { error } = await sb
    .from('feature_flags')
    .update({ enabled, updated_at: new Date().toISOString() })
    .eq('key', key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
