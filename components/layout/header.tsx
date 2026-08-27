'use client';

import {
  Bell,
  BriefcaseBusiness,
  Search,
  X,
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

  const [search, setSearch] =
    useState('');

  const {
    data: applications = [],
  } = useApplications();

  const {
    data: profile,
  } = useProfile();

  const filteredApplications =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return [];
      }

      return applications
        .filter((application) => {
          return (
            application.company
              .toLowerCase()
              .includes(query) ||
            application.position
              .toLowerCase()
              .includes(query)
          );
        })
        .slice(0, 6);
    }, [
      applications,
      search,
    ]);

  const showResults =
    search.trim().length > 0;

  function clearSearch() {
    setSearch('');
  }

  // ============================================================
  // USER DISPLAY
  // ============================================================

  const userName =
    profile?.name?.trim() || 'User';

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-6 backdrop-blur">

      {/* SEARCH */}

      <div className="flex items-center gap-3">

        <div className="relative hidden md:block">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search applications..."
            className="h-9 w-72 rounded-lg border bg-gray-50 pl-9 pr-9 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* SEARCH RESULTS */}

          {showResults && (
            <div className="absolute left-0 top-11 z-50 w-96 overflow-hidden rounded-xl border bg-white shadow-lg">

              {filteredApplications.length > 0 ? (
                <div className="py-2">

                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Applications
                  </p>

                  {filteredApplications.map(
                    (application) => (
                      <Link
                        key={application.id}
                        href={`/applications/${application.id}`}
                        onClick={clearSearch}
                        className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                      >

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-medium text-gray-900">
                            {application.company}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {application.position}
                          </p>

                        </div>

                        <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                          {application.status}
                        </span>

                      </Link>
                    ),
                  )}

                  {filteredApplications.length >= 6 && (
                    <div className="border-t px-4 py-2 text-xs text-gray-400">
                      Showing first 6 results
                    </div>
                  )}

                </div>
              ) : (
                <div className="px-4 py-8 text-center">

                  <Search className="mx-auto h-7 w-7 text-gray-300" />

                  <p className="mt-2 text-sm font-medium text-gray-700">
                    No applications found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Try searching by company or position.
                  </p>

                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-4">

        {/* NOTIFICATIONS */}

        <Link
          href="/notifications"
          className={`relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 ${
            pathname === '/notifications'
              ? 'bg-gray-100 text-gray-900'
              : ''
          }`}
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Link>

        {/* PROFILE */}

        <Link
          href="/profile"
          className="flex items-center gap-3 border-l pl-4"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {userInitial}
          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-semibold text-gray-900">
              {userName}
            </p>

            <p className="text-xs text-gray-500">
              Job Seeker
            </p>

          </div>

        </Link>

      </div>

    </header>
  );
}