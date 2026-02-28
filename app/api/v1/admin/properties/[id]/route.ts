import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { createServerSupabase } from '@/lib/supabase/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const { status, type, city, neighborhood, price, description } = body as Record<string, unknown>;

  const update: Record<string, unknown> = {};
  if (status      !== undefined) update.status       = status;
  if (type        !== undefined) update.type         = type;
  if (city        !== undefined) update.city         = city;
  if (neighborhood !== undefined) update.neighborhood = neighborhood;
  if (price       !== undefined) update.price        = price;
  if (description !== undefined) update.description  = description;

  const sb = createServerSupabase();
  const { error } = await sb.from('properties').update(update).eq('id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
