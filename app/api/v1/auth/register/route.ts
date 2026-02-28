import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

const ALLOWED_ROLES = ['user', 'agent', 'advertiser'] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; full_name?: string; role?: string; country_code?: string; city_code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const { email, password, full_name, role, country_code, city_code } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
  }

  if (!ALLOWED_ROLES.includes(role as AllowedRole)) {
    return NextResponse.json({ error: 'Rôle invalide.' }, { status: 400 });
  }

  const sb = createServerSupabase();
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role, country_code, city_code },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Créer le profil (le trigger le fait aussi, upsert pour éviter les doublons)
  await sb.from('profiles').upsert({
    id: data.user.id,
    role: role as AllowedRole,
    full_name: full_name!,
    country_code: country_code ?? null,
    city_code: city_code ?? null,
    is_active: true,
  }, { onConflict: 'id' });

  return NextResponse.json({ ok: true, user_id: data.user.id }, { status: 201 });
}
