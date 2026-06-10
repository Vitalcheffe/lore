// ═══════════════════════════════════════════════════════════
// ClearPath AI — Resources Hook (React Query)
// ═══════════════════════════════════════════════════════════

'use client';

import { useQuery } from '@tanstack/react-query';
import type { Resource, PaginatedResponse } from '@/types';

interface ResourceFilters {
  category?: string;
  search?: string;
  verification?: string;
  sourceQuality?: string;
  page?: number;
  pageSize?: number;
}

export function useResources(filters: ResourceFilters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  if (filters.verification) params.set('verification', filters.verification);
  if (filters.sourceQuality) params.set('sourceQuality', filters.sourceQuality);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));

  const queryString = params.toString();
  const url = `/api/resources${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['resources', filters],
    queryFn: async (): Promise<PaginatedResponse<Resource>> => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async (): Promise<Resource> => {
      const response = await fetch(`/api/resources/${id}`);
      if (!response.ok) throw new Error('Failed to fetch resource');
      return response.json();
    },
    enabled: !!id,
  });
}
