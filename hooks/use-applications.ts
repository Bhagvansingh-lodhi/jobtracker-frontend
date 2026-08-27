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

export interface Application {
  id: string;
  company: string;
  position: string;
  jobUrl?: string | null;
  location?: string | null;
  salaryMin?: string | null;
  salaryMax?: string | null;
  currency: string;
  jobType: string;
  status: string;
  appliedDate: string;
  deadline?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationData {
  company: string;
  position: string;
  jobUrl?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  jobType?: string;
  status?: string;
  appliedDate: string;
  deadline?: string;
  description?: string;
}

export interface UpdateApplicationData {
  company?: string;
  position?: string;
  jobUrl?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  jobType?: string;
  appliedDate?: string;
  deadline?: string;
  description?: string;
}

export interface UpdateStatusData {
  status: string;
}

// ============================================================
// GET ALL APPLICATIONS
// GET /api/applications
// ============================================================

export function useApplications() {
  return useQuery<Application[]>({
    queryKey: ['applications'],

    queryFn: async () => {
      const response =
        await api.get('/applications');

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return response.data?.data ?? [];
    },
  });
}

// ============================================================
// GET SINGLE APPLICATION
// GET /api/applications/:id
// ============================================================

export function useApplication(
  id: string,
) {
  return useQuery<Application>({
    queryKey: ['applications', id],

    queryFn: async () => {
      const response =
        await api.get(
          `/applications/${id}`,
        );

      return response.data;
    },

    enabled: Boolean(id),
  });
}

// ============================================================
// CREATE APPLICATION
// POST /api/applications
// ============================================================

export function useCreateApplication() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateApplicationData,
    ) => {
      const response =
        await api.post(
          '/applications',
          data,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

// ============================================================
// UPDATE APPLICATION
// PATCH /api/applications/:id
// ============================================================

export function useUpdateApplication() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateApplicationData;
    }) => {
      const response =
        await api.patch(
          `/applications/${id}`,
          data,
        );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'applications',
          variables.id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

// ============================================================
// UPDATE STATUS
// PATCH /api/applications/:id/status
// ============================================================

export function useUpdateApplicationStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const response =
        await api.patch(
          `/applications/${id}/status`,
          {
            status,
          },
        );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'applications',
          variables.id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

// ============================================================
// DELETE APPLICATION
// DELETE /api/applications/:id
// ============================================================

export function useDeleteApplication() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.delete(
          `/applications/${id}`,
        );

      return response.data;
    },

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });

      queryClient.removeQueries({
        queryKey: [
          'applications',
          id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}