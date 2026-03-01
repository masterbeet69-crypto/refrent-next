import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { createServerSupabase } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest) {
  const profile = await requireUser();
  const body = await req.json().catch(() => ({}));
  const { full_name, phone, city_code, country_code } = body as Record<string, string>;

  const update: Record<string, unknown> = {};
  if (full_name   !== undefined) update.full_name    = full_name   || null;
  if (phone       !== undefined) update.phone        = phone       || null;
  if (city_code   !== undefined) update.city_code    = city_code   || null;
  if (country_code !== undefined) update.country_code = country_code || null;

  const sb = createServerSupabase();
  const { error } = await sb.from('profiles').update(update).eq('id', profile.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
