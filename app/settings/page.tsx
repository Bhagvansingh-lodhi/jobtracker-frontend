'use client';

import {
  Bell,
  Mail,
  Shield,
  Settings as SettingsIcon,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <SettingsIcon className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your JobTracker preferences.
              </p>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-500" />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose how JobTracker keeps you updated.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y">

            <SettingRow
              title="Email reminders"
              description="Receive emails when your scheduled reminders are due."
              defaultChecked
            />

            <SettingRow
              title="Interview notifications"
              description="Get notified about upcoming interviews."
              defaultChecked
            />

            <SettingRow
              title="Application updates"
              description="Receive updates related to your applications."
              defaultChecked
            />

          </div>
        </section>

        {/* EMAIL */}

        <section className="mt-6 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Email Preferences
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage email communication preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Reminder emails
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your reminder emails are controlled by your scheduled reminders.
              </p>
            </div>
          </div>
        </section>

        {/* SECURITY */}

        <section className="mt-6 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Security
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Security-related account settings.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account security
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Your account is protected using authentication.
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                Protected
              </span>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

function SettingRow({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5 px-6 py-5">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}