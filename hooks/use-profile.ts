'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';

export interface Profile {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ['profile'],

    queryFn: async () => {
      const response =
        await api.get('/profile');

      return response.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateProfileData,
    ) => {
      const response =
        await api.patch(
          '/profile',
          data,
        );

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(
        ['profile'],
        data,
      );

      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}

export function useDeleteAccount() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response =
        await api.delete('/profile');

      return response.data;
    },

    onSuccess: () => {
      queryClient.clear();
    },
  });
}