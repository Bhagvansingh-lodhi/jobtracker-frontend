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
  InterviewResult,
  InterviewType,
  useCreateInterview,
} from '@/hooks/use-interviews';

import {
  Application,
} from '@/hooks/use-applications';

interface InterviewFormProps {
  applications: Application[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function InterviewForm({
  applications,
  onSuccess,
  onCancel,
}: InterviewFormProps) {
  const createInterview =
    useCreateInterview();

  const [applicationId, setApplicationId] =
    useState(
      applications[0]?.id ?? '',
    );

  const [round, setRound] =
    useState('');

  const [type, setType] =
    useState<InterviewType>(
      'TECHNICAL',
    );

  const [scheduledAt, setScheduledAt] =
    useState('');

  const [interviewer, setInterviewer] =
    useState('');

  const [result, setResult] =
    useState<InterviewResult>(
      'PENDING',
    );

  const [notes, setNotes] =
    useState('');

  const [error, setError] =
    useState('');

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

    if (!round.trim()) {
      setError(
        'Please enter the interview round.',
      );
      return;
    }

    if (!scheduledAt) {
      setError(
        'Please select interview date and time.',
      );
      return;
    }

    try {
      await createInterview.mutateAsync({
        applicationId,

        round: round.trim(),

        type,

        scheduledAt:
          new Date(
            scheduledAt,
          ).toISOString(),

        interviewer:
          interviewer.trim() ||
          undefined,

        result,

        notes:
          notes.trim() ||
          undefined,
      });

      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to create interview.',
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Interview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Schedule an interview for an application.
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
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
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
          </div>

          {/* ROUND */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Round *
            </label>

            <input
              required
              value={round}
              onChange={(event) =>
                setRound(
                  event.target.value,
                )
              }
              placeholder="e.g. Technical Round 1"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Interview Type *
            </label>

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as InterviewType,
                )
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="TECHNICAL">
                Technical
              </option>

              <option value="HR">
                HR
              </option>

              <option value="MANAGERIAL">
                Managerial
              </option>

              <option value="BEHAVIORAL">
                Behavioral
              </option>

              <option value="PHONE">
                Phone Screen
              </option>

              <option value="VIDEO">
                Video
              </option>

              <option value="ONSITE">
                Onsite
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
              Scheduled At *
            </label>

            <input
              required
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) =>
                setScheduledAt(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* INTERVIEWER */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Interviewer
            </label>

            <input
              value={interviewer}
              onChange={(event) =>
                setInterviewer(
                  event.target.value,
                )
              }
              placeholder="e.g. Rahul Sharma"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* RESULT */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Result
            </label>

            <select
              value={result}
              onChange={(event) =>
                setResult(
                  event.target.value as InterviewResult,
                )
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
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

          {/* NOTES */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value,
                )
              }
              rows={3}
              placeholder="Interview preparation notes..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createInterview.isPending
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {createInterview.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {createInterview.isPending
                ? 'Creating...'
                : 'Create Interview'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}