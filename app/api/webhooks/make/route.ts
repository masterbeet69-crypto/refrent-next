import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-make-secret');
  if (!secret || secret !== process.env.MAKE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { type?: string; [key: string]: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 });
  }

  // Route by event type
  const type = body.type as string | undefined;
  console.log('[Make Webhook] event:', type, JSON.stringify(body).slice(0, 200));

  // Future handlers:
  // 'status_change' | 'new_property' | 'new_report' | 'new_campaign' | 'new_admin'
  return NextResponse.json({ ok: true, received: type ?? 'unknown' });
}
