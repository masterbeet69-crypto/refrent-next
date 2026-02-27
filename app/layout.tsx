import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, DM_Mono } from 'next/font/google';
import "./globals.css";

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
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
    <html lang="fr" className={`${fraunces.variable} ${instrumentSans.variable} ${dmMono.variable}`}>
      <body className="bg-bg font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
