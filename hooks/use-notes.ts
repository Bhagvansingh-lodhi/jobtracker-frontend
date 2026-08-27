'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';

export interface Note {
  id: string;
  applicationId: string;
  company: string;
  position: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  applicationId: string;
  content: string;
}

export interface UpdateNoteData {
  content: string;
}

export function useNotes(
  applicationId?: string,
) {
  return useQuery<Note[]>({
    queryKey: [
      'notes',
      applicationId ?? 'all',
    ],

    queryFn: async () => {
      const response =
        await api.get('/notes', {
          params: applicationId
            ? { applicationId }
            : undefined,
        });

      return response.data ?? [];
    },
  });
}

export function useCreateNote() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateNoteData,
    ) => {
      const response =
        await api.post(
          '/notes',
          data,
        );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });
    },
  });
}

export function useUpdateNote() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateNoteData;
    }) => {
      const response =
        await api.patch(
          `/notes/${id}`,
          data,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.delete(
          `/notes/${id}`,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });
}