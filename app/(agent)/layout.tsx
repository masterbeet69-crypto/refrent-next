import { requireAgent } from '@/lib/auth/session';
import { DashLayout } from '@/components/layout/DashLayout';
import { LayoutDashboard, Building2, PlusCircle, User, Star } from 'lucide-react';

const NAV = [
  { href: '/agent/dashboard',  label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/agent/properties', label: 'Mes biens',       icon: Building2 },
  { href: '/agent/publish',    label: 'Publier un bien', icon: PlusCircle },
  { href: '/agent/profile',    label: 'Profil',          icon: User },
  { href: '/agent/premium',    label: 'Premium',         icon: Star },
];

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  await requireAgent();
  return <DashLayout navItems={NAV} brand="Agent">{children}</DashLayout>;
}
