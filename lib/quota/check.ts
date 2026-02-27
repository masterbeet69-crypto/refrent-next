import { createServerSupabase } from '@/lib/supabase/server';
import { hashIp } from '@/lib/utils/ip';

export { hashIp };

export function currentWeekKey(): string {
  // Returns ISO week key: YYYY-WNN
  const now = new Date();
  // ISO week: week containing the first Thursday of the year
  const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const dayOfWeek = startOfYear.getUTCDay() || 7; // Mon=1..Sun=7
  // Days until next Monday from Jan 1 (or 0 if Jan 1 is Monday)
  const daysToMonday = dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek;
  const firstWeekStart = new Date(startOfYear);
  firstWeekStart.setUTCDate(startOfYear.getUTCDate() + daysToMonday);
  const daysSinceFirstWeek = Math.floor((now.getTime() - firstWeekStart.getTime()) / 86400000);
  const weekNumber = Math.floor(daysSinceFirstWeek / 7) + 1;
  return `${now.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

export async function enforceQuota(ipHash: string, fpHash?: string) {
  const sb = createServerSupabase();
  const { data } = await sb.rpc('check_visitor_quota', {
    p_ip_hash:          ipHash,
    p_fingerprint_hash: fpHash ?? null,
    p_week_key:         currentWeekKey(),
  });
  // fail open: if RPC fails, allow the search
  return (data as { allowed: boolean; count: number; limit: number; remaining: number } | null)
    ?? { allowed: true, count: 0, limit: 5, remaining: 5 };
}
