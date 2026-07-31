'use server'

import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { revalidatePath } from 'next/cache';



export async function getSupportStatsAction() {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/stats`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    // Your API returns { message: "...", stats: { ... } }
    return { success: true, data: data.data.stats };
  } catch (error) {
    return { success: false, data: null };
  }
}

// --- INBOX & THREADS ---
export async function getThreadsAction(filters: { tab?: string, search?: string, page?: number, limit?: number }) {
  try {
    const params = new URLSearchParams();
    if (filters.tab && filters.tab !== 'All') params.append('tab', filters.tab.toLowerCase());
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const res = await fetchWithAuth(`/api/v1/admin/support/threads?${params.toString()}`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function getThreadMessagesAction(id: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/threads/${id}`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, data: null };
  }
}


export async function updateThreadAction(id: string, payload: { assignedTo?: string, status?: string }) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/threads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    const data = await res.json()  
    console.log(  'server supoort',data)
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function uploadThreadAttachmentsAction(id: string, formData: FormData) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/threads/${id}/attachments`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return { success: res.ok, data: data.data };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function replyToThreadAction(id: string, content: string, attachmentUrls: string[] = []) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/threads/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, attachmentUrls })
    });
    const data = res.json()
    console.log('server attach', data)
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function sendThreadPushAction(id: string, payload: { title: string, message: string }) {
  try {
    // Sending title and message anyway, backend can ignore it or you can update it later
    const res = await fetchWithAuth(`/api/v1/admin/support/threads/${id}/push`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

// --- TEMPLATES ---
export async function getTemplatesAction(category?: string) {
  try {
    const url = category ? `/api/v1/admin/support/templates?category=${category}` : '/api/v1/admin/support/templates';
    const res = await fetchWithAuth(url);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function createTemplateAction(payload: { title: string, body: string, category: string }) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/templates`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function updateTemplateAction(id: string, payload: { title: string, body: string, category: string }) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteTemplateAction(id: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/templates/${id}`, {
      method: 'DELETE'
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

// --- BROADCASTS ---
export async function getBroadcastsAction(page: number = 1, limit: number = 20) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/broadcasts?page=${page}&limit=${limit}`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function sendBroadcastAction(payload: any) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/support/broadcasts`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
} 






