import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const jwt = req.cookies.get('rf_jwt')?.value;
  if (!jwt) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });

  const { data, error } = await sb
    .from('properties')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ properties: data ?? [] });
}

export async function POST(req: NextRequest) {
  const jwt = req.cookies.get('rf_jwt')?.value;
  if (!jwt) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const sb = createServerSupabase();
  const { data: { user } } = await sb.auth.getUser(jwt);
  if (!user) return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 });
  }

  const { country_code, city_code, property_type, price, rooms, status, district, description } = body as {
    country_code?: string; city_code?: string; property_type?: string;
    price?: number; rooms?: number; status?: string; district?: string; description?: string;
  };

  if (!country_code || !city_code) {
    return NextResponse.json({ error: 'Pays et ville requis.' }, { status: 400 });
  }

  // Generate REF code server-side
  const { data: refCode, error: refErr } = await sb.rpc('generate_ref_code', {
    p_country_code: country_code,
    p_city_code:    city_code,
  });
  if (refErr || !refCode) {
    return NextResponse.json({ error: 'Impossible de générer le code REF.' }, { status: 500 });
  }

  const { data, error } = await sb.from('properties').insert({
    ref_code:      refCode,
    agent_id:      user.id,
    country_code,
    city_code,
    property_type: property_type ?? null,
    price:         price ?? null,
    rooms:         rooms ?? null,
    status:        status ?? 'available',
    district:      district ?? null,
    description:   description ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ property: data }, { status: 201 });
}
