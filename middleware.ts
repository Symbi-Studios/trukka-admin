import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;
  
  // Define what counts as the "auth" pages so we don't get trapped in an infinite redirect loop
  const isAuthPage = pathname === '/auth/sign-in' || pathname === '/';

  // 1. THE MAGIC: Token expired, but we have a refresh token!
  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // Redirect to the exact same page they were trying to visit to reload with fresh cookies
        const response = NextResponse.redirect(request.url);

        const isProduction = process.env.NODE_ENV === 'production';

        response.cookies.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60, // 1 hour
        });

        response.cookies.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response; 
      }
    } catch (error) {
      console.error('Middleware refresh failed:', error);
      // Let it fall through to the login redirect below
    }
  }

  // 2. If the user DOES NOT have a token (or the refresh above failed), and is NOT on the login page...
  if (!accessToken && !isAuthPage) {
    const loginUrl = new URL('/auth/sign-in', request.url);
    const response = NextResponse.redirect(loginUrl);
    
    // Failsafe: Clear out a dead refresh token so it doesn't cause infinite loops
    response.cookies.delete('refreshToken');
    
    return response;
  }

  // 3. If the user DOES have an active token, but tries to visit the login page...
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Otherwise, let the request proceed normally
  return NextResponse.next();
}

// 5. The Matcher: This defines which routes trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for the ones starting with:
     * - api (so your /api/sign-in route doesn't get blocked)
     * - _next/static (static files like your compiled CSS/JS)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png (your logos and icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)',
  ],
};