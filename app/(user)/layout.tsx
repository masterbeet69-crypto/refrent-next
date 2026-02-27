import { requireUser } from '@/lib/auth/session';
import { DashLayout } from '@/components/layout/DashLayout';
import { LayoutDashboard, History, Bell, Heart, User } from 'lucide-react';

const NAV = [
  { href: '/user/dashboard',     label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/user/history',       label: 'Historique',      icon: History },
  { href: '/user/favorites',     label: 'Favoris',         icon: Heart },
  { href: '/user/notifications', label: 'Notifications',   icon: Bell },
  { href: '/user/profile',       label: 'Profil',          icon: User },
];

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <DashLayout navItems={NAV} brand="Mon espace">{children}</DashLayout>;
}
