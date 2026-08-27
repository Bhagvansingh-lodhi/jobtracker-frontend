'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

// ============================================================
// TYPES
// ============================================================

export interface DashboardOverview {
  applications: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface MonthlyApplication {
  month: string;
  count: number;
}

export interface UpcomingInterview {
  id: string;
  applicationId: string;
  company: string;
  position: string;
  round: string;
  type: string;
  scheduledAt: string;
  result: string | null;
}

export interface UpcomingReminder {
  id: string;
  applicationId: string;
  company: string;
  position: string;
  message: string;
  remindAt: string;
}

// ============================================================
// DASHBOARD OVERVIEW
// GET /api/dashboard/overview
// ============================================================

export function useDashboardOverview() {
  return useQuery<DashboardOverview>({
    queryKey: ['dashboard', 'overview'],

    queryFn: async () => {
      const response =
        await api.get(
          '/dashboard/overview',
        );

      return response.data;
    },
  });
}

// ============================================================
// STATUS BREAKDOWN
// GET /api/dashboard/status
// ============================================================

export function useStatusBreakdown() {
  return useQuery<StatusBreakdown[]>({
    queryKey: ['dashboard', 'status'],

    queryFn: async () => {
      const response =
        await api.get(
          '/dashboard/status',
        );

      return response.data;
    },
  });
}

// ============================================================
// MONTHLY APPLICATIONS
// GET /api/dashboard/monthly
// ============================================================

export function useMonthlyApplications() {
  return useQuery<MonthlyApplication[]>({
    queryKey: ['dashboard', 'monthly'],

    queryFn: async () => {
      const response =
        await api.get(
          '/dashboard/monthly',
        );

      return response.data;
    },
  });
}

// ============================================================
// UPCOMING INTERVIEWS
// GET /api/dashboard/upcoming-interviews
// ============================================================

export function useUpcomingInterviews() {
  return useQuery<UpcomingInterview[]>({
    queryKey: [
      'dashboard',
      'upcoming-interviews',
    ],

    queryFn: async () => {
      const response =
        await api.get(
          '/dashboard/upcoming-interviews',
        );

      return response.data;
    },
  });
}

// ============================================================
// UPCOMING REMINDERS
// GET /api/dashboard/upcoming-reminders
// ============================================================

export function useUpcomingReminders() {
  return useQuery<UpcomingReminder[]>({
    queryKey: [
      'dashboard',
      'upcoming-reminders',
    ],

    queryFn: async () => {
      const response =
        await api.get(
          '/dashboard/upcoming-reminders',
        );

      return response.data;
    },
  });
}