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
  Tag,
  useCreateTag,
  useUpdateTag,
} from '@/hooks/use-tags';

interface TagFormProps {
  tag?: Tag;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TagForm({
  tag,
  onSuccess,
  onCancel,
}: TagFormProps) {
  const isEdit = Boolean(tag);

  const createTag =
    useCreateTag();

  const updateTag =
    useUpdateTag();

  const [name, setName] =
    useState('');

  const [error, setError] =
    useState('');

  useEffect(() => {
    setName(
      tag?.name ?? '',
    );
  }, [tag]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        'Please enter a tag name.',
      );
      return;
    }

    try {
      if (isEdit && tag) {
        await updateTag.mutateAsync({
          id: tag.id,

          data: {
            name: trimmedName,
          },
        });
      } else {
        await createTag.mutateAsync({
          name: trimmedName,
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
              } tag.`,
      );
    }
  }

  const isPending =
    createTag.isPending ||
    updateTag.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit
                ? 'Edit Tag'
                : 'Create Tag'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? 'Update your tag name.'
                : 'Create a tag to organize applications.'}
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tag Name *
            </label>

            <input
              required
              autoFocus
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              maxLength={50}
              placeholder="e.g. Dream Company"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                  ? 'Update Tag'
                  : 'Create Tag'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}