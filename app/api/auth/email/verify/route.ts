import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_PENDING_COOKIE_NAME,
  createSessionToken,
  getSessionDuration,
  isEmailAllowed,
  verifyPendingToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  let payload: { email?: string; code?: string } = {};

  try {
    payload = (await request.json()) as { email?: string; code?: string };
  } catch {
    return NextResponse.json({ message: "Ugyldig foresporsel" }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase() ?? "";
  const code = payload.code?.trim() ?? "";

  if (!email || !code) {
    return NextResponse.json({ message: "Epost og kode er pakrevd" }, { status: 400 });
  }

  if (!isEmailAllowed(email)) {
    return NextResponse.json({ message: "Denne eposten har ikke tilgang" }, { status: 403 });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const pendingToken = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_PENDING_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const valid = await verifyPendingToken(pendingToken, email, code);

  if (!valid) {
    return NextResponse.json({ message: "Feil kode eller utgatt kode" }, { status: 401 });
  }

  const sessionToken = await createSessionToken(email);

  if (!sessionToken) {
    return NextResponse.json({ message: "Kunne ikke opprette sesjon" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getSessionDuration(),
  });

  response.cookies.set({
    name: AUTH_PENDING_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
}
