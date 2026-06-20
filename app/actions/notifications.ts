'use server'

import { fetchWithAuth } from "@/lib/fetchWithAuth";


export async function getNotificationsAction(filters: { tab?: string, page?: number, limit?: number }) {
  try {
    const params = new URLSearchParams();
    
    // Map UI labels to API query strings
    let apiTab = 'all';
    if (filters.tab) {
      const t = filters.tab.toLowerCase();
      if (t === 'alert') apiTab = 'alerts';
      else if (t === 'payment') apiTab = 'payments';
      else apiTab = t;
    }
    
    params.append('tab', apiTab);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const res = await fetchWithAuth(`/api/v1/admin/notifications?${params.toString()}`);
    
    if (!res.ok) return { success: false, data: { notifications: [], pagination: {} } };
    
    const data = await res.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: { notifications: [], pagination: {} } };
  }
}

export async function markNotificationsReadAction(ids: string[]) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/notifications/mark-read`, {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/notifications/mark-all-read`, {
      method: 'POST'
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}