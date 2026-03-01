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

/**
 * Generate a REFERENT-CC-CITY-NNNNN code.
 * Tries the Supabase RPC first; falls back to a DB query if it fails
 * (e.g. RPC errors when legacy REF-5530 codes break the CAST).
 */
async function generateRefCode(
  sb: ReturnType<typeof createServerSupabase>,
  cc: string,
  ctc: string,
): Promise<string> {
  const newPrefix = `REFERENT-${cc}-${ctc}-`;
  const oldPrefix = `REF-${cc}-${ctc}-`;

  // 1. Try RPC — it returns REF-CC-CITY-NNNNN; we convert to REFERENT prefix
  const { data: rpcCode, error: rpcErr } = await sb.rpc('generate_ref_code', {
    p_country_code: cc,
    p_city_code:    ctc,
  });
  if (!rpcErr && rpcCode) {
    const raw = rpcCode as string;
    // Convert REF-BJ-CTN-00001 → REFERENT-BJ-CTN-00001
    if (raw.startsWith('REF-')) return 'REFERENT-' + raw.slice(4);
    return raw;
  }

  // 2. Fallback: find max seq among REFERENT- and REF- structured codes (avoids CAST error on legacy short codes)
  const [{ data: newRefs }, { data: oldRefs }] = await Promise.all([
    sb.from('properties').select('ref_code').like('ref_code', `${newPrefix}%`)
      .order('ref_code', { ascending: false }).limit(1),
    sb.from('properties').select('ref_code').like('ref_code', `${oldPrefix}%`)
      .order('ref_code', { ascending: false }).limit(1),
  ]);

  const parseNum = (code: string | undefined, prefix: string) => {
    if (!code) return 0;
    const n = parseInt(code.replace(prefix, ''), 10);
    return isNaN(n) ? 0 : n;
  };

  const maxSeq = Math.max(
    parseNum(newRefs?.[0]?.ref_code, newPrefix),
    parseNum(oldRefs?.[0]?.ref_code, oldPrefix),
  );
  return `${newPrefix}${String(maxSeq + 1).padStart(5, '0')}`;
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

  const { country_code, city_code, type, price, status, district, description } = body as {
    country_code?: string; city_code?: string; type?: string;
    price?: number; status?: string; district?: string; description?: string;
  };

  if (!country_code || !city_code) {
    return NextResponse.json({ error: 'Pays et ville requis.' }, { status: 400 });
  }
  if (!price || Number(price) <= 0) {
    return NextResponse.json({ error: 'Le prix est obligatoire.' }, { status: 400 });
  }

  const cc  = country_code.toUpperCase();
  const ctc = city_code.toUpperCase();

  // Resolve city display name
  const regionCities = (AFRICA_REGIONS as Record<string, { cities: Record<string, string> }>)[cc]?.cities ?? {};
  const cityName = regionCities[ctc] ?? ctc;

  // Generate REFERENT-CC-CITY-NNNNN code
  let refCode: string;
  try {
    refCode = await generateRefCode(sb, cc, ctc);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: `Impossible de générer le code REF : ${msg}` }, { status: 500 });
  }

  // Build title: "Appartement à Cotonou"
  const title = `${type ?? 'Bien immobilier'} à ${cityName}`;

  // Insert — columns confirmed from DB schema introspection
  const { data, error } = await sb.from('properties').insert({
    ref_code:     refCode,
    agent_id:     user.id,
    title,
    type:         type ?? null,
    city:         cityName,
    neighborhood: district ?? null,
    price:        Number(price),
    status:       status ?? 'available',
    description:  description ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ property: data }, { status: 201 });
}
