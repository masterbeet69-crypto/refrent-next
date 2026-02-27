import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const sb = createServerSupabase();
  const { count, error } = await sb
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ ok: true, profiles: count });
}
