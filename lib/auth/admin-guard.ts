import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Verifies the request has a valid JWT belonging to an admin profile.
 * Returns { error: NextResponse } if unauthorized, or { userId: string } if OK.
 */
export async function verifyAdmin(req: NextRequest): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: NextResponse }
> {
  const jwt = req.cookies.get('rf_jwt')?.value;
  if (!jwt) {
    return {
      ok: false,
      error: NextResponse.json({ error: 'Non authentifié.' }, { status: 401 }),
    };
  }

  const sb = createServerSupabase();
  const { data: { user }, error: authError } = await sb.auth.getUser(jwt);
  if (authError || !user) {
    return {
      ok: false,
      error: NextResponse.json({ error: 'Session invalide.' }, { status: 401 }),
    };
  }

  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return {
      ok: false,
      error: NextResponse.json({ error: 'Accès refusé.' }, { status: 403 }),
    };
  }

  return { ok: true, userId: user.id };
}
