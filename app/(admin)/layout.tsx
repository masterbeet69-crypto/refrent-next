import { requireAdmin } from '@/lib/auth/session';
import { DashLayout } from '@/components/layout/DashLayout';

const NAV = [
  { href: '/admin/dashboard',   label: 'Tableau de bord', iconName: 'LayoutDashboard' },
  { href: '/admin/users',       label: 'Utilisateurs',    iconName: 'Users' },
  { href: '/admin/agents',      label: 'Agents',          iconName: 'Users' },
  { href: '/admin/properties',  label: 'Propriétés',      iconName: 'Building2' },
  { href: '/admin/advertisers', label: 'Annonceurs',      iconName: 'Megaphone' },
  { href: '/admin/analytics',   label: 'Analytiques',     iconName: 'BarChart2' },
  { href: '/admin/realtime',    label: 'Temps réel',      iconName: 'Zap' },
  { href: '/admin/flags',       label: 'Feature Flags',   iconName: 'Flag' },
  { href: '/admin/seed',        label: 'Données démo',    iconName: 'Database' },
  { href: '/admin/reports',     label: 'Signalements',    iconName: 'ShieldAlert' },
  { href: '/admin/settings',    label: 'Paramètres',      iconName: 'Settings' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <DashLayout navItems={NAV} brand="Admin">{children}</DashLayout>;
}
