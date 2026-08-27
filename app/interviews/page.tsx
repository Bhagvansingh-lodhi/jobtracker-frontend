'use client';

import { useState } from 'react';

import {
  CalendarDays,
  Clock,
  Loader2,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  InterviewForm,
} from '@/components/interviews/interview-form';

import {
  useInterviews,
  useDeleteInterview,
} from '@/hooks/use-interviews';

import {
  useApplications,
} from '@/hooks/use-applications';

export default function InterviewsPage() {
  const [showForm, setShowForm] =
    useState(false);

  const {
    data: interviews = [],
    isLoading,
    isError,
  } = useInterviews();

  const {
    data: applications = [],
  } = useApplications();

  const deleteInterview =
    useDeleteInterview();

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this interview?',
      );

    if (!confirmed) return;

    try {
      await deleteInterview.mutateAsync(
        id,
      );
    } catch {
      window.alert(
        'Unable to delete interview.',
      );
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interviews
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your upcoming and completed interviews.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowForm(true)
            }
            disabled={
              applications.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />

            Add Interview
          </button>

        </div>

        {/* NO APPLICATION */}

        {applications.length === 0 && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Add an application first before scheduling an interview.
          </div>
        )}

        {/* ERROR */}

        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load interviews.
          </div>
        )}

        {/* LOADING */}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>
        ) : interviews.length === 0 ? (

          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">

            <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />

            <p className="mt-4 font-medium text-gray-900">
              No interviews yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Schedule your first interview.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {interviews.map(
              (interview) => (
                <div
                  key={interview.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >

                  {/* COMPANY */}

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {interview.company}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {interview.position}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {formatLabel(
                        interview.type,
                      )}
                    </span>

                  </div>

                  {/* ROUND */}

                  <p className="mt-5 text-sm font-semibold text-gray-900">
                    {interview.round}
                  </p>

                  {/* DATE */}

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 text-gray-400" />

                    {formatDate(
                      interview.scheduledAt,
                    )}
                  </div>

                  {/* INTERVIEWER */}

                  {interview.interviewer && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <UserRound className="h-4 w-4 text-gray-400" />

                      <span>
                        {interview.interviewer}
                      </span>
                    </div>
                  )}

                  {/* RESULT */}

                  <div className="mt-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${resultStyle(
                        interview.result,
                      )}`}
                    >
                      {formatLabel(
                        interview.result,
                      )}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 flex justify-end border-t pt-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          interview.id,
                        )
                      }
                      disabled={
                        deleteInterview.isPending
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />

                      Delete
                    </button>

                  </div>

                </div>
              ),
            )}

          </div>
        )}

        {/* FORM */}

        {showForm && (
          <InterviewForm
            applications={
              applications
            }
            onSuccess={() =>
              setShowForm(false)
            }
            onCancel={() =>
              setShowForm(false)
            }
          />
        )}

      </div>
    </DashboardLayout>
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
  ).toLocaleString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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