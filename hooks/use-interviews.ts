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

export type InterviewType =
  | 'TECHNICAL'
  | 'HR'
  | 'MANAGERIAL'
  | 'BEHAVIORAL'
  | 'PHONE'
  | 'VIDEO'
  | 'ONSITE'
  | 'CODING'
  | 'SYSTEM_DESIGN'
  | 'OTHER';

export type InterviewResult =
  | 'PENDING'
  | 'PASSED'
  | 'FAILED'
  | 'CANCELLED';

  
export interface Interview {
  id: string;
  applicationId: string;
  company: string;
  position: string;
  round: string;
  type: InterviewType;
  scheduledAt: string;
  interviewer?: string | null;
  result: InterviewResult;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewData {
  applicationId: string;
  round: string;
  type: InterviewType;
  scheduledAt: string;
  interviewer?: string;
  result?: InterviewResult;
  notes?: string;
}

export interface UpdateInterviewData {
  round?: string;
  type?: InterviewType;
  scheduledAt?: string;
  interviewer?: string;
  result?: InterviewResult;
  notes?: string;
}

// ============================================================
// GET ALL
// ============================================================

export function useInterviews() {
  return useQuery<Interview[]>({
    queryKey: ['interviews'],

    queryFn: async () => {
      const response =
        await api.get('/interviews');

      return Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];
    },
  });
}

// ============================================================
// GET ONE
// ============================================================

export function useInterview(
  id?: string,
) {
  return useQuery<Interview>({
    queryKey: [
      'interviews',
      id,
    ],

    enabled: Boolean(id),

    queryFn: async () => {
      const response =
        await api.get(
          `/interviews/${id}`,
        );

      return response.data;
    },
  });
}

// ============================================================
// CREATE
// ============================================================

export function useCreateInterview() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateInterviewData,
    ) => {
      const response =
        await api.post(
          '/interviews',
          data,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['interviews'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

// ============================================================
// UPDATE
// ============================================================

export function useUpdateInterview() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateInterviewData;
    }) => {
      const response =
        await api.patch(
          `/interviews/${id}`,
          data,
        );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['interviews'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'interviews',
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
// DELETE
// ============================================================

export function useDeleteInterview() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const response =
        await api.delete(
          `/interviews/${id}`,
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['interviews'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}