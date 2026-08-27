'use client';

import {
  Edit,
  ExternalLink,
  Trash2,
} from 'lucide-react';

import {
  Application,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/hooks/use-applications';

interface ApplicationListProps {
  applications: Application[];
  onEdit: (
    application: Application,
  ) => void;
}

export function ApplicationList({
  applications,
  onEdit,
}: ApplicationListProps) {
  const deleteApplication =
    useDeleteApplication();

  const updateStatus =
    useUpdateApplicationStatus();

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this application?',
      );

    if (!confirmed) return;

    await deleteApplication.mutateAsync(
      id,
    );
  }

  async function handleStatusChange(
    id: string,
    status: string,
  ) {
    await updateStatus.mutateAsync({
      id,
      status,
    });
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="font-medium text-gray-900">
          No applications yet
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Add your first job application to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">

          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Company
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Position
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Type
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Applied
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {applications.map(
              (application) => (
                <tr
                  key={application.id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {application.company}
                    </p>

                    {application.location && (
                      <p className="mt-1 text-xs text-gray-500">
                        {application.location}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {application.position}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatLabel(
                      application.jobType,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={
                        application.status
                      }
                      disabled={
                        updateStatus.isPending
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          application.id,
                          e.target.value,
                        )
                      }
                      className="rounded-full border-0 bg-gray-100 px-3 py-1.5 text-xs font-semibold outline-none"
                    >
                      <option value="APPLIED">
                        Applied
                      </option>

                      <option value="INTERVIEW">
                        Interview
                      </option>

                      <option value="OFFER">
                        Offer
                      </option>

                      <option value="REJECTED">
                        Rejected
                      </option>

                      <option value="WITHDRAWN">
                        Withdrawn
                      </option>
                    </select>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatDate(
                      application.appliedDate,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">

                      {application.jobUrl && (
                        <a
                          href={
                            application.jobUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                          title="Open job"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(
                            application,
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            application.id,
                          )
                        }
                        disabled={
                          deleteApplication.isPending
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  </td>

                </tr>
              ),
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

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

function formatDate(
  value: string,
) {
  return new Date(
    `${value}T00:00:00`,
  ).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );
}