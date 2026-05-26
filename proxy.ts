import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, validateSessionToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isApiPath(pathname: string) {
  return pathname.startsWith("/api/");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authenticated = await validateSessionToken(token);
  const publicPath = isPublicPath(pathname);

  if (!authenticated && !publicPath) {
    if (isApiPath(pathname)) {
      return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authenticated && publicPath && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};