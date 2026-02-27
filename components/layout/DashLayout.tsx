import { ReactNode } from 'react';
import { DashSidebar, NavItem } from './DashSidebar';

interface Props { children: ReactNode; navItems: NavItem[]; brand: string }

export function DashLayout({ children, navItems, brand }: Props) {
  return (
    <div className="flex min-h-screen bg-bg">
      <DashSidebar items={navItems} brand={brand} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
