import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { AuthModalProvider } from '@/components/auth/AuthModalContext';
import { AuthModal } from '@/components/auth/AuthModal';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Refrent — Vérification immobilière",
  description: "Vérifiez la disponibilité d'un bien immobilier en Afrique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter)' }}>
        <AuthModalProvider>
          {children}
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}
