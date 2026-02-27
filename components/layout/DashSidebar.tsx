'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

export interface NavItem { href: string; label: string; icon: LucideIcon }

interface Props { items: NavItem[]; brand: string }

export function DashSidebar({ items, brand }: Props) {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 bg-surf border-r border-brd min-h-screen flex flex-col p-4 gap-1">
      <div className="font-display text-acc font-semibold text-lg px-2 py-3 mb-2">
        {brand}
      </div>
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`
            flex items-center gap-2 px-2 py-2 rounded-r2 text-sm transition-colors
            ${pathname === href
              ? 'bg-accl text-acc font-medium'
              : 'text-ink3 hover:bg-bg2 hover:text-ink'
            }
          `.trim()}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}
    </aside>
  );
}
