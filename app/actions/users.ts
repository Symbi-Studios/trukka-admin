'use server'

import { fetchWithAuth } from '@/lib/fetchWithAuth'; // Adjust to your actual import
import { revalidatePath } from 'next/cache';

// --- Lists ---
export async function getUsersAction(role: 'forwarders' | 'truckers' | 'drivers', filters: { status?: string, search?: string, page?: number }) {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    params.append('page', (filters.page || 1).toString());

    const res = await fetchWithAuth(`/api/v1/admin/users/${role}?${params.toString()}`);
    if (!res.ok) return { success: false, data: { users: [], pagination: {} } };
    const data = await res.json();
    // console.log('data', data.data)
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: { users: [], pagination: {} } };
  }
}

export async function getUserStats(){
  try {
    const res = await fetchWithAuth('/api/v1/admin/users/stats');
    if(!res.ok) return {success: false};
    const data = await res.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('failded to fetch user stats', error);
    return { success: false, data: null};
  }
}

// --- Profiles ---
export async function getUserProfileAction(userId: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/profile`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json()
    return { success: data.success, data: data.data  };
  } catch (error) {
    return { success: false, data: null };
  }
}

// --- Approvals & Suspensions ---
export async function approveUserAction(userId: string) {
  const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/approve`, { method: 'POST' });
  revalidatePath('/dashboard/management/users');
  return { success: res.ok };
}

export async function rejectUserAction(userId: string) {
  const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/reject`, { method: 'POST' });
  revalidatePath('/dashboard/management/users');
  return { success: res.ok };
}

export async function suspendUserAction(userId: string) {
  const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/suspend`, { method: 'POST' });
  revalidatePath('/dashboard/management/users');
  return { success: res.ok };
}

export async function reactivateUserAction(userId: string) {
  const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/reactivate`, { method: 'POST' });
  revalidatePath('/dashboard/management/users');
  return { success: res.ok };
}

// --- Modals (KYB & License) ---
export async function getCompanyInfoAction(userId: string) {
  const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/company-info`);
  if (!res.ok) return { success: false, data: null };
  const data = await res.json();
  return { success: data.success, data: data.data  };
}

export async function getLicenseInfoAction(userId: string) {
  const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/license`);
  if (!res.ok) return { success: false, data: null };
  const data = await res.json();
  return { success: data.success, data: data.data  };
}

export async function reviewKybAction(userId: string, decision: 'approve' | 'reject', reason?: string) {
  const body = decision === 'reject' ? JSON.stringify({ reason }) : undefined;
  const res = await fetchWithAuth(`/api/v1/admin/kyb/${userId}/${decision}`, { method: 'POST', body });
  return { success: res.ok };
}

export async function reviewLicenseAction(userId: string, decision: 'approve' | 'reject', reason?: string) {
  const body = decision === 'reject' ? JSON.stringify({ reason }) : undefined;
  const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/${decision}-license`, { method: 'POST', body });
  return { success: res.ok };
}



// --- Sub-Resources (Jobs, Transactions, Destinations) ---

export async function getUserSavedDestinationsAction(userId: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/saved-destinations`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function getUserJobsAction(userId: string, filters: { tab?: string, page?: number, limit?: number }) {
  try {
    const params = new URLSearchParams();
    if (filters.tab && filters.tab !== 'All') params.append('tab', filters.tab.toLowerCase());
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/jobs?${params.toString()}`);
    if (!res.ok) return { success: false, data: { jobs: [], pagination: {} } };
    const data = await res.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: { jobs: [], pagination: {} } };
  }
}

export async function getUserTransactionsAction(userId: string, filters: { page?: number, limit?: number }) {
  try {
    const params = new URLSearchParams();
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const res = await fetchWithAuth(`/api/v1/admin/users/${userId}/transactions?${params.toString()}`);
    if (!res.ok) return { success: false, data: { transactions: [], pagination: {} } };
    const data = await res.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: { transactions: [], pagination: {} } };
  }
}