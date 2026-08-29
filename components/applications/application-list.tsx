'use client';

import {
  Edit,
  ExternalLink,
  Trash2,
  BriefcaseBusiness,
  MapPin,
  Calendar,
} from 'lucide-react';

import {
  Application,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/hooks/use-applications';

interface ApplicationListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
}

export function ApplicationList({
  applications,
  onEdit,
}: ApplicationListProps) {
  const deleteApplication = useDeleteApplication();
  const updateStatus = useUpdateApplicationStatus();

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Delete this application?');
    if (!confirmed) return;
    await deleteApplication.mutateAsync(id);
  }

  async function handleStatusChange(id: string, status: string) {
    await updateStatus.mutateAsync({
      id,
      status,
    });
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-12 text-center shadow-xl backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
          <BriefcaseBusiness className="h-8 w-8 text-blue-600" />
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">
          No applications yet
        </p>
        <p className="mt-1.5 text-sm text-gray-500">
          Add your first job application to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="border-b border-gray-200/80 bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Company
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Position
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Applied
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {applications.map((application) => (
              <tr
                key={application.id}
                className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                      <BriefcaseBusiness className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {application.company}
                      </p>
                      {application.location && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {application.location}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-700">
                    {application.position}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {formatLabel(application.jobType)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <select
                    value={application.status}
                    disabled={updateStatus.isPending}
                    onChange={(e) =>
                      handleStatusChange(application.id, e.target.value)
                    }
                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none transition-all duration-200 cursor-pointer ${
                      application.status === 'APPLIED'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : application.status === 'INTERVIEW'
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : application.status === 'OFFER'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : application.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {formatDate(application.appliedDate)}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {application.jobUrl && (
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600 hover:scale-110"
                        title="Open job"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onEdit(application)}
                      className="rounded-xl p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600 hover:scale-110"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(application.id)}
                      disabled={deleteApplication.isPending}
                      className="rounded-xl p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}