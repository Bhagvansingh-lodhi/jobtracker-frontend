'use client';

import {
  Bell,
  Clock,
} from 'lucide-react';

interface Reminder {
  id: string;
  company: string;
  position: string;
  message: string;
  remindAt: string;
}

interface UpcomingRemindersProps {
  reminders: Reminder[];
  loading?: boolean;
}

export function UpcomingReminders({
  reminders,
  loading,
}: UpcomingRemindersProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">
          Upcoming Reminders
        </h2>

        <Bell className="h-5 w-5 text-gray-400" />
      </div>

      {loading ? (
        <div className="mt-8 text-center text-sm text-gray-400">
          Loading...
        </div>
      ) : reminders.length === 0 ? (
        <div className="mt-8 text-center">
          <Bell className="mx-auto h-8 w-8 text-gray-300" />

          <p className="mt-3 text-sm text-gray-400">
            No upcoming reminders
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {reminders.map(
            (reminder) => (
              <div
                key={reminder.id}
                className="rounded-lg border p-4"
              >
                <p className="font-semibold text-gray-900">
                  {reminder.company}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {reminder.message}
                </p>

                <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />

                  {formatDate(
                    reminder.remindAt,
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(
  value: string,
) {
  return new Date(value).toLocaleString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    },
  );
}