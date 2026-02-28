import { ReactNode } from 'react';
import { DashSidebar, NavItem } from './DashSidebar';

interface Props { children: ReactNode; navItems: NavItem[]; brand: string }

export function DashLayout({ children, navItems, brand }: Props) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F7F5F2' }}>
      <DashSidebar items={navItems} role={brand} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
