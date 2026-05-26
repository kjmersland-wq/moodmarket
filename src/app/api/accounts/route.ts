import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireApiAccess } from "@/lib/access";
import { listAccounts, setAccountStatus, upsertAccount } from "@/lib/account-repository";

const createSchema = z.object({
  email: z.string().email(),
  navn: z.string().max(80).optional()
});

const patchSchema = z.object({
  id: z.number().int().positive(),
  aktiv: z.boolean()
});

export async function GET(request: NextRequest) {
  const access = await requireApiAccess(request, { requireAdmin: true });
  if (!access.ok) {
    return access.response;
  }

  try {
    const data = await listAccounts();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kunne ikke hente kontoer" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess(request, { requireAdmin: true });
  if (!access.ok) {
    return access.response;
  }

  try {
    const payload = createSchema.parse(await request.json());
    const account = await upsertAccount(payload);
    return NextResponse.json({ data: account });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Ugyldig input" }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kunne ikke lagre konto" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const access = await requireApiAccess(request, { requireAdmin: true });
  if (!access.ok) {
    return access.response;
  }

  try {
    const payload = patchSchema.parse(await request.json());
    const account = await setAccountStatus(payload.id, payload.aktiv);

    if (!account) {
      return NextResponse.json({ error: "Konto ikke funnet" }, { status: 404 });
    }

    return NextResponse.json({ data: account });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Ugyldig input" }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kunne ikke oppdatere konto" },
      { status: 500 }
    );
  }
}