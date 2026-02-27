import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('rf_jwt');
  res.cookies.delete('rf_role');
  return res;
}
