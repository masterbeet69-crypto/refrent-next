import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const country = searchParams.get('country');
  const city    = searchParams.get('city');
  const status  = searchParams.get('status');
  const type    = searchParams.get('type');
  const page    = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit   = 20;

  const sb = createServerSupabase();
  let query = sb.from('properties').select('*', { count: 'exact' });

  if (country) query = query.eq('country_code', country);
  if (city)    query = query.eq('city_code', city);
  if (status)  query = query.eq('status', status);
  if (type)    query = query.eq('property_type', type);

  const { data, count, error } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ properties: data ?? [], total: count ?? 0, page, limit });
}
