'use client';

import { useState } from 'react';

import {
  Check,
  Loader2,
  Plus,
  Tag as TagIcon,
  X,
} from 'lucide-react';

import {
  useApplicationTags,
  useAttachTag,
  useDetachTag,
  useTags,
} from '@/hooks/use-tags';

interface ApplicationTagsProps {
  applicationId: string;
}

export function ApplicationTags({
  applicationId,
}: ApplicationTagsProps) {
  const {
    data: applicationTags = [],
    isLoading: applicationTagsLoading,
    isError: applicationTagsError,
  } = useApplicationTags(applicationId);

  const {
    data: tags = [],
    isLoading: tagsLoading,
  } = useTags();

  const attachTag =
    useAttachTag();

  const detachTag =
    useDetachTag();

  const [showAdd, setShowAdd] =
    useState(false);

  const [selectedTagId, setSelectedTagId] =
    useState('');

  const attachedTagIds =
    new Set(
      applicationTags.map(
        (tag) => tag.id,
      ),
    );

  const availableTags =
    tags.filter(
      (tag) =>
        !attachedTagIds.has(tag.id),
    );

  async function handleAttach() {
    if (!selectedTagId) return;

    try {
      await attachTag.mutateAsync({
        tagId: selectedTagId,
        applicationId,
      });

      setSelectedTagId('');
      setShowAdd(false);
    } catch (error: any) {
      window.alert(
        error?.response?.data?.message ||
          'Unable to attach tag.',
      );
    }
  }

  async function handleDetach(
    tagId: string,
  ) {
    try {
      await detachTag.mutateAsync({
        tagId,
        applicationId,
      });
    } catch (error: any) {
      window.alert(
        error?.response?.data?.message ||
          'Unable to remove tag.',
      );
    }
  }

  return (
    <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-blue-600" />

            <h2 className="font-semibold text-gray-900">
              Tags
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Organize this application with tags.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowAdd(
              !showAdd,
            )
          }
          disabled={
            tagsLoading ||
            availableTags.length === 0
          }
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showAdd ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}

          {showAdd
            ? 'Cancel'
            : 'Add Tag'}
        </button>

      </div>

      {/* ADD TAG */}

      {showAdd && (
        <div className="mt-5 rounded-lg border bg-gray-50 p-4">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Tag
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">

            <select
              value={selectedTagId}
              onChange={(event) =>
                setSelectedTagId(
                  event.target.value,
                )
              }
              className="h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                Select a tag
              </option>

              {availableTags.map(
                (tag) => (
                  <option
                    key={tag.id}
                    value={tag.id}
                  >
                    {tag.name}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              onClick={
                handleAttach
              }
              disabled={
                !selectedTagId ||
                attachTag.isPending
              }
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {attachTag.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              Add
            </button>

          </div>

          {availableTags.length === 0 && (
            <p className="mt-2 text-xs text-gray-500">
              All available tags are already attached.
            </p>
          )}

        </div>
      )}

      {/* ERROR */}

      {applicationTagsError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load application tags.
        </div>
      )}

      {/* LOADING */}

      {applicationTagsLoading ? (
        <div className="flex h-20 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        </div>
      ) : applicationTags.length === 0 ? (

        /* EMPTY */

        <div className="mt-5 rounded-lg border border-dashed p-6 text-center">
          <TagIcon className="mx-auto h-7 w-7 text-gray-300" />

          <p className="mt-2 text-sm font-medium text-gray-700">
            No tags added
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Add tags to organize this application.
          </p>
        </div>

      ) : (

        /* TAG LIST */

        <div className="mt-5 flex flex-wrap gap-2">

          {applicationTags.map(
            (tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5"
              >
                <TagIcon className="h-3.5 w-3.5 text-blue-600" />

                <span className="text-sm font-medium text-blue-700">
                  {tag.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleDetach(
                      tag.id,
                    )
                  }
                  disabled={
                    detachTag.isPending
                  }
                  className="rounded-full p-0.5 text-blue-400 hover:bg-blue-100 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Remove ${tag.name}`}
                >
                  {detachTag.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ),
          )}

        </div>
      )}

    </section>
  );
}