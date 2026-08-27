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
  Application,
  useUpdateApplication,
} from '@/hooks/use-applications';

interface EditApplicationFormProps {
  application: Application;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditApplicationForm({
  application,
  onSuccess,
  onCancel,
}: EditApplicationFormProps) {
  const updateApplication =
    useUpdateApplication();

  const [company, setCompany] =
    useState(application.company);

  const [position, setPosition] =
    useState(application.position);

  const [jobUrl, setJobUrl] =
    useState(application.jobUrl ?? '');

  const [location, setLocation] =
    useState(application.location ?? '');

  const [salaryMin, setSalaryMin] =
    useState(
      application.salaryMin?.toString() ?? '',
    );

  const [salaryMax, setSalaryMax] =
    useState(
      application.salaryMax?.toString() ?? '',
    );

  const [jobType, setJobType] =
    useState(application.jobType);

  const [appliedDate, setAppliedDate] =
    useState(application.appliedDate);

  const [deadline, setDeadline] =
    useState(application.deadline ?? '');

  const [description, setDescription] =
    useState(application.description ?? '');

  const [error, setError] =
    useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!company.trim()) {
      setError(
        'Company is required.',
      );
      return;
    }

    if (!position.trim()) {
      setError(
        'Position is required.',
      );
      return;
    }

    // ========================================================
    // SALARY CONVERSION
    // ========================================================

    const minSalary =
      salaryMin.trim() === ''
        ? undefined
        : Number(salaryMin);

    const maxSalary =
      salaryMax.trim() === ''
        ? undefined
        : Number(salaryMax);

    // ========================================================
    // SALARY VALIDATION
    // ========================================================

    if (
      minSalary !== undefined &&
      (!Number.isFinite(minSalary) ||
        minSalary < 0)
    ) {
      setError(
        'Minimum salary must be a valid number greater than or equal to 0.',
      );
      return;
    }

    if (
      maxSalary !== undefined &&
      (!Number.isFinite(maxSalary) ||
        maxSalary < 0)
    ) {
      setError(
        'Maximum salary must be a valid number greater than or equal to 0.',
      );
      return;
    }

    if (
      minSalary !== undefined &&
      maxSalary !== undefined &&
      minSalary > maxSalary
    ) {
      setError(
        'Minimum salary cannot be greater than maximum salary.',
      );
      return;
    }

    try {
      await updateApplication.mutateAsync({
        id: application.id,

        data: {
          company:
            company.trim(),

          position:
            position.trim(),

          jobUrl:
            jobUrl.trim() ||
            undefined,

          location:
            location.trim() ||
            undefined,

          // IMPORTANT:
          // Backend expects numbers.
          salaryMin:
            minSalary,

          salaryMax:
            maxSalary,

          currency:
            application.currency,

          jobType,

          appliedDate,

          deadline:
            deadline ||
            undefined,

          description:
            description.trim() ||
            undefined,
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
              'Unable to update application.',
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Application
            </h2>

            <p className="text-sm text-gray-500">
              Update application details.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={
              updateApplication.isPending
            }
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
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

          <div className="grid gap-5 sm:grid-cols-2">

            {/* COMPANY */}

            <Field
              label="Company"
              value={company}
              onChange={setCompany}
              required
            />

            {/* POSITION */}

            <Field
              label="Position"
              value={position}
              onChange={setPosition}
              required
            />

            {/* JOB URL */}

            <Field
              label="Job URL"
              value={jobUrl}
              onChange={setJobUrl}
              type="url"
            />

            {/* LOCATION */}

            <Field
              label="Location"
              value={location}
              onChange={setLocation}
            />

            {/* MIN SALARY */}

            <Field
              label="Minimum Salary"
              value={salaryMin}
              onChange={setSalaryMin}
              type="number"
              min="0"
            />

            {/* MAX SALARY */}

            <Field
              label="Maximum Salary"
              value={salaryMax}
              onChange={setSalaryMax}
              type="number"
              min="0"
            />

            {/* JOB TYPE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job Type
              </label>

              <select
                value={jobType}
                onChange={(e) =>
                  setJobType(
                    e.target.value,
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="FULL_TIME">
                  Full Time
                </option>

                <option value="PART_TIME">
                  Part Time
                </option>

                <option value="INTERNSHIP">
                  Internship
                </option>

                <option value="CONTRACT">
                  Contract
                </option>

                <option value="FREELANCE">
                  Freelance
                </option>
              </select>
            </div>

            {/* APPLIED DATE */}

            <Field
              label="Applied Date"
              value={appliedDate}
              onChange={setAppliedDate}
              type="date"
              required
            />

            {/* DEADLINE */}

            <Field
              label="Deadline"
              value={deadline}
              onChange={setDeadline}
              type="date"
            />

          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onCancel}
              disabled={
                updateApplication.isPending
              }
              className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                updateApplication.isPending
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {updateApplication.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {updateApplication.isPending
                ? 'Saving...'
                : 'Save Changes'}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

// ============================================================
// FIELD
// ============================================================

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        min={min}
        onChange={(e) =>
          onChange(
            e.target.value,
          )
        }
        className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}