'use client';

import {
  Bell,
  Check,
  Trash2,
} from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export function NotificationList({
  notifications,
  loading = false,
  onRead,
  onDelete,
  onMarkAllRead,
}: NotificationListProps) {
  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center py-16">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-6 w-6 text-gray-400" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No notifications
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          You're all caught up.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* HEADER */}

      <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Notifications
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount > 1
                    ? 's'
                    : ''
                }`
              : 'All notifications read'}
          </p>
        </div>

        {unreadCount > 0 &&
          onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 sm:self-auto"
            >
              <Check className="h-4 w-4" />

              Mark all as read
            </button>
          )}
      </div>

      {/* LIST */}

      <div className="divide-y">
        {notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className={`flex gap-4 px-5 py-5 transition ${
                notification.isRead
                  ? 'bg-white'
                  : 'bg-blue-50/40'
              }`}
            >
              {/* ICON */}

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  notification.isRead
                    ? 'bg-gray-100'
                    : 'bg-blue-100'
                }`}
              >
                <Bell
                  className={`h-5 w-5 ${
                    notification.isRead
                      ? 'text-gray-400'
                      : 'text-blue-600'
                  }`}
                />
              </div>

              {/* CONTENT */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm ${
                          notification.isRead
                            ? 'font-medium text-gray-700'
                            : 'font-semibold text-gray-900'
                        }`}
                      >
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {notification.message}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-gray-400">
                    {formatDate(
                      notification.createdAt,
                    )}
                  </span>
                </div>

                {/* ACTIONS */}

                <div className="mt-3 flex items-center gap-2">
                  {!notification.isRead &&
                    onRead && (
                      <button
                        type="button"
                        onClick={() =>
                          onRead(
                            notification.id,
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        <Check className="h-3.5 w-3.5" />

                        Mark as read
                      </button>
                    )}

                  {onDelete && (
                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          notification.id,
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />

                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function formatDate(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  );
}