'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: string;
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],

    queryFn: async () => {
      const response =
        await api.get('/notifications');

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return response.data?.data ?? [];
    },
  });
}

// ============================================================
// CREATE
// ============================================================

export function useCreateNotification() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateNotificationData,
    ) => {
      const response =
        await api.post(
          '/notifications',
          data,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}

// ============================================================
// MARK AS READ
// ============================================================

export function useMarkNotificationRead() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.patch(
          `/notifications/${id}/read`,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}

// ============================================================
// MARK ALL AS READ
// ============================================================

export function useMarkAllNotificationsRead() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response =
        await api.patch(
          '/notifications/read-all',
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}

// ============================================================
// DELETE
// ============================================================

export function useDeleteNotification() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.delete(
          `/notifications/${id}`,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}