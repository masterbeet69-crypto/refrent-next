import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { enforceQuota, hashIp, currentWeekKey } from '@/lib/quota/check';
import { isValidRefCode } from '@/lib/utils/ref';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref: rawRef } = await params;
  const ref = rawRef.toUpperCase();

  if (!isValidRefCode(ref)) {
    return NextResponse.json(
      { error: 'Format invalide. Ex: REF-BJ-CTN-00001' },
      { status: 400 }
    );
  }

  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = hashIp(ip);
  const fpHash = req.headers.get('x-fingerprint') ?? undefined;
  const jwt    = req.cookies.get('rf_jwt')?.value;
  const sb     = createServerSupabase();

  let isAuth = false;
  if (jwt) {
    const { data: { user } } = await sb.auth.getUser(jwt);
    isAuth = !!user;
  }

  if (!isAuth) {
    const quota = await enforceQuota(ipHash, fpHash);
    if (!quota.allowed) {
      return NextResponse.json({
        error: "Quota hebdomadaire atteint (5/semaine). Inscrivez-vous pour un accès illimité.",
        code: 'quota_exceeded',
        remaining: 0,
        limit: 5,
      }, { status: 429 });
    }
  }

  const { data: rows } = await sb.from('properties').select('*').eq('ref_code', ref).limit(1);
  const property    = rows?.[0] ?? null;
  const resultFound = !!property;

  // ALWAYS log — country_code is REQUIRED
  await sb.from('search_logs').insert({
    ref_code:         ref,
    ip_hash:          ipHash,
    fingerprint_hash: fpHash ?? null,
    week_key:         currentWeekKey(),
    result_found:     resultFound,
    country_code:     property?.country_code ?? null,
  });

  if (resultFound) {
    void sb.rpc('increment_property_views', { p_ref_code: ref }).then(() => {}, () => {});
  }

  if (!resultFound) {
    return NextResponse.json({ found: false, ref_code: ref }, { status: 404 });
  }

  return NextResponse.json({ found: true, property });
}
