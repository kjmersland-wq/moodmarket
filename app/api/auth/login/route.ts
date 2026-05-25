import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (body) {
    return NextResponse.json(
      {
        message:
          "Innlogging er erstattet. Bruk /api/auth/email/send og /api/auth/email/verify.",
      },
      { status: 410 }
    );
  }

  return NextResponse.json({ message: "Bruk epostverifisering" }, { status: 410 });
}
