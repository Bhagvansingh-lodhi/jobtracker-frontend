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

  const logout =
    useLogout();

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
          ? 'flex h-full w-full flex-col bg-white'
          : 'fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white lg:flex lg:flex-col'
      }
    >

      {/* LOGO */}

      {!mobile && (
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight"
          >
            Job
            <span className="text-blue-600">
              Tracker
            </span>
          </Link>
        </div>
      )}

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`,
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />

              {item.name}
            </Link>
          );
        })}

        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Account
        </p>

        {secondaryNavigation.map(
          (item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />

                {item.name}
              </Link>
            );
          },
        )}

      </nav>

      {/* LOGOUT */}

      <div className="border-t p-4">

        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {logout.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}

          {logout.isPending
            ? 'Logging out...'
            : 'Logout'}

        </button>

      </div>

    </aside>
  );
}