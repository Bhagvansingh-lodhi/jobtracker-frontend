'use client';

import {
  CalendarDays,
  Clock,
} from 'lucide-react';

import {
  UpcomingInterview,
} from '@/hooks/use-dashboard';

interface UpcomingInterviewsProps {
  interviews: UpcomingInterview[];
  loading: boolean;
}

export function UpcomingInterviews({
  interviews,
  loading,
}: UpcomingInterviewsProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="mb-5">
        <h2 className="font-semibold text-gray-900">
          Upcoming Interviews
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your scheduled interviews.
        </p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-400">
          Loading interviews...
        </div>
      ) : interviews.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <CalendarDays className="h-9 w-9 text-gray-300" />

          <p className="mt-3 text-sm font-medium text-gray-700">
            No upcoming interviews
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Scheduled interviews will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">

          {interviews.map(
            (interview) => {
              const interviewType =
                interview.type ?? 'OTHER';

              const interviewResult =
                interview.result ?? 'PENDING';

              return (
                <div
                  key={interview.id}
                  className="rounded-lg border p-4 hover:bg-gray-50"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="font-semibold text-gray-900">
                        {interview.company}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {interview.position}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {formatLabel(
                        interviewType,
                      )}
                    </span>

                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">

                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />

                      {formatDate(
                        interview.scheduledAt,
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />

                      {formatTime(
                        interview.scheduledAt,
                      )}
                    </div>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-xs font-medium text-gray-600">
                      {interview.round}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${resultStyle(
                        interviewResult,
                      )}`}
                    >
                      {formatLabel(
                        interviewResult,
                      )}
                    </span>

                  </div>

                </div>
              );
            },
          )}

        </div>
      )}
    </div>
  );
}

function formatLabel(
  value: string,
) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function formatDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );
}

function formatTime(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleTimeString(
    'en-IN',
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  );
}

function resultStyle(
  result: string,
) {
  switch (result) {
    case 'PASSED':
      return 'bg-green-50 text-green-700';

    case 'FAILED':
      return 'bg-red-50 text-red-700';

    case 'CANCELLED':
      return 'bg-gray-100 text-gray-700';

    default:
      return 'bg-yellow-50 text-yellow-700';
  }
}