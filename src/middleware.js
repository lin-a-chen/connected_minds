import { NextResponse } from 'next/server';
import { decrypt } from './lib/session';
import { cookies } from 'next/headers';
 
const protectedRoutes = ['/cabinet', '/admin', '/chat', '/user']
const publicRoutes = ['/sign-in', '/sign-up', '/', '/about', '/contacts']
 
export default async function middleware(req) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const headers = new Headers(req.headers);
  headers.set("x-current-path", path);

  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)
 
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
  }
 
  // if (
  //   isPublicRoute &&
  //   session?.userId 
  //   // &&
  //   // !req.nextUrl.pathname.startsWith('/profile')
  // ) {
  //   return NextResponse.redirect(new URL('/profile', req.nextUrl))
  // }
 
  return NextResponse.next({
    request: {
        headers: headers,
    }
});
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}