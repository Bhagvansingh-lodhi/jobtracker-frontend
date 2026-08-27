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

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface ApplicationTag {
  id: string;
  name: string;
}

export interface CreateTagData {
  name: string;
}

export interface UpdateTagData {
  name: string;
}

// ============================================================
// GET ALL TAGS
// GET /api/tags
// ============================================================

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ['tags'],

    queryFn: async () => {
      const response =
        await api.get('/tags');

      return response.data;
    },
  });
}

// ============================================================
// GET APPLICATION TAGS
// GET /api/tags/application/:applicationId
// ============================================================

export function useApplicationTags(
  applicationId?: string,
) {
  return useQuery<ApplicationTag[]>({
    queryKey: [
      'tags',
      'application',
      applicationId,
    ],

    enabled: Boolean(applicationId),

    queryFn: async () => {
      const response =
        await api.get(
          `/tags/application/${applicationId}`,
        );

      return response.data;
    },
  });
}

// ============================================================
// CREATE TAG
// POST /api/tags
// ============================================================

export function useCreateTag() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateTagData,
    ) => {
      const response =
        await api.post(
          '/tags',
          data,
        );

      return response.data as Tag;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tags'],
      });
    },
  });
}

// ============================================================
// UPDATE TAG
// PATCH /api/tags/:id
// ============================================================

export function useUpdateTag() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTagData;
    }) => {
      const response =
        await api.patch(
          `/tags/${id}`,
          data,
        );

      return response.data as Tag;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tags'],
      });
    },
  });
}

// ============================================================
// DELETE TAG
// DELETE /api/tags/:id
// ============================================================

export function useDeleteTag() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.delete(
          `/tags/${id}`,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tags'],
      });
    },
  });
}

// ============================================================
// ATTACH TAG
// POST /api/tags/:tagId/applications/:applicationId
// ============================================================

export function useAttachTag() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      applicationId,
    }: {
      tagId: string;
      applicationId: string;
    }) => {
      const response =
        await api.post(
          `/tags/${tagId}/applications/${applicationId}`,
        );

      return response.data;
    },

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          'tags',
          'application',
          variables.applicationId,
        ],
      });
    },
  });
}

// ============================================================
// DETACH TAG
// DELETE /api/tags/:tagId/applications/:applicationId
// ============================================================

export function useDetachTag() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      applicationId,
    }: {
      tagId: string;
      applicationId: string;
    }) => {
      const response =
        await api.delete(
          `/tags/${tagId}/applications/${applicationId}`,
        );

      return response.data;
    },

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          'tags',
          'application',
          variables.applicationId,
        ],
      });
    },
  });
}