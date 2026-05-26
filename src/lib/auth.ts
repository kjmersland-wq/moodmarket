export const AUTH_COOKIE_NAME = "moodmarket_session";

type SessionPayload = {
  email: string;
  exp: number;
};

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function bytesToBase64Url(bytes: Uint8Array) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(base64Url: string) {
  const normalized = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function toBase64Url(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function fromBase64Url(value: string) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function sha256(input: string) {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toHex(digest);
}

function getAuthSecret() {
  const explicit = process.env.AUTH_SECRET;
  if (explicit) return explicit;

  if (process.env.NODE_ENV !== "production") {
    return "moodmarket-dev-fallback-secret";
  }

  return null;
}

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  const admins = getAdminEmails();
  return admins.includes(email.trim().toLowerCase());
}

export async function createSessionToken(email: string) {
  const secret = getAuthSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30
  };

  const payloadBase64 = toBase64Url(JSON.stringify(payload));
  const signature = await sha256(`${payloadBase64}.${secret}`);
  return `${payloadBase64}.${signature}`;
}

export async function validateSessionToken(token?: string | null) {
  if (!token) return null;

  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) return null;

  const secret = getAuthSecret();
  if (!secret) return null;

  const expected = await sha256(`${payloadBase64}.${secret}`);
  if (expected !== signature) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(payloadBase64)) as SessionPayload;
    if (!parsed?.email || parsed.exp <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionDurationSeconds() {
  return 60 * 60 * 24 * 30;
}