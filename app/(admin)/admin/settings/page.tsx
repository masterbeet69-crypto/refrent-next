import Link from 'next/link';
import { Flag, Megaphone, Users, Database, ShieldCheck, ArrowRight } from 'lucide-react';

const sections = [
  {
    icon: Flag,
    title: 'Feature Flags',
    description: 'Activez ou désactivez des fonctionnalités en temps réel, sans redéploiement.',
    href: '/admin/flags',
    color: '#3730A3',
    bg: '#EEF2FF',
  },
  {
    icon: Megaphone,
    title: 'Annonceurs & Campagnes',
    description: 'Gérez les annonceurs et leurs campagnes publicitaires sur la plateforme.',
    href: '/admin/advertisers',
    color: '#8A5A00',
    bg: '#FEF3CD',
  },
  {
    icon: Users,
    title: 'Utilisateurs',
    description: 'Consultez et modérez les comptes utilisateurs, agents et administrateurs.',
    href: '/admin/users',
    color: '#2A5C45',
    bg: '#EAF2EC',
  },
  {
    icon: Database,
    title: 'Seed & données de test',
    description: 'Générez des données de démonstration pour tester la plateforme.',
    href: '/admin/seed',
    color: '#6B6560',
    bg: '#F0EFEE',
  },
  {
    icon: ShieldCheck,
    title: 'Agents & KYC',
    description: 'Vérifiez les profils des agents et validez les demandes de KYC.',
    href: '/admin/agents',
    color: '#9B1C1C',
    bg: '#FDEDED',
  },
];

const QUOTA_PER_WEEK = 5;
const SUPPORTED_COUNTRIES = ['BJ', 'SN', 'CI', 'TG', 'ML', 'BF', 'GN', 'CM'];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
          Paramètres
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#8A837C' }}>
          Configuration globale de la plateforme Refrent.
        </p>
      </div>

      {/* Platform constants */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
      >
        <h2 className="text-base font-semibold" style={{ color: '#1A1714' }}>
          Configuration plateforme
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F7F5' }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#8A837C' }}>
              Quota recherches / semaine
            </p>
            <p className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
              {QUOTA_PER_WEEK}
            </p>
            <p className="text-xs mt-1" style={{ color: '#8A837C' }}>
              Par visiteur non-connecté (IP hashée)
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F7F5' }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#8A837C' }}>
              Pays supportés
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {SUPPORTED_COUNTRIES.map(cc => (
                <span
                  key={cc}
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ fontFamily: 'var(--font-mono)', backgroundColor: '#EAF2EC', color: '#2A5C45' }}
                >
                  {cc}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F7F5' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#8A837C' }}>
            Format code REF
          </p>
          <p
            className="text-sm font-medium"
            style={{ fontFamily: 'var(--font-mono)', color: '#1A1714' }}
          >
            REFERENT-&#123;CC&#125;-&#123;VILLE&#125;-&#123;NUMERO&#125;
          </p>
          <p className="text-xs mt-1" style={{ color: '#8A837C' }}>
            Ex : REFERENT-BJ-CTN-00001 — Rétrocompat. REF-&#123;legacy&#125;
          </p>
        </div>
      </div>

      {/* Navigation shortcuts */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#1A1714' }}>
          Sections d&apos;administration
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(({ icon: Icon, title, description, href, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl p-5 flex items-start gap-4 transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
            >
              <div className="rounded-xl p-2.5 flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: '#1A1714' }}>{title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#8A837C' }}>{description}</p>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8A837C' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
