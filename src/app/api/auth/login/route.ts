import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { findAccountAuthByEmail, setAccountPasswordHash, upsertAccount } from "@/lib/account-repository";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionDurationSeconds, isAdminEmail } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomSaltHex(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(input: string) {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toHex(digest);
}

async function createPasswordHash(password: string) {
  const salt = randomSaltHex();
  const hash = await sha256(`${salt}:${password}`);
  return `sha256:${salt}:${hash}`;
}

async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, expectedHash] = stored.split(":");
  if (algorithm !== "sha256" || !salt || !expectedHash) return false;
  const calculated = await sha256(`${salt}:${password}`);
  return calculated === expectedHash;
}

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    const email = payload.email.trim().toLowerCase();
    const password = payload.password;
    const admin = isAdminEmail(email);

    let account = await findAccountAuthByEmail(email);

    if (account && !account.aktiv) {
      return NextResponse.json({ error: "Konto er deaktivert" }, { status: 403 });
    }

    if (!account && !admin) {
      return NextResponse.json({ error: "Konto finnes ikke" }, { status: 403 });
    }

    if (admin && !account) {
      await upsertAccount({ email, navn: "Admin" });
      account = await findAccountAuthByEmail(email);
    }

    if (!account) {
      return NextResponse.json({ error: "Konto finnes ikke" }, { status: 403 });
    }

    if (account.passord_hash) {
      const isValid = await verifyPassword(password, account.passord_hash);
      if (!isValid) {
        return NextResponse.json({ error: "Feil epost eller passord" }, { status: 401 });
      }
    } else {
      const hash = await createPasswordHash(password);
      await setAccountPasswordHash(email, hash);
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Ugyldig epostadresse" }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kunne ikke logge inn" },
      { status: 500 }
    );
  }
}