// ═══════════════════════════════════════════════════════════
// ClearPath AI — User Hooks (React Query)
// ═══════════════════════════════════════════════════════════

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserProfile, UserSettings, UserStats } from '@/types';

async function unwrap<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error('Request failed');
  const json = await res.json();
  return json.data as T;
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch('/api/user/profile');
      return unwrap<UserProfile>(response);
    },
  });
}

export function useUserSettings() {
  return useQuery({
    queryKey: ['user', 'settings'],
    queryFn: async (): Promise<UserSettings> => {
      const response = await fetch('/api/user/settings');
      return unwrap<UserSettings>(response);
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: async (): Promise<UserStats> => {
      const response = await fetch('/api/user/stats');
      return unwrap<UserStats>(response);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return unwrap<UserProfile>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserSettings>): Promise<UserSettings> => {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return unwrap<UserSettings>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'settings'] });
    },
  });
}

export function useSearchHistory(page: number = 1) {
  return useQuery({
    queryKey: ['user', 'history', page],
    queryFn: async () => {
      const response = await fetch(`/api/user/history?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/user/history', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to clear history');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
    },
  });
}
