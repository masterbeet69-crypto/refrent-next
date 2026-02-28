'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Flag, BarChart2,
  Settings, Zap, Database, Megaphone, ShieldAlert,
  History, Bell, Heart, User, Star, PlusCircle,
  type LucideIcon,
} from 'lucide-react';

// Lookup par nom de chaîne — sérialisable depuis les Server Components
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, Users, Building2, Flag, BarChart2,
  Settings, Zap, Database, Megaphone, ShieldAlert,
  History, Bell, Heart, User, Star, PlusCircle,
};

export interface NavItem { href: string; label: string; iconName: string }

interface Props { items: NavItem[]; role?: string }

export function DashSidebar({ items, role }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 shrink-0 min-h-screen flex flex-col"
      style={{ backgroundColor: '#1A1714', color: '#FFFFFF' }}
    >
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#2A5C45' }}
          >
            <span
              className="text-white text-lg font-semibold"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              R
            </span>
          </div>
          <span
            className="text-xl font-semibold text-white"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Refrent
          </span>
        </Link>
      </div>

      {/* Role badge */}
      {role && (
        <div className="px-6 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div
            className="text-xs uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)' }}
          >
            {role}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map(({ href, label, iconName }) => {
          const Icon = ICON_MAP[iconName] ?? LayoutDashboard;
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative"
              style={{
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.48)',
                backgroundColor: isActive ? '#2A5C45' : 'transparent',
              }}
              onMouseOver={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
              }}
              onMouseOut={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={16} strokeWidth={2} />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link
          href="/"
          className="text-sm transition-opacity hover:opacity-60"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          ← Site public
        </Link>
      </div>
    </aside>
  );
}
