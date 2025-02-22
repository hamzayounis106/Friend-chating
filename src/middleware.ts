import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Retrieve the token from the request, which now includes the role.
    const token = await getToken({ req });
    console.log('Checking token:', token);
    const isLoginPage = pathname.startsWith('/login');

    // Define sensitive routes that require an approved role.
    const sensitiveRoutes = ['/dashboard'];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If the user is trying to access the login page and is already authenticated, redirect to dashboard.
    if (isLoginPage) {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // If there is no token and the user is accessing a sensitive route, redirect to login.
    if (!token && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If the user role is "pending" and they access a protected route, send them to update role page.
    if (token && token.role === 'pending' && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/update-role', req.url));
    }

    // Redirect the root URL to dashboard.
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
