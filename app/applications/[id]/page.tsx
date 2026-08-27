'use client';

import {
  useState,
  type ReactNode,
} from 'react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  useApplication,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/hooks/use-applications';

import {
  useNotes,
  useDeleteNote,
} from '@/hooks/use-notes';

import {
  NoteForm,
} from '@/components/notes/note-form';

import {
  ApplicationTags,
} from '@/components/applications/application-tags';


// ============================================================
// STATUS OPTIONS
// ============================================================

const statuses = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
];


// ============================================================
// PAGE
// ============================================================

export default function ApplicationDetailPage() {

  const params = useParams();

  const router = useRouter();

  const id = params.id as string;


  // ==========================================================
  // APPLICATION
  // ==========================================================

  const {
    data: application,
    isLoading,
    isError,
  } = useApplication(id);


  const deleteApplication =
    useDeleteApplication();


  const updateStatus =
    useUpdateApplicationStatus();


  // ==========================================================
  // NOTES
  // ==========================================================

  const [showNoteForm, setShowNoteForm] =
    useState(false);

  const [editingNote, setEditingNote] =
    useState<{
      id: string;
      content: string;
    } | null>(null);


  const {
    data: notes = [],
    isLoading: notesLoading,
    isError: notesError,
  } = useNotes(id);


  const deleteNote =
    useDeleteNote();


  // ==========================================================
  // DELETE APPLICATION
  // ==========================================================

  async function handleDeleteApplication() {

    if (!application) return;


    const confirmed =
      window.confirm(
        `Delete ${application.company} application?`,
      );


    if (!confirmed) return;


    try {

      await deleteApplication.mutateAsync(
        application.id,
      );

      router.push('/applications');

    } catch {

      window.alert(
        'Unable to delete application.',
      );

    }
  }


  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  async function handleStatusChange(
    status: string,
  ) {

    if (!application) return;


    try {

      await updateStatus.mutateAsync({
        id: application.id,
        status,
      });

    } catch {

      window.alert(
        'Unable to update application status.',
      );

    }
  }


  // ==========================================================
  // DELETE NOTE
  // ==========================================================

  async function handleDeleteNote(
    noteId: string,
  ) {

    const confirmed =
      window.confirm(
        'Delete this note?',
      );


    if (!confirmed) return;


    try {

      await deleteNote.mutateAsync(
        noteId,
      );

    } catch {

      window.alert(
        'Unable to delete note.',
      );

    }
  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {

    return (
      <DashboardLayout>

        <div className="flex h-64 items-center justify-center text-sm text-gray-500">

          Loading application...

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

        <div className="mx-auto max-w-5xl">

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
  // PAGE
  // ==========================================================

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-5xl">


        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href="/applications"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >

          <ArrowLeft className="h-4 w-4" />

          Back to Applications

        </Link>


        {/* ==================================================
            APPLICATION HEADER
        ================================================== */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">


            {/* COMPANY */}

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                <BriefcaseBusiness className="h-6 w-6 text-blue-600" />

              </div>


              <div>

                <h1 className="text-2xl font-bold text-gray-900">

                  {application.company}

                </h1>


                <p className="mt-1 text-gray-500">

                  {application.position}

                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2">

              <Link
                href={`/applications/${application.id}/edit`}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >

                <Pencil className="h-4 w-4" />

                Edit

              </Link>


              <button
                type="button"
                onClick={
                  handleDeleteApplication
                }
                disabled={
                  deleteApplication.isPending
                }
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >

                <Trash2 className="h-4 w-4" />

                {deleteApplication.isPending
                  ? 'Deleting...'
                  : 'Delete'}

              </button>

            </div>

          </div>


          {/* STATUS */}

          <div className="mt-6 border-t pt-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">

              Application Status

            </label>


            <select
              value={application.status}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value,
                )
              }
              disabled={
                updateStatus.isPending
              }
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >

              {statuses.map(
                (status) => (

                  <option
                    key={status}
                    value={status}
                  >

                    {formatLabel(status)}

                  </option>

                ),
              )}

            </select>

          </div>

        </section>


        {/* ==================================================
            JOB DETAILS
        ================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">


          {/* DETAILS */}

          <section className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-gray-900">

              Job Details

            </h2>


            <div className="mt-5 space-y-4">

              <Detail
                label="Location"
                value={
                  application.location ||
                  'Not specified'
                }
                icon={
                  <MapPin className="h-4 w-4" />
                }
              />


              <Detail
                label="Job Type"
                value={formatLabel(
                  application.jobType,
                )}
              />


              <Detail
                label="Applied Date"
                value={formatDate(
                  application.appliedDate,
                )}
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
              />


              <Detail
                label="Deadline"
                value={
                  application.deadline
                    ? formatDate(
                        application.deadline,
                      )
                    : 'No deadline'
                }
              />


              <Detail
                label="Salary"
                value={formatSalary(
                  application,
                )}
              />

            </div>


            {/* JOB URL */}

            {application.jobUrl && (

              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >

                View Job Posting

                <ExternalLink className="h-4 w-4" />

              </a>

            )}

          </section>


          {/* DESCRIPTION */}

          <section className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-gray-900">

              Job Description

            </h2>


            {application.description ? (

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">

                {application.description}

              </p>

            ) : (

              <p className="mt-4 text-sm text-gray-400">

                No job description added.

              </p>

            )}

          </section>

        </div>


        {/* ==================================================
            NOTES
        ================================================== */}

        <section
          id="notes"
          className="mt-6 rounded-xl border bg-white p-6 shadow-sm"
        >


          {/* NOTES HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-semibold text-gray-900">

                Notes

              </h2>


              <p className="mt-1 text-sm text-gray-500">

                Keep important information about this application.

              </p>

            </div>


            <button
              type="button"
              onClick={() => {

                setEditingNote(null);

                setShowNoteForm(true);

              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >

              <Plus className="h-4 w-4" />

              Add Note

            </button>

          </div>


          {/* NOTES ERROR */}

          {notesError && (

            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">

              Unable to load notes.

            </div>

          )}


          {/* NOTES */}

          <div className="mt-5 space-y-3">


            {notesLoading ? (

              <div className="py-8 text-center text-sm text-gray-400">

                Loading notes...

              </div>

            ) : notes.length === 0 ? (

              <div className="rounded-lg border border-dashed p-8 text-center">

                <p className="text-sm font-medium text-gray-700">

                  No notes yet

                </p>


                <p className="mt-1 text-sm text-gray-400">

                  Add your first note for this application.

                </p>

              </div>

            ) : (

              notes.map(
                (note) => (

                  <div
                    key={note.id}
                    className="rounded-lg border bg-gray-50 p-4"
                  >

                    <div className="flex items-start justify-between gap-4">


                      {/* CONTENT */}

                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">

                        {note.content}

                      </p>


                      {/* ACTIONS */}

                      <div className="flex shrink-0 items-center gap-1">

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() => {

                            setShowNoteForm(
                              false,
                            );

                            setEditingNote({
                              id: note.id,
                              content:
                                note.content,
                            });

                          }}
                          className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-gray-900"
                          aria-label="Edit note"
                        >

                          <Pencil className="h-4 w-4" />

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          disabled={
                            deleteNote.isPending
                          }
                          onClick={() =>
                            handleDeleteNote(
                              note.id,
                            )
                          }
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                          aria-label="Delete note"
                        >

                          <Trash2 className="h-4 w-4" />

                        </button>

                      </div>

                    </div>


                    {/* DATE */}

                    <p className="mt-3 text-xs text-gray-400">

                      {formatDateTime(
                        note.createdAt,
                      )}

                      {note.updatedAt !==
                        note.createdAt && (
                        <span className="ml-2">
                          · Edited
                        </span>
                      )}

                    </p>

                  </div>

                ),
              )

            )}

          </div>

        </section>


        {/* ==================================================
            RELATED MODULES
        ================================================== */}

       <div className="mt-6 grid gap-6 md:grid-cols-3">

  <ModuleCard
    title="Interviews"
    description="View and manage interviews for this application."
    href={`/interviews?applicationId=${application.id}`}
  />

  <ModuleCard
    title="Reminders"
    description="Manage follow-up reminders for this application."
    href={`/reminders?applicationId=${application.id}`}
  />

  <ApplicationTags
    applicationId={application.id}
  />

</div>


        {/* ==================================================
            NOTE FORM
        ================================================== */}

        {(showNoteForm || editingNote) && (

          <NoteForm
            applicationId={
              application.id
            }

            note={
              editingNote ??
              undefined
            }

            onSuccess={() => {

              setShowNoteForm(false);

              setEditingNote(null);

            }}

            onCancel={() => {

              setShowNoteForm(false);

              setEditingNote(null);

            }}
          />

        )}

      </div>

    </DashboardLayout>
  );
}


// ============================================================
// DETAIL
// ============================================================

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {

  return (

    <div className="flex items-center justify-between gap-4">

      <div className="flex items-center gap-2 text-sm text-gray-500">

        {icon}

        {label}

      </div>


      <p className="text-right text-sm font-medium text-gray-900">

        {value}

      </p>

    </div>
  );
}


// ============================================================
// MODULE CARD
// ============================================================

function ModuleCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {

  return (

    <Link
      href={href}
      className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
    >

      <h3 className="font-semibold text-gray-900">

        {title}

      </h3>


      <p className="mt-1 text-sm text-gray-500">

        {description}

      </p>


      <p className="mt-4 text-sm font-medium text-blue-600">

        Open →

      </p>

    </Link>
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
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}


// ============================================================
// FORMAT DATE
// ============================================================

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


// ============================================================
// FORMAT DATE + TIME
// ============================================================

function formatDateTime(
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


// ============================================================
// FORMAT SALARY
// ============================================================

function formatSalary(
  application: {
    salaryMin?: string | null;
    salaryMax?: string | null;
    currency: string;
  },
) {

  const {
    salaryMin,
    salaryMax,
    currency,
  } = application;


  if (!salaryMin && !salaryMax) {

    return 'Not specified';

  }


  const symbol =
    currency === 'INR'
      ? '₹'
      : currency;


  if (salaryMin && salaryMax) {

    return `${symbol}${salaryMin} - ${symbol}${salaryMax}`;

  }


  if (salaryMin) {

    return `${symbol}${salaryMin}+`;

  }


  return `${symbol}${salaryMax}`;
}