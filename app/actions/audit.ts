'use server'

import { fetchWithAuth } from '@/lib/fetchWithAuth';

export async function getAuditLogsAction(params: { roleGroup?: string, search?: string, page?: number, limit?: number }) {
  try {
    const query = new URLSearchParams();
    
    // Map the UI filter names to the API's expected 'roleGroup' values
    if (params.roleGroup && params.roleGroup !== 'All') {
      const roleMap: Record<string, string> = { 
        'Super Admin': 'super', 
        'Operations': 'operations', 
        'Finance': 'finance' 
      };
      query.append('roleGroup', roleMap[params.roleGroup]);
    }
    
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    query.append('limit', (params.limit || 20).toString());

    const res = await fetchWithAuth(`/api/v1/admin/audit-logs?${query.toString()}`);
    if (!res.ok) return { success: false, data: null };
    
    const data = await res.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, data: null };
  }
}