'use client';

import { ReactNode, useState } from 'react';

import {
  Menu,
  X,
} from 'lucide-react';

import { Sidebar } from './sidebar';
import { Header } from './header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* DESKTOP SIDEBAR */}

      <Sidebar />

      {/* MOBILE SIDEBAR */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* OVERLAY */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMobileOpen(false)
            }
            className="absolute inset-0 bg-black/40"
          />

          {/* DRAWER */}

          <div className="relative z-10 h-full w-72 bg-white shadow-xl">

            <div className="flex h-16 items-center justify-between border-b px-5">

              <span className="text-xl font-bold tracking-tight">
                Job
                <span className="text-blue-600">
                  Tracker
                </span>
              </span>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div
              onClick={() =>
                setMobileOpen(false)
              }
              className="h-[calc(100%-4rem)] overflow-y-auto"
            >
              <Sidebar mobile />
            </div>

          </div>
        </div>
      )}

      {/* MAIN */}

      <div className="lg:pl-64">

        {/* MOBILE TOP BAR */}

        <div className="flex h-16 items-center border-b bg-white px-4 lg:hidden">

          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="ml-3 text-lg font-bold">
            Job
            <span className="text-blue-600">
              Tracker
            </span>
          </span>

        </div>

        <Header />

        <main className="p-4 sm:p-6">
          {children}
        </main>

      </div>

    </div>
  );
}