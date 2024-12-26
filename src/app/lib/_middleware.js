import { NextResponse } from "next/server";
import { logSession } from "./actions/session";

export default async function middleware(req) {
  const session = await logSession();
  const { pathname } = req.nextUrl;

  const protectedRoutes = ['/pages/settings', '/pages/profile'];

  if (!session && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect('/pages/login');
  }

  if (session && ['/pages/login', '/pages/signup', '/'].includes(pathname)) {
    return NextResponse.redirect('/pages/home');
  }

  if (pathname === '/pages/home') {
    return NextResponse.next();
  }

  return NextResponse.next();
}
