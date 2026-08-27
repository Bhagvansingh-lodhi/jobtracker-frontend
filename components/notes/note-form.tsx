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
  useCreateNote,
  useUpdateNote,
} from '@/hooks/use-notes';

interface NoteFormProps {
  applicationId: string;
  note?: {
    id: string;
    content: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function NoteForm({
  applicationId,
  note,
  onSuccess,
  onCancel,
}: NoteFormProps) {

  const isEditing = Boolean(note);

  const createNote =
    useCreateNote();

  const updateNote =
    useUpdateNote();

  const [content, setContent] =
    useState(
      note?.content ?? '',
    );

  const [error, setError] =
    useState('');


  // ==========================================================
  // LOAD NOTE
  // ==========================================================

  useEffect(() => {

    setContent(
      note?.content ?? '',
    );

  }, [note]);


  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError('');


    if (!content.trim()) {

      setError(
        'Note cannot be empty.',
      );

      return;
    }


    try {

      if (isEditing && note) {

        await updateNote.mutateAsync({
          id: note.id,

          data: {
            content:
              content.trim(),
          },
        });

      } else {

        await createNote.mutateAsync({
          applicationId,

          content:
            content.trim(),
        });

      }


      onSuccess();

    } catch (err: any) {

      const serverMessage =
        err?.response?.data?.message;


      setError(
        Array.isArray(serverMessage)
          ? serverMessage.join(', ')
          : serverMessage ||
              `Unable to ${
                isEditing
                  ? 'update'
                  : 'create'
              } note.`,
      );
    }
  }


  const isPending =
    createNote.isPending ||
    updateNote.isPending;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>

            <h2 className="text-lg font-semibold text-gray-900">

              {isEditing
                ? 'Edit Note'
                : 'Add Note'}

            </h2>


            <p className="mt-1 text-sm text-gray-500">

              {isEditing
                ? 'Update your application note.'
                : 'Add an important note about this application.'}

            </p>

          </div>


          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >

            <X className="h-5 w-5" />

          </button>

        </div>


        {/* ==================================================
            FORM
        ================================================== */}

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


          {/* CONTENT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">

              Note

            </label>


            <textarea
              autoFocus
              required
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value,
                )
              }
              rows={7}
              maxLength={10000}
              placeholder="e.g. Recruiter said they will get back to me next week..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />


            <div className="mt-1 flex justify-between text-xs text-gray-400">

              <span>
                Keep your notes clear and useful.
              </span>

              <span>
                {content.length}/10000
              </span>

            </div>

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
              disabled={
                isPending ||
                !content.trim()
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isPending && (

                <Loader2 className="h-4 w-4 animate-spin" />

              )}


              {isPending
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                  ? 'Save Changes'
                  : 'Add Note'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}