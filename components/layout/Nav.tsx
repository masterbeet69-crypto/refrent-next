'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

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
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[#F7F5F2]"
            style={{ color: '#5A5550' }}
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#2A5C45' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1E4231')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2A5C45')}
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </nav>
  );
}
