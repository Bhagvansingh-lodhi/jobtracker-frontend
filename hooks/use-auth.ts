'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';

export function useLogout() {
  const router = useRouter();

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response =
        await api.post('/auth/logout');

      return response.data;
    },

    onSuccess: () => {
      queryClient.clear();

      router.replace('/login');
    },
  });
}