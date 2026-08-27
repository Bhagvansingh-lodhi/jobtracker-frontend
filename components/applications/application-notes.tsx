'use client';

import {
  FormEvent,
  useState,
} from 'react';

import {
  Check,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import {
  useCreateNote,
  useDeleteNote,
  useNotes,
  useUpdateNote,
} from '@/hooks/use-notes';

interface ApplicationNotesProps {
  applicationId: string;
}

export function ApplicationNotes({
  applicationId,
}: ApplicationNotesProps) {
  const {
    data: notes = [],
    isLoading,
    isError,
  } = useNotes(applicationId);

  const createNote =
    useCreateNote();

  const updateNote =
    useUpdateNote();

  const deleteNote =
    useDeleteNote();

  const [showForm, setShowForm] =
    useState(false);

  const [content, setContent] =
    useState('');

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editContent, setEditContent] =
    useState('');

  const [error, setError] =
    useState('');

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!content.trim()) {
      setError('Note cannot be empty.');
      return;
    }

    setError('');

    try {
      await createNote.mutateAsync({
        applicationId,
        content: content.trim(),
      });

      setContent('');
      setShowForm(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to create note.',
      );
    }
  }

  async function handleUpdate(
    id: string,
  ) {
    if (!editContent.trim()) {
      setError('Note cannot be empty.');
      return;
    }

    setError('');

    try {
      await updateNote.mutateAsync({
        id,
        data: {
          content:
            editContent.trim(),
        },
      });

      setEditingId(null);
      setEditContent('');
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to update note.',
      );
    }
  }

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this note?',
      );

    if (!confirmed) return;

    try {
      await deleteNote.mutateAsync(id);
    } catch {
      setError(
        'Unable to delete note.',
      );
    }
  }

  function startEditing(
    id: string,
    value: string,
  ) {
    setEditingId(id);
    setEditContent(value);
    setError('');
  }

  return (
    <section className="mt-6 rounded-xl border bg-white shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h2 className="font-semibold text-gray-900">
            Notes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Keep important notes about this application.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(true)
          }
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />

          Add Note
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ADD FORM */}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border-b bg-gray-50 p-6"
        >
          <label className="mb-2 block text-sm font-medium text-gray-700">
            New Note
          </label>

          <textarea
            autoFocus
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value,
              )
            }
            rows={4}
            maxLength={10000}
            placeholder="Write something important about this application..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setContent('');
                setError('');
              }}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white"
            >
              <X className="h-4 w-4" />

              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createNote.isPending
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {createNote.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {createNote.isPending
                ? 'Saving...'
                : 'Save Note'}
            </button>
          </div>
        </form>
      )}

      {/* LOADING */}

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      )}

      {/* ERROR FROM QUERY */}

      {isError && (
        <div className="p-6 text-sm text-red-600">
          Unable to load notes.
        </div>
      )}

      {/* EMPTY */}

      {!isLoading &&
        !isError &&
        notes.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              No notes yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first note for this application.
            </p>
          </div>
        )}

      {/* NOTES */}

      {!isLoading &&
        !isError &&
        notes.length > 0 && (
          <div className="divide-y">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-6"
              >
                {editingId === note.id ? (
                  <div>
                    <textarea
                      autoFocus
                      value={editContent}
                      onChange={(event) =>
                        setEditContent(
                          event.target.value,
                        )
                      }
                      rows={4}
                      maxLength={10000}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4" />

                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(
                            note.id,
                          )
                        }
                        disabled={
                          updateNote.isPending
                        }
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {updateNote.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}

                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {note.content}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-xs text-gray-400">
                        {formatDate(
                          note.updatedAt ||
                            note.createdAt,
                        )}
                      </p>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              note.id,
                              note.content,
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Edit3 className="h-3.5 w-3.5" />

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
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />

                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
    </section>
  );
}

function formatDate(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString(
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