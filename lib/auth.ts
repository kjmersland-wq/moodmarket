export const AUTH_COOKIE_NAME = "moodmarket_session";

export type AuthConfig = {
  email: string;
  password: string;
  secret: string;
};

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(input: string) {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toHex(digest);
}

export function getAuthConfig(): AuthConfig | null {
  const email = process.env.AUTH_EMAIL;
  const password = process.env.AUTH_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!email || !password || !secret) {
    return null;
  }

  return { email, password, secret };
}

export async function createSessionToken(config: AuthConfig) {
  return sha256(`${config.email}:${config.password}:${config.secret}`);
}

export async function validateSessionToken(token?: string | null) {
  if (!token) return false;

  const config = getAuthConfig();
  if (!config) return false;

  const expected = await createSessionToken(config);
  return token === expected;
}

export function validateCredentials(email: string, password: string) {
  const config = getAuthConfig();
  if (!config) return false;

  return email === config.email && password === config.password;
}
