import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const sb = createServerSupabase(); // SERVICE_ROLE — bypasses RLS

  const [users, properties, logs, agents, available, searches7d] = await Promise.all([
    sb.from('profiles').select('*', { count: 'exact', head: true }),
    sb.from('properties').select('*', { count: 'exact', head: true }),
    sb.from('search_logs').select('*', { count: 'exact', head: true }),
    sb.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'agent'),
    sb.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    sb.from('search_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
  ]);

  return NextResponse.json({
    total_users:       users.count      ?? 0,
    total_properties:  properties.count ?? 0,
    total_searches:    logs.count       ?? 0,
    total_agents:      agents.count     ?? 0,
    available_props:   available.count  ?? 0,
    searches_7d:       searches7d.count ?? 0,
  });
}
