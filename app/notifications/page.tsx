'use client';

import { useState } from 'react';

import {
  Bell,
  Loader2,
  Plus,
} from 'lucide-react';

import {
  DashboardLayout,
} from '@/components/layout/dashboard-layout';

import {
  NotificationList,
} from '@/components/notifications/notification-list';

import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/hooks/use-notifications';

export default function NotificationsPage() {
  const [showCreate, setShowCreate] =
    useState(false);

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useNotifications();

  const markRead =
    useMarkNotificationRead();

  const markAllRead =
    useMarkAllNotificationsRead();

  const deleteNotification =
    useDeleteNotification();

  async function handleRead(
    id: string,
  ) {
    try {
      await markRead.mutateAsync(id);
    } catch {
      window.alert(
        'Unable to mark notification as read.',
      );
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead.mutateAsync();
    } catch {
      window.alert(
        'Unable to mark notifications as read.',
      );
    }
  }

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this notification?',
      );

    if (!confirmed) return;

    try {
      await deleteNotification.mutateAsync(id);
    } catch {
      window.alert(
        'Unable to delete notification.',
      );
    }
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Stay updated with your job search activity.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreate(true)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />

            Create Notification
          </button>
        </div>

        {/* SUMMARY */}

        {!isLoading &&
          !isError && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Total Notifications
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {notifications.length}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Unread
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {unreadCount}
                </p>
              </div>
            </div>
          )}

        {/* ERROR */}

        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load notifications.
          </div>
        )}

        {/* LOADING */}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            loading={isLoading}
            onRead={handleRead}
            onDelete={handleDelete}
            onMarkAllRead={
              handleMarkAllRead
            }
          />
        )}

        {/* CREATE PLACEHOLDER */}

        {showCreate && (
          <CreateNotificationModal
            onClose={() =>
              setShowCreate(false)
            }
          />
        )}

      </div>
    </DashboardLayout>
  );
}

function CreateNotificationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-900">
          Create Notification
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Notifications will be generated automatically by JobTracker.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}