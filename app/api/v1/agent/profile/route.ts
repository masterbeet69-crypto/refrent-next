import { NextRequest } from 'next/server';
import { requireAgent } from '@/lib/auth/session';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const profile = await requireAgent();
  const sb = createServerSupabase();
  const { data, error } = await sb
    .from('agents')
    .select('*')
    .eq('user_id', profile.id)
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ agent: data });
}

export async function PATCH(req: NextRequest) {
  const profile = await requireAgent();
  const body = await req.json().catch(() => ({}));
  const { name, phone, agency_name, bio, city } = body as Record<string, string>;

  const update: Record<string, unknown> = {};
  if (name        !== undefined) update.name        = name        || null;
  if (phone       !== undefined) update.phone       = phone       || null;
  if (agency_name !== undefined) update.agency_name = agency_name || null;
  if (bio         !== undefined) update.bio         = bio         || null;
  if (city        !== undefined) update.city        = city        || null;

  const sb = createServerSupabase();
  const { error } = await sb.from('agents').update(update).eq('user_id', profile.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
