import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#F7F5F2', borderTop: '1px solid #E8E4DF' }} className="py-12">
      <div className="max-w-[1400px] mx-auto px-6 text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
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
        </div>

        <p style={{ color: '#5A5550' }} className="max-w-md mx-auto">
          Vérification immobilière panafricaine
        </p>

        <div className="flex items-center justify-center gap-6 text-sm">
          <Link
            href="/#comment-ca-marche"
            className="transition-colors hover:text-[#1A1714]"
            style={{ color: '#5A5550' }}
          >
            Comment ça marche
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-[#1A1714]"
            style={{ color: '#5A5550' }}
          >
            Connexion
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-[#1A1714]"
            style={{ color: '#5A5550' }}
          >
            Confidentialité
          </Link>
        </div>

        <p className="text-sm" style={{ color: '#8A837C' }}>
          © 2026 Refrent. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
