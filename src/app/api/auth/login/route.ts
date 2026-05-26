import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { findAccountByEmail, upsertAccount } from "@/lib/account-repository";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionDurationSeconds, isAdminEmail } from "@/lib/auth";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    const email = payload.email.trim().toLowerCase();

    const account = await findAccountByEmail(email);
    const admin = isAdminEmail(email);

    if (account && !account.aktiv) {
      return NextResponse.json({ error: "Konto er deaktivert" }, { status: 403 });
    }

    if (!account && !admin) {
      return NextResponse.json({ error: "Konto finnes ikke" }, { status: 403 });
    }

    if (admin && !account) {
      await upsertAccount({ email, navn: "Admin" });
    }

    const token = await createSessionToken(email);
    if (!token) {
      return NextResponse.json({ error: "AUTH_SECRET mangler" }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true, admin });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getSessionDurationSeconds()
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Ugyldig innlogging" }, { status: 400 });
  }
}