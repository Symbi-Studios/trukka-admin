import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // Use the native Headers object for safer merging
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // ONLY set 'application/json' if the body is NOT FormData
  // and if a Content-Type hasn't already been manually set in options
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

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