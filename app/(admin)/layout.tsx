import { requireAdmin } from '@/lib/auth/session';
import { DashLayout } from '@/components/layout/DashLayout';
import {
  LayoutDashboard, Users, Building2, Flag, BarChart2,
  Settings, Zap, Database, Megaphone, ShieldAlert,
} from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard',   label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/users',       label: 'Utilisateurs',    icon: Users },
  { href: '/admin/agents',      label: 'Agents',          icon: Users },
  { href: '/admin/properties',  label: 'Propriétés',      icon: Building2 },
  { href: '/admin/advertisers', label: 'Annonceurs',      icon: Megaphone },
  { href: '/admin/analytics',   label: 'Analytiques',     icon: BarChart2 },
  { href: '/admin/realtime',    label: 'Temps réel',      icon: Zap },
  { href: '/admin/flags',       label: 'Feature Flags',   icon: Flag },
  { href: '/admin/seed',        label: 'Données démo',    icon: Database },
  { href: '/admin/reports',     label: 'Signalements',    icon: ShieldAlert },
  { href: '/admin/settings',    label: 'Paramètres',      icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin(); // validates JWT + DB role server-side
  return <DashLayout navItems={NAV} brand="Admin">{children}</DashLayout>;
}
