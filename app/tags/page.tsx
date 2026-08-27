'use client';

import { useState } from 'react';

import {
  Hash,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  TagForm,
} from '@/components/tags/tag-form';

import {
  useApplications,
} from '@/hooks/use-applications';

import {
  Tag,
  useApplicationTags,
  useAttachTag,
  useDeleteTag,
  useDetachTag,
  useTags,
} from '@/hooks/use-tags';

export default function TagsPage() {
  const [showForm, setShowForm] =
    useState(false);

  const [editingTag, setEditingTag] =
    useState<Tag | undefined>();

  const [selectedApplication, setSelectedApplication] =
    useState('');

  const {
    data: tags = [],
    isLoading,
    isError,
  } = useTags();

  const {
    data: applications = [],
  } = useApplications();

  const {
    data: applicationTags = [],
    isLoading: applicationTagsLoading,
  } = useApplicationTags(
    selectedApplication || undefined,
  );

  const attachTag =
    useAttachTag();

  const detachTag =
    useDetachTag();

  const deleteTag =
    useDeleteTag();

  // ============================================================
  // ADD
  // ============================================================

  function handleAdd() {
    setEditingTag(undefined);
    setShowForm(true);
  }

  // ============================================================
  // EDIT
  // ============================================================

  function handleEdit(
    tag: Tag,
  ) {
    setEditingTag(tag);
    setShowForm(true);
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(
    tag: Tag,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${tag.name}"?`,
      );

    if (!confirmed) return;

    try {
      await deleteTag.mutateAsync(
        tag.id,
      );
    } catch {
      window.alert(
        'Unable to delete tag.',
      );
    }
  }

  // ============================================================
  // ATTACH / DETACH
  // ============================================================

  function isAttached(
    tagId: string,
  ) {
    return applicationTags.some(
      (tag) =>
        tag.id === tagId,
    );
  }

  async function toggleTag(
    tagId: string,
  ) {
    if (!selectedApplication) {
      return;
    }

    try {
      if (isAttached(tagId)) {
        await detachTag.mutateAsync({
          tagId,
          applicationId:
            selectedApplication,
        });
      } else {
        await attachTag.mutateAsync({
          tagId,
          applicationId:
            selectedApplication,
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      window.alert(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to update application tag.',
      );
    }
  }

  // ============================================================
  // CLOSE FORM
  // ============================================================

  function closeForm() {
    setShowForm(false);
    setEditingTag(undefined);
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
              Tags
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Organize your job applications with custom tags.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />

            Create Tag
          </button>

        </div>

        {/* ERROR */}

        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load tags.
          </div>
        )}

        {/* TAGS */}

        {isLoading ? (

          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>

        ) : tags.length === 0 ? (

          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">

            <Hash className="mx-auto h-10 w-10 text-gray-300" />

            <p className="mt-4 font-medium text-gray-900">
              No tags yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Create your first tag to organize applications.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />

              Create Tag
            </button>

          </div>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {tags.map(
              (tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Hash className="h-5 w-5 text-blue-600" />
                    </div>

                    <p className="truncate font-semibold text-gray-900">
                      {tag.name}
                    </p>

                  </div>

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          tag,
                        )
                      }
                      className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          tag,
                        )
                      }
                      disabled={
                        deleteTag.isPending
                      }
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              ),
            )}

          </div>
        )}

        {/* ====================================================== */}
        {/* APPLICATION TAG MANAGER */}
        {/* ====================================================== */}

        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="font-semibold text-gray-900">
              Application Tags
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select an application and manage its tags.
            </p>

          </div>

          <select
            value={selectedApplication}
            onChange={(event) =>
              setSelectedApplication(
                event.target.value,
              )
            }
            className="h-11 w-full max-w-xl rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
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

          {selectedApplication && (
            <div className="mt-6">

              {applicationTagsLoading ? (

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading tags...
                </div>

              ) : (

                <div className="flex flex-wrap gap-2">

                  {tags.map(
                    (tag) => {
                      const attached =
                        isAttached(
                          tag.id,
                        );

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() =>
                            toggleTag(
                              tag.id,
                            )
                          }
                          disabled={
                            attachTag.isPending ||
                            detachTag.isPending
                          }
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                            attached
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600'
                          }`}
                        >
                          <Hash className="h-3.5 w-3.5" />

                          {tag.name}

                          {attached && (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </button>
                      );
                    },
                  )}

                </div>
              )}

              {!applicationTagsLoading &&
                tags.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Create a tag first.
                  </p>
                )}

            </div>
          )}

        </div>

        {/* FORM */}

        {showForm && (
          <TagForm
            tag={editingTag}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        )}

      </div>
    </DashboardLayout>
  );
}