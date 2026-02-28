import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div style={{ backgroundColor: '#F7F5F2', minHeight: '100vh' }}>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl mb-4"
          style={{ backgroundColor: '#EAF2EC', fontFamily: 'var(--font-fraunces)', color: '#2A5C45' }}
        >
          404
        </div>
        <h1
          className="text-4xl"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}
        >
          Page introuvable
        </h1>
        <p className="text-base" style={{ color: '#5A5550' }}>
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="px-6 py-3 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#2A5C45' }}
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/browse"
            className="px-6 py-3 text-sm font-medium rounded-xl transition-colors"
            style={{
              border: '1px solid #E8E4DF',
              color: '#5A5550',
              backgroundColor: '#FFFFFF',
            }}
          >
            Explorer les biens
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
