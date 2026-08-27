'use client';

import {
  FormEvent,
  useState,
} from 'react';

import {
  Loader2,
  X,
} from 'lucide-react';

import {
  Interview,
  InterviewResult,
  InterviewType,
  useUpdateInterview,
} from '@/hooks/use-interviews';

interface EditInterviewFormProps {
  interview: Interview;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditInterviewForm({
  interview,
  onSuccess,
  onCancel,
}: EditInterviewFormProps) {
  const updateInterview =
    useUpdateInterview();

  const [round, setRound] =
    useState(interview.round);

  const [type, setType] =
    useState<InterviewType>(
      interview.type,
    );

  const [scheduledAt, setScheduledAt] =
    useState(
      toDateTimeLocal(
        interview.scheduledAt,
      ),
    );

  const [interviewer, setInterviewer] =
    useState(
      interview.interviewer ?? '',
    );

  const [notes, setNotes] =
    useState(
      interview.notes ?? '',
    );

  const [result, setResult] =
    useState<InterviewResult>(
      interview.result,
    );

  const [error, setError] =
    useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    try {
      await updateInterview.mutateAsync({
        id: interview.id,

        data: {
          round,
          type,
          scheduledAt:
            new Date(
              scheduledAt,
            ).toISOString(),
          interviewer:
            interviewer || undefined,
          notes:
            notes || undefined,
          result,
        },
      });

      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to update interview',
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Interview
            </h2>

            <p className="text-sm text-gray-500">
              {interview.company} —{' '}
              {interview.position}
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

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">

            {/* ROUND */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Round
              </label>

              <input
                required
                value={round}
                onChange={(e) =>
                  setRound(e.target.value)
                }
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>

            {/* TYPE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as InterviewType,
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                <option value="HR">
                  HR
                </option>

                <option value="TECHNICAL">
                  Technical
                </option>

                <option value="MANAGERIAL">
                  Managerial
                </option>

                <option value="CODING">
                  Coding
                </option>

                <option value="SYSTEM_DESIGN">
                  System Design
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* DATE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date & Time
              </label>

              <input
                required
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) =>
                  setScheduledAt(
                    e.target.value,
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>

            {/* INTERVIEWER */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Interviewer
              </label>

              <input
                value={interviewer}
                onChange={(e) =>
                  setInterviewer(
                    e.target.value,
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>

            {/* RESULT */}

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Result
              </label>

              <select
                value={result}
                onChange={(e) =>
                  setResult(
                    e.target.value as InterviewResult,
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="PASSED">
                  Passed
                </option>

                <option value="FAILED">
                  Failed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>
          </div>

          {/* NOTES */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                updateInterview.isPending
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {updateInterview.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {updateInterview.isPending
                ? 'Saving...'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toDateTimeLocal(
  value: string,
) {
  const date = new Date(value);

  const pad = (num: number) =>
    String(num).padStart(2, '0');

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(
    date.getDate(),
  )}T${pad(
    date.getHours(),
  )}:${pad(
    date.getMinutes(),
  )}`;
}