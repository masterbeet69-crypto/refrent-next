import Link from 'next/link';

export function Nav() {
  return (
    <header className="bg-surf border-b border-brd shadow-sh1 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-acc font-semibold">
          Refrent
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/browse" className="text-ink3 hover:text-ink transition-colors">
            Explorer
          </Link>
          <Link href="/login" className="text-ink3 hover:text-ink transition-colors">
            Connexion
          </Link>
          <Link
            href="/register"
            className="bg-acc text-surf px-3 py-1.5 rounded-rf text-sm hover:bg-accd transition-colors"
          >
            S&apos;inscrire
          </Link>
        </nav>
      </div>
    </header>
  );
}
