import { requireUser } from '@/lib/auth/session';
import { DashLayout } from '@/components/layout/DashLayout';

const NAV = [
  { href: '/user/dashboard',     label: 'Tableau de bord', iconName: 'LayoutDashboard' },
  { href: '/user/history',       label: 'Historique',      iconName: 'History' },
  { href: '/user/favorites',     label: 'Favoris',         iconName: 'Heart' },
  { href: '/user/notifications', label: 'Notifications',   iconName: 'Bell' },
  { href: '/user/profile',       label: 'Profil',          iconName: 'User' },
];

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <DashLayout navItems={NAV} brand="Mon espace">{children}</DashLayout>;
}
