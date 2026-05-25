import nodemailer from "nodemailer";

export function hasMailConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP-konfigurasjon mangler");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendVerificationEmail(email: string, code: string) {
  const from = process.env.SMTP_FROM;
  if (!from) {
    throw new Error("SMTP_FROM mangler");
  }

  const transport = createTransport();

  await transport.sendMail({
    from,
    to: email,
    subject: "MoodMarket verifiseringskode",
    text: `Din verifiseringskode er: ${code}. Koden er gyldig i 10 minutter.`,
    html: `<div style="font-family:Arial,sans-serif;padding:16px">
      <h2>MoodMarket</h2>
      <p>Din verifiseringskode er:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:3px">${code}</p>
      <p>Koden er gyldig i 10 minutter.</p>
    </div>`,
  });
}
