'use client';

import { useState } from 'react';

import {
  Bell,
  CalendarDays,
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  ReminderForm,
} from '@/components/reminders/reminder-form';

import {
  useApplications,
} from '@/hooks/use-applications';

import {
  Reminder,
  useReminders,
  useCompleteReminder,
  useDeleteReminder,
} from '@/hooks/use-reminders';

export default function RemindersPage() {
  const [showForm, setShowForm] =
    useState(false);

  const [editingReminder, setEditingReminder] =
    useState<Reminder | undefined>(
      undefined,
    );

  const {
    data: reminders = [],
    isLoading,
    isError,
  } = useReminders();

  const {
    data: applications = [],
  } = useApplications();

  const completeReminder =
    useCompleteReminder();

  const deleteReminder =
    useDeleteReminder();

  // ============================================================
  // ADD REMINDER
  // ============================================================

  function handleAdd() {
    setEditingReminder(undefined);
    setShowForm(true);
  }

  // ============================================================
  // EDIT REMINDER
  // ============================================================

  function handleEdit(
    reminder: Reminder,
  ) {
    setEditingReminder(reminder);
    setShowForm(true);
  }

  // ============================================================
  // COMPLETE
  // ============================================================

  async function handleComplete(
    id: string,
  ) {
    try {
      await completeReminder.mutateAsync(
        id,
      );
    } catch {
      window.alert(
        'Unable to complete reminder.',
      );
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this reminder?',
      );

    if (!confirmed) return;

    try {
      await deleteReminder.mutateAsync(
        id,
      );
    } catch {
      window.alert(
        'Unable to delete reminder.',
      );
    }
  }

  // ============================================================
  // FORM CLOSE
  // ============================================================

  function closeForm() {
    setShowForm(false);
    setEditingReminder(undefined);
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reminders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Never miss an important job-search task.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={
              applications.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />

            Add Reminder
          </button>

        </div>

        {/* ================================================== */}
        {/* NO APPLICATION */}
        {/* ================================================== */}

        {applications.length === 0 && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Add an application first before creating a reminder.
          </div>
        )}

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load reminders.
          </div>
        )}

        {/* ================================================== */}
        {/* LOADING */}
        {/* ================================================== */}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>

        ) : reminders.length === 0 ? (

          /* ================================================== */
          /* EMPTY STATE */
          /* ================================================== */

          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">

            <Bell className="mx-auto h-10 w-10 text-gray-300" />

            <p className="mt-4 font-medium text-gray-900">
              No reminders yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Create a reminder for your next follow-up.
            </p>

          </div>

        ) : (

          /* ================================================== */
          /* REMINDERS */
          /* ================================================== */

          <div className="space-y-4">

            {reminders.map(
              (reminder) => (
                <div
                  key={reminder.id}
                  className={`rounded-xl border bg-white p-5 shadow-sm transition ${
                    reminder.isCompleted
                      ? 'opacity-60'
                      : 'hover:shadow-md'
                  }`}
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* ====================================== */}
                    {/* LEFT */}
                    {/* ====================================== */}

                    <div className="flex min-w-0 gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="min-w-0">

                        {/* MESSAGE */}

                        <p
                          className={`font-semibold ${
                            reminder.isCompleted
                              ? 'text-gray-500 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {reminder.message}
                        </p>

                        {/* APPLICATION */}

                        <p className="mt-1 text-sm text-gray-500">
                          {reminder.company} —{' '}
                          {reminder.position}
                        </p>

                        {/* DATE */}

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {formatDate(
                            reminder.remindAt,
                          )}
                        </div>

                        {/* STATUS */}

                        <div className="mt-2">
                          {reminder.isCompleted ? (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              Completed
                            </span>
                          ) : (
                            <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                              Pending
                            </span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* ====================================== */}
                    {/* ACTIONS */}
                    {/* ====================================== */}

                    <div className="flex shrink-0 items-center gap-1">

                      {/* EDIT */}

                      {!reminder.isCompleted && (
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              reminder,
                            )
                          }
                          disabled={
                            completeReminder.isPending ||
                            deleteReminder.isPending
                          }
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />

                          Edit
                        </button>
                      )}

                      {/* COMPLETE */}

                      {!reminder.isCompleted && (
                        <button
                          type="button"
                          onClick={() =>
                            handleComplete(
                              reminder.id,
                            )
                          }
                          disabled={
                            completeReminder.isPending
                          }
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />

                          Complete
                        </button>
                      )}

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            reminder.id,
                          )
                        }
                        disabled={
                          deleteReminder.isPending
                        }
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />

                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ),
            )}

          </div>
        )}

        {/* ================================================== */}
        {/* ADD / EDIT FORM */}
        {/* ================================================== */}

        {showForm && (
          <ReminderForm
            applications={
              applications
            }

            reminder={
              editingReminder
            }

            onSuccess={closeForm}

            onCancel={closeForm}
          />
        )}

      </div>
    </DashboardLayout>
  );
}

// ============================================================
// DATE FORMAT
// ============================================================

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