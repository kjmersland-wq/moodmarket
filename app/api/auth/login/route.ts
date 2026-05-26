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
  verifyAccountCredentials,
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

  const accountToken = request.cookies.get(AUTH_ACCOUNT_COOKIE_NAME)?.value;
  let activeAccountToken: string | null | undefined = accountToken;

  if (!activeAccountToken) {
    activeAccountToken = await createAccountToken(email, password);
    if (!activeAccountToken) {
      return NextResponse.json(
        { message: "Kunne ikke opprette konto. Sett AUTH_SECRET i miljo-variabler." },
        { status: 500 }
      );
    }
  } else {
    const valid = await verifyAccountCredentials(activeAccountToken, email, password);

    if (!valid) {
      return NextResponse.json({ message: "Feil epost eller passord" }, { status: 401 });
    }
  }

  const sessionToken = await createSessionToken(email);

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Kunne ikke opprette sesjon. Sett AUTH_SECRET i miljo-variabler." },
      { status: 500 }
    );
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
    name: AUTH_ACCOUNT_COOKIE_NAME,
    value: activeAccountToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getAccountDuration(),
  });

  return response;
}
