import { NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { hashIp, currentWeekKey } from '@/lib/quota/check';

const LIMIT = 5;

export async function GET(req: NextRequest) {
  // Authenticated users have unlimited searches
  const jwt = req.cookies.get('rf_jwt')?.value;
  if (jwt) {
    const sb = createServerSupabase();
    const { data: { user } } = await sb.auth.getUser(jwt);
    if (user) {
      return Response.json({ remaining: null, used: 0, limit: LIMIT, unlimited: true });
    }
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = hashIp(ip);
  const week = currentWeekKey();

  const sb = createServerSupabase();
  const { count } = await sb
    .from('search_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('week_key', week);

  const used = count ?? 0;
  const remaining = Math.max(0, LIMIT - used);
  return Response.json({ remaining, used, limit: LIMIT, unlimited: false });
}
