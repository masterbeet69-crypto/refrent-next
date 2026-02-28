import { requireAgent } from '@/lib/auth/session';
import { DashLayout } from '@/components/layout/DashLayout';

const NAV = [
  { href: '/agent/dashboard',  label: 'Tableau de bord', iconName: 'LayoutDashboard' },
  { href: '/agent/properties', label: 'Mes biens',       iconName: 'Building2' },
  { href: '/agent/publish',    label: 'Publier un bien', iconName: 'PlusCircle' },
  { href: '/agent/profile',    label: 'Profil',          iconName: 'User' },
  { href: '/agent/premium',    label: 'Premium',         iconName: 'Star' },
];

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  await requireAgent();
  return <DashLayout navItems={NAV} brand="Agent">{children}</DashLayout>;
}
