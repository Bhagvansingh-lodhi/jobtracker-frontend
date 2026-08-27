'use client';

import {
  BriefcaseBusiness,
  CalendarDays,
  CircleX,
  Trophy,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';

import {
  useDashboardOverview,
  useMonthlyApplications,
  useUpcomingInterviews,
  useUpcomingReminders,
} from '@/hooks/use-dashboard';

import { MonthlyChart } from '@/components/dashboard/monthly-chart';

import { UpcomingInterviews } from '@/components/dashboard/upcoming-interviews';

import { UpcomingReminders } from '@/components/dashboard/upcoming-reminders';

export default function DashboardPage() {
  const overview =
    useDashboardOverview();

  const monthly =
    useMonthlyApplications();

  const interviews =
    useUpcomingInterviews();

  const reminders =
    useUpcomingReminders();

  const data = overview.data;

  const stats = [
    {
      label: 'Applications',
      value: data?.applications ?? 0,
      icon: BriefcaseBusiness,
    },
    {
      label: 'Interviews',
      value: data?.interviews ?? 0,
      icon: CalendarDays,
    },
    {
      label: 'Offers',
      value: data?.offers ?? 0,
      icon: Trophy,
    },
    {
      label: 'Rejected',
      value: data?.rejected ?? 0,
      icon: CircleX,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your job search progress in one place.
          </p>
        </div>

        {/* ERROR */}

        {overview.isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load dashboard data.
          </div>
        )}

        {/* STATS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <Icon className="h-5 w-5 text-gray-400" />
                </div>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {overview.isLoading
                    ? '...'
                    : stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* CONVERSION */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Metric
            label="Response Rate"
            value={data?.responseRate}
            loading={overview.isLoading}
          />

          <Metric
            label="Interview Conversion"
            value={data?.interviewRate}
            loading={overview.isLoading}
          />

          <Metric
            label="Offer Conversion"
            value={data?.offerRate}
            loading={overview.isLoading}
          />
        </div>

        {/* CHART */}

        <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">
              Monthly Applications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Number of applications submitted each month.
            </p>
          </div>

          {monthly.isLoading ? (
            <div className="flex h-72 items-center justify-center text-sm text-gray-400">
              Loading chart...
            </div>
          ) : monthly.isError ? (
            <div className="flex h-72 items-center justify-center text-sm text-red-500">
              Unable to load chart.
            </div>
          ) : (
            <MonthlyChart
              data={monthly.data ?? []}
            />
          )}
        </div>

        {/* INTERVIEWS + REMINDERS */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <UpcomingInterviews
            interviews={
              interviews.data ?? []
            }
            loading={
              interviews.isLoading
            }
          />

          <UpcomingReminders
            reminders={
              reminders.data ?? []
            }
            loading={
              reminders.isLoading
            }
          />
        </div>

      </div>
    </DashboardLayout>
  );
}

function Metric({
  label,
  value,
  loading,
}: {
  label: string;
  value?: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {loading
          ? '...'
          : `${value ?? 0}%`}
      </p>
    </div>
  );
}