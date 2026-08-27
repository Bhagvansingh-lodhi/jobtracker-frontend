'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  User,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  useDeleteAccount,
  useProfile,
  useUpdateProfile,
} from '@/hooks/use-profile';

export default function ProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
  } = useProfile();

  const updateProfile =
    useUpdateProfile();

  const deleteAccount =
    useDeleteAccount();

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setEmail(profile.email ?? '');
    }
  }, [profile]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSuccess('');
    setError('');

    try {
      await updateProfile.mutateAsync({
        name,
        email,
      });

      setSuccess(
        'Profile updated successfully.',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to update profile.',
      );
    }
  }

  async function handleDeleteAccount() {
    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete your account? This action cannot be undone.',
      );

    if (!confirmed) return;

    try {
      await deleteAccount.mutateAsync();

      window.location.href =
        '/login';
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      window.alert(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to delete account.',
      );
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !profile) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Unable to load your profile.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information.
          </p>
        </div>

        {/* PROFILE CARD */}

        <div className="rounded-xl border bg-white shadow-sm">

          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {profile.name
                  ?.charAt(0)
                  .toUpperCase() || 'U'}
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  {profile.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
          >

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {profile.isEmailVerified ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600">
                      Email verified
                    </span>
                  </>
                ) : (
                  <span className="text-yellow-600">
                    Email not verified
                  </span>
                )}
              </div>
            </div>

            {/* SAVE */}

            <div className="flex justify-end border-t pt-5">
              <button
                type="submit"
                disabled={
                  updateProfile.isPending
                }
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateProfile.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {updateProfile.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* DANGER ZONE */}

        <div className="mt-6 rounded-xl border border-red-200 bg-white shadow-sm">

          <div className="border-b border-red-100 px-6 py-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />

              <h2 className="font-semibold text-red-700">
                Danger Zone
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Permanently delete your JobTracker account.
            </p>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Delete account
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleDeleteAccount
              }
              disabled={
                deleteAccount.isPending
              }
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deleteAccount.isPending
                ? 'Deleting...'
                : 'Delete Account'}
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}