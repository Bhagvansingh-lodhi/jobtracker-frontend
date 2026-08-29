'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Bell,
  Tags,
  FileText,
  User,
  Settings,
  LogOut,
  Loader2,
} from 'lucide-react';

import {
  useLogout,
} from '@/hooks/use-auth';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Applications',
    href: '/applications',
    icon: BriefcaseBusiness,
  },
  {
    name: 'Interviews',
    href: '/interviews',
    icon: CalendarDays,
  },
  {
    name: 'Reminders',
    href: '/reminders',
    icon: Bell,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    name: 'Notes',
    href: '/notes',
    icon: FileText,
  },
  {
    name: 'Tags',
    href: '/tags',
    icon: Tags,
  },
];

const secondaryNavigation = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({
  mobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
    } catch {
      window.alert(
        'Unable to logout. Please try again.',
      );
    }
  }

  return (
    <aside
      className={
        mobile
          ? 'flex h-full w-full flex-col bg-white/95 backdrop-blur-sm'
          : 'fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200/80 bg-white/95 backdrop-blur-sm shadow-lg lg:flex lg:flex-col'
      }
    >
      {/* LOGO */}
      {!mobile && (
        <div className="flex h-16 items-center border-b border-gray-200/80 px-6">
          <Link
            href="/dashboard"
            className="text-2xl font-bold tracking-tight text-gray-900 transition-all hover:scale-105"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Job
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tracker
            </span>
          </Link>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-600 to-indigo-600"></span>
              )}
              <Icon className={`h-5 w-5 transition-colors ${
                active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <span className={active ? 'font-semibold' : ''}>{item.name}</span>
            </Link>
          );
        })}

        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Account
        </p>

        {secondaryNavigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-600 to-indigo-600"></span>
              )}
              <Icon className={`h-5 w-5 transition-colors ${
                active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <span className={active ? 'font-semibold' : ''}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-gray-200/80 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {logout.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5 transition-colors group-hover:text-red-600" />
          )}
          <span className="transition-colors group-hover:text-red-600">
            {logout.isPending ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
}