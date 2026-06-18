import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If we get a 401 here, the Middleware refresh failed entirely.
  // It's time to force them back to the login screen.
  if (response.status === 401) {
    redirect('/auth/sign-in'); 
  }

  return response;
}