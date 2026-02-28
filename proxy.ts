import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROUTES = [
  { prefix: '/user',       role: 'user'       },
  { prefix: '/agent',      role: 'agent'      },
  { prefix: '/advertiser', role: 'advertiser' },
  { prefix: '/admin',      role: 'admin'      },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const route = ROUTES.find(r => pathname.startsWith(r.prefix));
  if (!route) return NextResponse.next();

  const cookieRole = request.cookies.get('rf_role')?.value;
  if (!cookieRole) {
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // Admin can access all protected routes
  if (cookieRole === 'admin') return NextResponse.next();

  if (route.role !== 'admin' && cookieRole !== route.role) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  }

  return NextResponse.next();
  // NOTE: JWT + role are always revalidated server-side in each layout.tsx via requireXxx()
}

export const config = {
  matcher: ['/user/:path*', '/agent/:path*', '/advertiser/:path*', '/admin/:path*'],
};
