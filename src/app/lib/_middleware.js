import { NextResponse } from "next/server";
import { logSession } from "./actions/session";

export default async function middleware(req) {
  const session = await logSession();

  const { pathname } = req.nextUrl;

  const protectedRoutes = ['/home'];

  if (!session && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect('/');
  }

  if (session && (pathname === '/pages/login' || pathname === '/pages/signup')) {
    return NextResponse.redirect('/pages/home');
  }

  return NextResponse.next();
}