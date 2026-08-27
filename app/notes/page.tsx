'use client';

import { useState } from 'react';

import {
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  NoteForm,
} from '@/components/notes/note-form';

import {
  useApplications,
} from '@/hooks/use-applications';

import {
  Note,
  useDeleteNote,
  useNotes,
} from '@/hooks/use-notes';

export default function NotesPage() {
  const [showForm, setShowForm] =
    useState(false);

  const [editingNote, setEditingNote] =
    useState<Note | undefined>();

  const [selectedApplication, setSelectedApplication] =
    useState('');

  const {
    data: notes = [],
    isLoading,
    isError,
  } = useNotes(
    selectedApplication || undefined,
  );

  const {
    data: applications = [],
  } = useApplications();

  const deleteNote =
    useDeleteNote();

  // ============================================================
  // ADD
  // ============================================================

  function handleAdd() {
    setEditingNote(undefined);
    setShowForm(true);
  }

  // ============================================================
  // EDIT
  // ============================================================

  function handleEdit(
    note: Note,
  ) {
    setEditingNote(note);
    setShowForm(true);
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this note?',
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteNote.mutateAsync(
        id,
      );
    } catch {
      window.alert(
        'Unable to delete note.',
      );
    }
  }

  // ============================================================
  // CLOSE FORM
  // ============================================================

  function closeForm() {
    setShowForm(false);
    setEditingNote(undefined);
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Notes
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Keep important notes about your job applications.
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

            Add Note
          </button>

        </div>

        {/* NO APPLICATION */}

        {applications.length === 0 && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Add an application first before creating a note.
          </div>
        )}

        {/* FILTER */}

        {applications.length > 0 && (
          <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by application
            </label>

            <select
              value={
                selectedApplication
              }
              onChange={(event) =>
                setSelectedApplication(
                  event.target.value,
                )
              }
              className="h-11 w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">
                All applications
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
        )}

        {/* ERROR */}

        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load notes.
          </div>
        )}

        {/* LOADING */}

        {isLoading ? (

          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>

        ) : notes.length === 0 ? (

          /* EMPTY */

          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">

            <FileText className="mx-auto h-10 w-10 text-gray-300" />

            <p className="mt-4 font-medium text-gray-900">
              No notes yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add notes to keep track of important details.
            </p>

          </div>

        ) : (

          /* NOTES */

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {notes.map(
              (note) => (
                <div
                  key={note.id}
                  className="flex flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  {/* APPLICATION */}

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900">
                        {note.company}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {note.position}
                      </p>
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="mt-5 flex-1">

                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                      {note.content}
                    </p>

                  </div>

                  {/* DATE */}

                  <p className="mt-5 text-xs text-gray-400">
                    Updated{' '}
                    {formatDate(
                      note.updatedAt,
                    )}
                  </p>

                  {/* ACTIONS */}

                  <div className="mt-4 flex justify-end gap-1 border-t pt-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          note,
                        )
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />

                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          note.id,
                        )
                      }
                      disabled={
                        deleteNote.isPending
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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
          <NoteForm
            applicationId={
              editingNote?.applicationId ??
              selectedApplication
            }

            note={
              editingNote
            }

            onSuccess={
              closeForm
            }

            onCancel={
              closeForm
            }
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