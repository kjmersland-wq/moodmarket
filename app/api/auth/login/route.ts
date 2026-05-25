import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createSessionToken, getAuthConfig, validateCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const config = getAuthConfig();
  if (!config) {
    return NextResponse.json(
      { message: "Auth-miljovariabler mangler. Sett AUTH_EMAIL, AUTH_PASSWORD og AUTH_SECRET." },
      { status: 500 }
    );
  }

  let payload: { email?: string; password?: string } = {};

  try {
    payload = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ message: "Ugyldig foresporsel" }, { status: 400 });
  }

  const email = payload.email?.trim() ?? "";
  const password = payload.password ?? "";

  if (!validateCredentials(email, password)) {
    return NextResponse.json({ message: "Feil epost eller passord" }, { status: 401 });
  }

  const token = await createSessionToken(config);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
