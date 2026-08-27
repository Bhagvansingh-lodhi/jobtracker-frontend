'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';

// ============================================================
// TYPES
// ============================================================

export interface Reminder {
  id: string;
  applicationId: string;
  company: string;
  position: string;
  message: string;
  remindAt: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateReminderData {
  applicationId: string;
  message: string;
  remindAt: string;
}

export interface UpdateReminderData {
  message?: string;
  remindAt?: string;
}

// ============================================================
// GET ALL REMINDERS
// GET /api/reminders
// ============================================================

export function useReminders() {
  return useQuery<Reminder[]>({
    queryKey: ['reminders'],

    queryFn: async () => {
      const response =
        await api.get('/reminders');

      return Array.isArray(response.data)
        ? response.data
        : response.data.data ?? [];
    },
  });
}

// ============================================================
// CREATE REMINDER
// POST /api/reminders
// ============================================================

export function useCreateReminder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateReminderData,
    ) => {
      const response =
        await api.post(
          '/reminders',
          data,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reminders'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

// ============================================================
// UPDATE REMINDER
// PATCH /api/reminders/:id
// ============================================================

export function useUpdateReminder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateReminderData;
    }) => {
      const response =
        await api.patch(
          `/reminders/${id}`,
          data,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reminders'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

// ============================================================
// COMPLETE REMINDER
// PATCH /api/reminders/:id/complete
// ============================================================

export function useCompleteReminder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.patch(
          `/reminders/${id}/complete`,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reminders'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

// ============================================================
// DELETE REMINDER
// DELETE /api/reminders/:id
// ============================================================

export function useDeleteReminder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.delete(
          `/reminders/${id}`,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reminders'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}