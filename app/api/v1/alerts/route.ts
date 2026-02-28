import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { ref_code } = body as { ref_code?: string };
  if (!ref_code) return Response.json({ error: 'ref_code requis' }, { status: 400 });

  const sb = createServerSupabase();
  const { error } = await sb.from('alerts').upsert(
    { user_id: user.id, ref_code },
    { onConflict: 'user_id,ref_code' },
  );

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { ref_code } = body as { ref_code?: string };
  if (!ref_code) return Response.json({ error: 'ref_code requis' }, { status: 400 });

  const sb = createServerSupabase();
  await sb.from('alerts').delete().eq('user_id', user.id).eq('ref_code', ref_code);

  return Response.json({ ok: true });
}

export async function GET() {
  const user = await getSession();
  if (!user) return Response.json({ alerts: [] });

  const sb = createServerSupabase();
  const { data } = await sb
    .from('alerts')
    .select('ref_code, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return Response.json({ alerts: data ?? [] });
}
