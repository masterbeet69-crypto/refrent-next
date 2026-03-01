import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  await requireAdmin();
  const body = await req.json().catch(() => ({}));
  const { name, company, email, phone, website, notes } = body as Record<string, string>;

  if (!name?.trim() || !email?.trim()) {
    return Response.json({ error: 'Nom et email requis.' }, { status: 400 });
  }

  const sb = createServerSupabase();
  const { data, error } = await sb
    .from('advertisers')
    .insert({ name: name.trim(), company: company || null, email: email.trim(), phone: phone || null, website: website || null, notes: notes || null })
    .select('id')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true, id: data.id }, { status: 201 });
}
