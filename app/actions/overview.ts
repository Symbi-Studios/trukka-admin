'use server'

import { fetchWithAuth } from "@/lib/fetchWithAuth";


export async function getOverviewAction() {
  try {
    const response = await fetchWithAuth('/api/v1/admin/overview');
    
    // Check if the response is okay before parsing
    if (!response.ok) {
      throw new Error('Failed to fetch overview data');
    }
    
    const data = await response.json();
    return { success: data.success, data: data.data };
  } catch (error) {
    console.error("Failed to fetch overview:", error);
    return { success: false, data: null };
  }
}