'use server'

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { revalidatePath } from 'next/cache';

export async function getFeedbacksAction(filters: { tab?: string, star?: string, userType?: string, search?: string, page?: number }) {
  try {
    const params = new URLSearchParams();
    
    // Map 'Feedback' to 'feedback' and 'Archive' to 'archive'
    if (filters.tab) params.append('tab', filters.tab.toLowerCase());
    
    // Convert '5-star' to '5'
    if (filters.star && filters.star !== 'All') {
      params.append('star', filters.star.replace('-star', ''));
    }
    
    // Map 'Forwarder' to 'FORWARDER'
    if (filters.userType) params.append('userType', filters.userType.toUpperCase());
    
    if (filters.search) params.append('search', filters.search);
    params.append('page', (filters.page || 1).toString());

    const res = await fetchWithAuth(`/api/v1/admin/feedback?${params.toString()}`);
    if (!res.ok) return { success: false, data: null };
    
    const data = await res.json();
    return { success: true, data: data.data || data }; 
  } catch (error) {
    console.error('Failed to fetch FeedBacks', error);
    return { success: false, data: null };
  }
}

export async function toggleArchiveFeedbackAction(id: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/feedback/${id}/archive`, { method: 'POST' });
    revalidatePath('/dashboard/feedback');
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteFeedbackAction(id: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/feedback/${id}`, { method: 'DELETE' });
    revalidatePath('/dashboard/feedback');
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}