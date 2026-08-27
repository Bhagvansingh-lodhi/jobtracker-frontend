'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  Loader2,
} from 'lucide-react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  useApplication,
  useUpdateApplication,
} from '@/hooks/use-applications';

// ============================================================
// OPTIONS
// ============================================================

const statuses = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
];

const jobTypes = [
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'CONTRACT',
  'FREELANCE',
  'OTHER',
];

// ============================================================
// PAGE
// ============================================================

export default function EditApplicationPage() {
  const params = useParams();

  const router = useRouter();

  const id = params.id as string;

  const {
    data: application,
    isLoading,
    isError,
  } = useApplication(id);

  const updateApplication =
    useUpdateApplication();

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [company, setCompany] =
    useState('');

  const [position, setPosition] =
    useState('');

  const [jobUrl, setJobUrl] =
    useState('');

  const [location, setLocation] =
    useState('');

  // Keep salary as string because HTML input
  // values are always strings.
  const [salaryMin, setSalaryMin] =
    useState('');

  const [salaryMax, setSalaryMax] =
    useState('');

  const [currency, setCurrency] =
    useState('INR');

  const [jobType, setJobType] =
    useState('');

  const [status, setStatus] =
    useState('APPLIED');

  const [appliedDate, setAppliedDate] =
    useState('');

  const [deadline, setDeadline] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [error, setError] =
    useState('');

  // ==========================================================
  // LOAD APPLICATION INTO FORM
  // ==========================================================

  useEffect(() => {
    if (!application) {
      return;
    }

    setCompany(
      application.company ?? '',
    );

    setPosition(
      application.position ?? '',
    );

    setJobUrl(
      application.jobUrl ?? '',
    );

    setLocation(
      application.location ?? '',
    );

    // API gives number | null | undefined.
    // Form state needs string.
    setSalaryMin(
      application.salaryMin !== null &&
      application.salaryMin !== undefined
        ? String(application.salaryMin)
        : '',
    );

    setSalaryMax(
      application.salaryMax !== null &&
      application.salaryMax !== undefined
        ? String(application.salaryMax)
        : '',
    );

    setCurrency(
      application.currency ?? 'INR',
    );

    setJobType(
      application.jobType ?? '',
    );

    setStatus(
      application.status ?? 'APPLIED',
    );

    setAppliedDate(
      application.appliedDate
        ? application.appliedDate.slice(
            0,
            10,
          )
        : '',
    );

    setDeadline(
      application.deadline
        ? application.deadline.slice(
            0,
            10,
          )
        : '',
    );

    setDescription(
      application.description ?? '',
    );
  }, [application]);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    // ----------------------------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------------------------

    if (!company.trim()) {
      setError(
        'Company name is required.',
      );
      return;
    }

    if (!position.trim()) {
      setError(
        'Position is required.',
      );
      return;
    }

    // ----------------------------------------------------------
    // CONVERT SALARY STRING -> NUMBER
    // ----------------------------------------------------------

    const minSalary =
      salaryMin.trim() === ''
        ? undefined
        : Number(salaryMin);

    const maxSalary =
      salaryMax.trim() === ''
        ? undefined
        : Number(salaryMax);

    // ----------------------------------------------------------
    // SALARY VALIDATION
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------

    try {
      await updateApplication.mutateAsync({
        id,

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
          // Backend expects number.
          salaryMin:
            minSalary,

          salaryMax:
            maxSalary,

          currency,

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

      router.push(
        `/applications/${id}`,
      );
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message;

      setError(
        Array.isArray(serverMessage)
          ? serverMessage.join(', ')
          : serverMessage ||
              'Unable to update application.',
      );
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError || !application) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl">

          <Link
            href="/applications"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Applications
          </Link>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Unable to load application.
          </div>

        </div>
      </DashboardLayout>
    );
  }

  // ==========================================================
  // FORM
  // ==========================================================

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          href={`/applications/${id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Application
        </Link>

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Application
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your job application details.
          </p>
        </div>

        {/* FORM CARD */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">

            {/* COMPANY + POSITION */}

            <div className="grid gap-5 sm:grid-cols-2">

              <Field
                label="Company"
                required
              >
                <input
                  required
                  value={company}
                  onChange={(e) =>
                    setCompany(
                      e.target.value,
                    )
                  }
                  placeholder="Google"
                  className="input"
                />
              </Field>

              <Field
                label="Position"
                required
              >
                <input
                  required
                  value={position}
                  onChange={(e) =>
                    setPosition(
                      e.target.value,
                    )
                  }
                  placeholder="Software Engineer"
                  className="input"
                />
              </Field>

            </div>

            {/* JOB URL */}

            <Field label="Job URL">
              <input
                type="url"
                value={jobUrl}
                onChange={(e) =>
                  setJobUrl(
                    e.target.value,
                  )
                }
                placeholder="https://..."
                className="input"
              />
            </Field>

            {/* LOCATION */}

            <Field label="Location">
              <input
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value,
                  )
                }
                placeholder="Bhopal / Remote"
                className="input"
              />
            </Field>

            {/* SALARY */}

            <div className="grid gap-5 sm:grid-cols-3">

              <Field label="Minimum Salary">
                <input
                  type="number"
                  min="0"
                  value={salaryMin}
                  onChange={(e) =>
                    setSalaryMin(
                      e.target.value,
                    )
                  }
                  placeholder="500000"
                  className="input"
                />
              </Field>

              <Field label="Maximum Salary">
                <input
                  type="number"
                  min="0"
                  value={salaryMax}
                  onChange={(e) =>
                    setSalaryMax(
                      e.target.value,
                    )
                  }
                  placeholder="800000"
                  className="input"
                />
              </Field>

              <Field label="Currency">
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      e.target.value,
                    )
                  }
                  className="input"
                >
                  <option value="INR">
                    INR
                  </option>

                  <option value="USD">
                    USD
                  </option>

                  <option value="EUR">
                    EUR
                  </option>

                  <option value="GBP">
                    GBP
                  </option>
                </select>
              </Field>

            </div>

            {/* JOB TYPE + STATUS */}

            <div className="grid gap-5 sm:grid-cols-2">

              <Field label="Job Type">
                <select
                  value={jobType}
                  onChange={(e) =>
                    setJobType(
                      e.target.value,
                    )
                  }
                  className="input"
                >
                  {jobTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {formatLabel(type)}
                      </option>
                    ),
                  )}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value,
                    )
                  }
                  className="input"
                >
                  {statuses.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {formatLabel(item)}
                      </option>
                    ),
                  )}
                </select>
              </Field>

            </div>

            {/* DATES */}

            <div className="grid gap-5 sm:grid-cols-2">

              <Field
                label="Applied Date"
                required
              >
                <input
                  required
                  type="date"
                  value={appliedDate}
                  onChange={(e) =>
                    setAppliedDate(
                      e.target.value,
                    )
                  }
                  className="input"
                />
              </Field>

              <Field label="Deadline">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) =>
                    setDeadline(
                      e.target.value,
                    )
                  }
                  className="input"
                />
              </Field>

            </div>

            {/* DESCRIPTION */}

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value,
                  )
                }
                rows={6}
                placeholder="Job description, requirements, important details..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Field>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

              <Link
                href={`/applications/${id}`}
                className="rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  updateApplication.isPending
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateApplication.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {updateApplication.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>

            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

// ============================================================
// FIELD
// ============================================================

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// ============================================================
// FORMAT LABEL
// ============================================================

function formatLabel(
  value: string,
) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}