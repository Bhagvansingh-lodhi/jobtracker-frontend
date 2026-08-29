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
  FileText,
  Calendar,
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

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
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
      const message = error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Unable to create note.',
      );
    }
  }

  async function handleUpdate(id: string) {
    if (!editContent.trim()) {
      setError('Note cannot be empty.');
      return;
    }

    setError('');

    try {
      await updateNote.mutateAsync({
        id,
        data: {
          content: editContent.trim(),
        },
      });

      setEditingId(null);
      setEditContent('');
    } catch (error: any) {
      const message = error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Unable to update note.',
      );
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Delete this note?');
    if (!confirmed) return;

    try {
      await deleteNote.mutateAsync(id);
    } catch {
      setError('Unable to delete note.');
    }
  }

  function startEditing(id: string, value: string) {
    setEditingId(id);
    setEditContent(value);
    setError('');
  }

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-xl backdrop-blur-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200/80 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Notes
            </h2>
            <p className="text-sm text-gray-500">
              Keep important notes about this application
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* ADD FORM */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border-b border-gray-200/80 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6"
        >
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            New Note
          </label>
          <textarea
            autoFocus
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            maxLength={10000}
            placeholder="Write something important about this application..."
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setContent('');
                setError('');
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:border-gray-300"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={createNote.isPending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {createNote.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {createNote.isPending ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      )}

      {/* LOADING */}
      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* ERROR FROM QUERY */}
      {isError && (
        <div className="p-6 text-sm text-red-600">
          Unable to load notes.
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && !isError && notes.length === 0 && (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-900">
            No notes yet
          </p>
          <p className="mt-1.5 text-sm text-gray-500">
            Add your first note for this application
          </p>
        </div>
      )}

      {/* NOTES */}
      {!isLoading && !isError && notes.length > 0 && (
        <div className="divide-y divide-gray-100">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 transition-all hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30"
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    autoFocus
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                    rows={4}
                    maxLength={10000}
                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate(note.id)}
                      disabled={updateNote.isPending}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(note.updatedAt || note.createdAt)}
                    </p>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEditing(note.id, note.content)}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        disabled={deleteNote.isPending}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}