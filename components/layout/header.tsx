'use client';

import {
  Bell,
  BriefcaseBusiness,
  Search,
  X,
  Menu,
  LogOut,
  User,
} from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  useApplications,
} from '@/hooks/use-applications';

import {
  useProfile,
} from '@/hooks/use-profile';

export function Header() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    data: applications = [],
  } = useApplications();

  const {
    data: profile,
  } = useProfile();

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return applications
      .filter((application) => {
        return (
          application.company.toLowerCase().includes(query) ||
          application.position.toLowerCase().includes(query)
        );
      })
      .slice(0, 6);
  }, [applications, search]);

  const showResults = search.trim().length > 0;

  function clearSearch() {
    setSearch('');
  }

  // ============================================================
  // USER DISPLAY
  // ============================================================

  const userName = profile?.name?.trim() || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-xl shadow-sm sm:px-6">
      
      {/* LEFT SECTION - Logo & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo (mobile) */}
        <Link href="/dashboard" className="block md:hidden">
          <span className="text-xl font-bold text-blue-600">
            JT
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="relative hidden md:block flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search applications..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-10 pr-10 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* SEARCH RESULTS */}
          {showResults && (
            <div className="absolute left-0 top-12 z-50 w-[400px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-2xl backdrop-blur-sm">
              {filteredApplications.length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Applications ({filteredApplications.length})
                  </p>
                  {filteredApplications.map((application) => (
                    <Link
                      key={application.id}
                      href={`/applications/${application.id}`}
                      onClick={clearSearch}
                      className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                        <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {application.company}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {application.position}
                        </p>
                      </div>
                      <span className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                        {application.status}
                      </span>
                    </Link>
                  ))}
                  {filteredApplications.length >= 6 && (
                    <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
                      Showing first 6 results
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-4 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Search className="h-6 w-6 text-gray-300" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No applications found
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Try searching by company or position
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Icon (Mobile) */}
        <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden">
          <Search className="h-5 w-5" />
        </button>

        {/* NOTIFICATIONS */}
        <Link
          href="/notifications"
          className={`relative rounded-xl p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 ${
            pathname === '/notifications'
              ? 'bg-blue-50 text-blue-600'
              : ''
          }`}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 ring-2 ring-white animate-pulse" />
        </Link>

        {/* PROFILE */}
        <Link
          href="/profile"
          className="flex items-center gap-3 border-l border-gray-200 pl-3 sm:pl-4 group"
        >
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-md transition-all group-hover:shadow-lg group-hover:scale-105">
              {userInitial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {userName}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400"></span>
              Job Seeker
            </p>
          </div>
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-2xl md:hidden animate-[slideIn_0.3s_ease-out]">
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
              <span className="text-xl font-bold text-blue-600">
                JobTracker
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BriefcaseBusiness className="h-4.5 w-4.5" />
                Dashboard
              </Link>
              <Link
                href="/applications"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-4.5 w-4.5" />
                Applications
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4.5 w-4.5" />
                Profile
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                <LogOut className="h-4.5 w-4.5" />
                Logout
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(-100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}
    </header>
  );
}