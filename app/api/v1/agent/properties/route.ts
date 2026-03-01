import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { AFRICA_REGIONS } from '@/lib/utils/country';

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

/** Generate REF code: try Supabase RPC first, fall back to DB query. */
async function generateRefCode(
  sb: ReturnType<typeof createServerSupabase>,
  countryCode: string,
  cityCode: string,
): Promise<string> {
  // 1. Try official RPC
  const { data: rpcCode, error: rpcErr } = await sb.rpc('generate_ref_code', {
    p_country_code: countryCode,
    p_city_code:    cityCode,
  });
  if (!rpcErr && rpcCode) return rpcCode as string;

  // 2. Fallback: query only codes matching the structured format REF-CC-CITY-%
  //    (avoids CAST errors on legacy short codes like REF-5530)
  const prefix = `REF-${countryCode}-${cityCode}-`;
  const { data: refs } = await sb
    .from('properties')
    .select('ref_code')
    .like('ref_code', `${prefix}%`)
    .order('ref_code', { ascending: false })
    .limit(1);

  const lastNum = refs?.[0]?.ref_code
    ? parseInt((refs[0].ref_code as string).replace(prefix, ''), 10)
    : 0;
  const nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
  return `${prefix}${String(nextNum).padStart(5, '0')}`;
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

  const cc  = country_code.toUpperCase();
  const ctc = city_code.toUpperCase();

  // Resolve city display name from AFRICA_REGIONS
  const regionCities = (AFRICA_REGIONS as Record<string, { cities: Record<string, string> }>)[cc]?.cities ?? {};
  const cityName = regionCities[ctc] ?? ctc;

  // Generate REF code (with fallback if RPC fails)
  let refCode: string;
  try {
    refCode = await generateRefCode(sb, cc, ctc);
  } catch {
    return NextResponse.json({ error: 'Impossible de générer le code REF.' }, { status: 500 });
  }

  // Fetch agent's phone to use as contact_phone (required by DB)
  const { data: agentRow } = await sb
    .from('agents')
    .select('phone')
    .eq('user_id', user.id)
    .single();
  const contactPhone = (agentRow?.phone as string | null) ?? '';

  const { data, error } = await sb.from('properties').insert({
    ref_code:      refCode,
    agent_id:      user.id,
    country_code:  cc,
    city:          cityName,
    type:          property_type ?? null,
    price:         price ?? null,
    rooms:         rooms ?? null,
    status:        status ?? 'available',
    neighborhood:  district ?? null,
    description:   description ?? null,
    contact_phone: contactPhone,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ property: data }, { status: 201 });
}
