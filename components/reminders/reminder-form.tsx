'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  Loader2,
  X,
} from 'lucide-react';

import {
  useCreateReminder,
  useUpdateReminder,
  Reminder,
} from '@/hooks/use-reminders';

import {
  Application,
} from '@/hooks/use-applications';

interface ReminderFormProps {
  applications: Application[];
  reminder?: Reminder;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReminderForm({
  applications,
  reminder,
  onSuccess,
  onCancel,
}: ReminderFormProps) {
  const isEdit = Boolean(reminder);

  const createReminder =
    useCreateReminder();

  const updateReminder =
    useUpdateReminder();

  const [applicationId, setApplicationId] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [remindAt, setRemindAt] =
    useState('');

  const [error, setError] =
    useState('');

  // ============================================================
  // INITIALIZE FORM
  // ============================================================

  useEffect(() => {
    if (reminder) {
      setApplicationId(
        reminder.applicationId,
      );

      setMessage(
        reminder.message,
      );

      setRemindAt(
        formatDateTimeLocal(
          reminder.remindAt,
        ),
      );
    } else {
      setApplicationId(
        applications[0]?.id ?? '',
      );

      setMessage('');
      setRemindAt('');
    }
  }, [
    reminder,
    applications,
  ]);

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!applicationId) {
      setError(
        'Please select an application.',
      );
      return;
    }

    if (!message.trim()) {
      setError(
        'Please enter a reminder message.',
      );
      return;
    }

    if (!remindAt) {
      setError(
        'Please select a reminder date and time.',
      );
      return;
    }

    try {
      if (isEdit && reminder) {
        await updateReminder.mutateAsync({
          id: reminder.id,

          data: {
            message: message.trim(),

            remindAt:
              new Date(
                remindAt,
              ).toISOString(),
          },
        });
      } else {
        await createReminder.mutateAsync({
          applicationId,

          message: message.trim(),

          remindAt:
            new Date(
              remindAt,
            ).toISOString(),
        });
      }

      onSuccess();
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message;

      setError(
        Array.isArray(serverMessage)
          ? serverMessage.join(', ')
          : serverMessage ||
              `Unable to ${
                isEdit
                  ? 'update'
                  : 'create'
              } reminder.`,
      );
    }
  }

  const isPending =
    createReminder.isPending ||
    updateReminder.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit
                ? 'Edit Reminder'
                : 'Add Reminder'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? 'Update your reminder details.'
                : 'Set a reminder for your job application.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* ERROR */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* APPLICATION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Application *
            </label>

            <select
              required
              value={applicationId}
              onChange={(event) =>
                setApplicationId(
                  event.target.value,
                )
              }
              disabled={isEdit}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                Select application
              </option>

              {applications.map(
                (application) => (
                  <option
                    key={application.id}
                    value={application.id}
                  >
                    {application.company} —{' '}
                    {application.position}
                  </option>
                ),
              )}
            </select>

            {isEdit && (
              <p className="mt-1 text-xs text-gray-400">
                Application cannot be changed.
              </p>
            )}
          </div>

          {/* MESSAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reminder *
            </label>

            <textarea
              required
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value,
                )
              }
              rows={3}
              maxLength={255}
              placeholder="Follow up with recruiter"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {message.length}/255
            </p>
          </div>

          {/* DATE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Remind At *
            </label>

            <input
              required
              type="datetime-local"
              value={remindAt}
              onChange={(event) =>
                setRemindAt(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isPending
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update Reminder'
                  : 'Create Reminder'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

// ============================================================
// DATETIME LOCAL FORMAT
// ============================================================

function formatDateTimeLocal(
  value: string,
) {
  const date =
    new Date(value);

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60 * 1000,
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}