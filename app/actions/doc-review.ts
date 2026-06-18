'use server'

import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { revalidatePath } from 'next/cache';

// --- Shared Stats ---
export async function getDocReviewStatsAction() {
  try {
    const res = await fetchWithAuth('/api/v1/admin/doc-review/stats');
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

// --- Document Queue Actions ---
export async function getDocQueueAction(filters: { status?: string, search?: string, page?: number }) {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', '20');

    const res = await fetchWithAuth(`/api/v1/admin/doc-review/queue?${params.toString()}`);
    if (!res.ok) return { jobs: [], pagination: {} };
    return await res.json();
  } catch (error) {
    return { jobs: [], pagination: {} };
  }
}

export async function getDocQueueDetailAction(jobId: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/doc-review/queue/${jobId}`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function approveDocAction(jobId: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/doc-review/queue/${jobId}/approve`, { method: 'POST' });
    if (!res.ok) return { success: false, message: 'Failed to approve document' };
    revalidatePath('/dashboard/operations/doc-review');
    const data = await res.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: 'Server error' };
  }
}

export async function rejectDocAction(jobId: string, reason: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/doc-review/queue/${jobId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    if (!res.ok) return { success: false, message: 'Failed to reject document' };
    revalidatePath('/dashboard/operations/doc-review');
    const data = await res.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: 'Server error' };
  }
}

// --- Truck Registration Actions ---
export async function getTruckRegAction(filters: { status?: string, type?: string, search?: string, page?: number }) {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', '20');

    const res = await fetchWithAuth(`/api/v1/admin/doc-review/trucks?${params.toString()}`);
    if (!res.ok) return { trucks: [], pagination: {} };
    return await res.json();
  } catch (error) {
    return { trucks: [], pagination: {} };
  }
}

export async function getTruckRegDetailAction(truckId: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/doc-review/trucks/${truckId}`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: null };
  }
}