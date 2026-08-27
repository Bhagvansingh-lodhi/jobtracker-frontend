'use client';

import { useState } from 'react';

import {
  Download,
  FileDown,
  Loader2,
  Plus,
  RefreshCw,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';

import { ApplicationForm } from '@/components/applications/application-form';

import { EditApplicationForm } from '@/components/applications/edit-application-form';

import { ApplicationList } from '@/components/applications/application-list';

import {
  Application,
  useApplications,
} from '@/hooks/use-applications';

import {
  exportApplicationsCsv,
  exportApplicationsPdf,
} from '@/hooks/use-export';

export default function ApplicationsPage() {
  const [showForm, setShowForm] =
    useState(false);

  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

  const [exporting, setExporting] =
    useState<'csv' | 'pdf' | null>(null);

  const {
    data: applications = [],
    isLoading,
    isError,
    refetch,
  } = useApplications();

  async function handleExport(
    type: 'csv' | 'pdf',
  ) {
    try {
      setExporting(type);

      if (type === 'csv') {
        await exportApplicationsCsv();
      } else {
        await exportApplicationsPdf();
      }
    } catch (error) {
      console.error(
        'Export failed:',
        error,
      );

      window.alert(
        `Unable to export ${
          type === 'csv'
            ? 'CSV'
            : 'PDF'
        }. Please try again.`,
      );
    } finally {
      setExporting(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Applications
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your job applications.
            </p>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap items-center gap-2">

            {/* CSV EXPORT */}

            <button
              type="button"
              onClick={() =>
                handleExport('csv')
              }
              disabled={
                exporting !== null ||
                applications.length === 0
              }
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting === 'csv' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}

              {exporting === 'csv'
                ? 'Exporting...'
                : 'CSV'}
            </button>

            {/* PDF EXPORT */}

            <button
              type="button"
              onClick={() =>
                handleExport('pdf')
              }
              disabled={
                exporting !== null ||
                applications.length === 0
              }
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting === 'pdf' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}

              {exporting === 'pdf'
                ? 'Exporting...'
                : 'PDF'}
            </button>

            {/* ADD APPLICATION */}

            <button
              type="button"
              onClick={() =>
                setShowForm(true)
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />

              Add Application
            </button>

          </div>
        </div>

        {/* ERROR */}

        {isError && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <span>
              Unable to load applications.
            </span>

            <button
              type="button"
              onClick={() =>
                refetch()
              }
              className="flex items-center gap-2 font-medium"
            >
              <RefreshCw className="h-4 w-4" />

              Retry
            </button>

          </div>
        )}

        {/* APPLICATION LIST */}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <ApplicationList
            applications={
              applications
            }
            onEdit={(application) =>
              setEditingApplication(
                application,
              )
            }
          />
        )}

        {/* ADD APPLICATION FORM */}

        {showForm && (
          <ApplicationForm
            onSuccess={() =>
              setShowForm(false)
            }
            onCancel={() =>
              setShowForm(false)
            }
          />
        )}

        {/* EDIT APPLICATION FORM */}

        {editingApplication && (
          <EditApplicationForm
            application={
              editingApplication
            }
            onSuccess={() =>
              setEditingApplication(
                null,
              )
            }
            onCancel={() =>
              setEditingApplication(
                null,
              )
            }
          />
        )}

      </div>
    </DashboardLayout>
  );
}