import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { findAccountByEmail } from "@/lib/account-repository";
import { AUTH_COOKIE_NAME, isAdminEmail, validateSessionToken } from "@/lib/auth";

type AccessOptions = {
  requireAdmin?: boolean;
};

async function resolveSessionUser(email: string) {
  const normalized = email.trim().toLowerCase();
  const admin = isAdminEmail(normalized);
  let account = null;

  try {
    account = await findAccountByEmail(normalized);
  } catch (error) {
    if (!admin) {
      throw error;
    }
  }

  if (account && !account.aktiv) {
    return null;
  }

  if (!account && !admin) {
    return null;
  }

  return {
    email: normalized,
    admin
  };
}

export async function requirePageAccess(options: AccessOptions = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const payload = await validateSessionToken(token);

  if (!payload) {
    redirect("/login");
  }

  const user = await resolveSessionUser(payload.email);
  if (!user) {
    redirect("/login");
  }

  if (options.requireAdmin && !user.admin) {
    redirect("/");
  }

  return user;
}

export async function requireApiAccess(request: NextRequest, options: AccessOptions = {}) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = await validateSessionToken(token);

  if (!payload) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Ikke autentisert" }, { status: 401 })
    };
  }

  const user = await resolveSessionUser(payload.email);
  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Konto ikke aktiv" }, { status: 403 })
    };
  }

  if (options.requireAdmin && !user.admin) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Kun admin" }, { status: 403 })
    };
  }

  return {
    ok: true as const,
    user
  };
}