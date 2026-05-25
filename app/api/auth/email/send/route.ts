import { NextResponse } from "next/server";
import {
  AUTH_PENDING_COOKIE_NAME,
  createPendingToken,
  createVerificationCode,
  getPendingDuration,
  hasAuthSecret,
  validateEmail,
} from "@/lib/auth";
import { hasMailConfig, sendVerificationEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  if (!hasAuthSecret()) {
    return NextResponse.json(
      { message: "AUTH_SECRET mangler i miljo-variabler." },
      { status: 500 }
    );
  }

  if (!hasMailConfig()) {
    return NextResponse.json(
      {
        message:
          "SMTP-oppsett mangler. Sett SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS og SMTP_FROM i miljo-variabler.",
      },
      { status: 500 }
    );
  }

  let payload: { email?: string } = {};

  try {
    payload = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ message: "Ugyldig foresporsel" }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase() ?? "";

  if (!validateEmail(email)) {
    return NextResponse.json({ message: "Ugyldig epostadresse" }, { status: 400 });
  }

  const code = createVerificationCode();
  const pendingToken = await createPendingToken(email, code);

  if (!pendingToken) {
    return NextResponse.json({ message: "Kunne ikke opprette verifisering" }, { status: 500 });
  }

  try {
    await sendVerificationEmail(email, code);
  } catch {
    return NextResponse.json(
      { message: "Kunne ikke sende epost. Sjekk SMTP-innstillinger." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_PENDING_COOKIE_NAME,
    value: pendingToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getPendingDuration(),
  });

  return response;
}
