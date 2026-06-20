'use server'

import { fetchWithAuth } from '@/lib/fetchWithAuth'; // Adjust to your actual import
import { revalidatePath } from 'next/cache';


interface JobFilters {
  statusFilter?: string;
  search?: string;
  page?: number;
  truckerType?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Fetch KPIs
export async function getJobStatsAction() {
  try {
    const res = await fetchWithAuth('/api/v1/admin/jobs/stats');
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

// Fetch Pending Docs Strip
export async function getPendingDocsAction() {
  try {
    const res = await fetchWithAuth('/api/v1/admin/jobs/pending-docs');
   
    if (!res.ok) return { jobs: [] };
    return await res.json();
  } catch (error) {
    return { jobs: [] };
  }
}

// Fetch Paginated & Filtered Jobs
export async function getJobsAction(filters: JobFilters) {
  try {
    const params = new URLSearchParams();
    
    if (filters.statusFilter && filters.statusFilter !== 'All') {
      const formattedStatus = filters.statusFilter === 'At risk' ? 'AtRisk' : filters.statusFilter;
      params.append('statusFilter', formattedStatus);
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }

    // --- New Secondary Filters ---
    if (filters.truckerType && filters.truckerType !== 'All') {
      params.append('truckerType', filters.truckerType); // 'individual' or 'company'
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      // Start of the day
      fromDate.setUTCHours(0, 0, 0, 0); 
      params.append('dateFrom', fromDate.toISOString());
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // End of the day to capture all jobs on that date
      toDate.setUTCHours(23, 59, 59, 999); 
      params.append('dateTo', toDate.toISOString());
    }

    params.append('page', (filters.page || 1).toString());
    params.append('limit', '20');

    const res = await fetchWithAuth(`/api/v1/admin/jobs?${params.toString()}`);
    if (!res.ok) return { jobs: [], pagination: {} };
    return await res.json();
  } catch (error) {
    return { jobs: [], pagination: {} };
  }
}

// Fetch Single Job Detail for Modal
export async function getJobDetailAction(id: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/jobs/${id}`);
    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    return { success: false, data: null };
  }
}

// Submit Intervention
export async function interveneJobAction(id: string, type: string, notes: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/admin/jobs/${id}/intervene`, {
      method: 'POST',
      body: JSON.stringify({ type, notes })
    });
    
    if (!res.ok) return { success: false, message: 'Failed to apply intervention' };
    
    // Tell Next.js to refresh the job data on the screen
    revalidatePath('/dashboard/operations/job-monitoring');
    
    const data = await res.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: 'Server error during intervention' };
  }
}




