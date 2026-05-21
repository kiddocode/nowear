import { NextResponse } from 'next/server'

export function middleware(req) {
  const token = req.cookies.get('sb-qhuatexjyxbunotvghjh-auth-token')
  const isAuth = !!token

  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/evento')

  if (isDashboard && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/evento/:path*', '/login', '/register']
}