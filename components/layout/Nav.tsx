'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuthModal } from '@/components/auth/AuthModalContext';

function readRoleCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split(';').find(c => c.trim().startsWith('rf_role='));
  return match ? match.split('=')[1] : null;
}

function dashboardPath(role: string): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'agent') return '/agent/dashboard';
  return '/user/dashboard';
}

function roleLabel(role: string): string {
  if (role === 'admin') return 'Admin';
  if (role === 'agent') return 'Agent';
  return 'Mon compte';
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole]         = useState<string | null>(null);
  const { openAuthModal }       = useAuthModal();
  const router                  = useRouter();

  // Lire le cookie rf_role au montage et à chaque événement auth:change
  useEffect(() => {
    const syncRole = () => setRole(readRoleCookie());
    syncRole();
    window.addEventListener('auth:change', syncRole);
    return () => window.removeEventListener('auth:change', syncRole);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  async function handleLogout() {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setRole(null);
    window.dispatchEvent(new Event('auth:change'));
    router.push('/');
    router.refresh();
  }

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E8E4DF',
        boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,.06)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#2A5C45' }}
          >
            <span
              className="text-white text-lg font-semibold"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              R
            </span>
          </div>
          <span
            className="text-xl font-semibold"
            style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
          >
            Refrent
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-[#1A1714]"
            style={{ color: '#5A5550' }}
          >
            Accueil
          </Link>
          <Link
            href="/#comment-ca-marche"
            className="text-sm font-medium transition-colors hover:text-[#1A1714]"
            style={{ color: '#5A5550' }}
          >
            Comment ça marche
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {role ? (
            /* ── État connecté ── */
            <>
              <Link
                href={dashboardPath(role)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[#F7F5F2]"
                style={{ color: '#2A5C45' }}
              >
                <LayoutDashboard size={15} />
                {roleLabel(role)}
              </Link>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#EAF2EC' }}
                title={role}
              >
                <User size={15} style={{ color: '#2A5C45' }} />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-colors hover:bg-[#FEF2F2]"
                style={{ color: '#9B1C1C' }}
                title="Se déconnecter"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            /* ── État déconnecté ── */
            <>
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[#F7F5F2]"
                style={{ color: '#5A5550' }}
              >
                Connexion
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#2A5C45' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1E4231')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2A5C45')}
              >
                S&apos;inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
