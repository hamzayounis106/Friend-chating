import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Retrieve the token from the request
    const token = await getToken({ req });
    console.log('Checking token:');

    // Define public routes
    const publicRoutes = ['/', '/about', '/login', '/signup'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Define sensitive routes
    const sensitiveRoutes = ['/dashboard', '/success'];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (token && token.role === 'pending' && isAccessingSensitiveRoute) {
      console.log('condetion match in the middleware 😎😎😎😎');
      return NextResponse.redirect(new URL('/update-role', req.url));
    }
    const patientOnlyRoutes = ['/dashboard/myPosts', '/dashboard/add'];
    const isAccessingPatientOnlyRoute = patientOnlyRoutes.includes(pathname);

    const surgeonOnlyRoutes = ['/dashboard/requests'];
    const isAccessingSurgeonOnlyRoute = surgeonOnlyRoutes.includes(pathname);

    if (
      (pathname.startsWith('/login') || pathname.startsWith('/signup')) &&
      token
    ) {
      if (token.role === 'patient') {
        return NextResponse.redirect(new URL('/dashboard/add', req.url));
      } else if (token.role === 'surgeon') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    // If the user is not logged in and tries to access a sensitive route, redirect to login
    if (!token && isAccessingSensitiveRoute) {
      console.log('get token on time in the middle ware 🤣🤣🤣🤣');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If the user's role is "pending" and they access a sensitive route, redirect to update-role

    // If the user's email is not verified and they access a sensitive route, redirect to login
    if (token && !token.isVerified && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (token && isAccessingPatientOnlyRoute && token.role !== 'patient') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (token && isAccessingSurgeonOnlyRoute && token.role !== 'surgeon') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
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
  matcher: ['/', '/login', '/dashboard/:path*', '/about', '/signup'], // Add more routes as needed
};
