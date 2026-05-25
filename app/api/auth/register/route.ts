import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_ACCOUNT_COOKIE_NAME,
  AUTH_COOKIE_NAME,
  createAccountToken,
  createSessionToken,
  getAccountDuration,
  getSessionDuration,
  isEmailAllowed,
  validateEmail,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  let payload: { email?: string; password?: string } = {};

  try {
    payload = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ message: "Ugyldig foresporsel" }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase() ?? "";
  const password = payload.password ?? "";

  if (!validateEmail(email)) {
    return NextResponse.json({ message: "Ugyldig epostadresse" }, { status: 400 });
  }

  if (!isEmailAllowed(email)) {
    return NextResponse.json({ message: "Denne eposten har ikke tilgang" }, { status: 403 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Passord ma vaere minst 8 tegn" }, { status: 400 });
  }

  const accountToken = await createAccountToken(email, password);
  const sessionToken = await createSessionToken(email);

  if (!accountToken || !sessionToken) {
    return NextResponse.json(
      { message: "Kunne ikke opprette konto. Sett AUTH_SECRET i miljo-variabler." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_ACCOUNT_COOKIE_NAME,
    value: accountToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getAccountDuration(),
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getSessionDuration(),
  });

  return response;
}
