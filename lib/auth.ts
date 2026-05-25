export const AUTH_COOKIE_NAME = "moodmarket_session";
export const AUTH_PENDING_COOKIE_NAME = "moodmarket_pending";
export const AUTH_ACCOUNT_COOKIE_NAME = "moodmarket_account";

type SessionPayload = {
  email: string;
  exp: number;
};

type PendingPayload = {
  email: string;
  codeHash: string;
  exp: number;
};

type AccountPayload = {
  email: string;
  passwordHash: string;
  exp: number;
};

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(base64Url: string) {
  const normalized = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function sha256(input: string) {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toHex(digest);
}

function toBase64Url(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function fromBase64Url(value: string) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

function getAuthSecret() {
  const explicit = process.env.AUTH_SECRET;
  if (explicit) return explicit;

  const vercelId =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelId) {
    return `moodmarket-${vercelId}`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "moodmarket-dev-fallback-secret";
  }

  return null;
}

async function signData(payloadBase64: string, secret: string) {
  return sha256(`${payloadBase64}.${secret}`);
}

async function createSignedToken(payload: object) {
  const secret = getAuthSecret();
  if (!secret) return null;

  const payloadBase64 = toBase64Url(JSON.stringify(payload));
  const signature = await signData(payloadBase64, secret);

  return `${payloadBase64}.${signature}`;
}

async function parseSignedToken<T>(token?: string | null): Promise<T | null> {
  if (!token) return null;

  const secret = getAuthSecret();
  if (!secret) return null;

  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) return null;

  const expectedSignature = await signData(payloadBase64, secret);
  if (expectedSignature !== signature) return null;

  try {
    return JSON.parse(fromBase64Url(payloadBase64)) as T;
  } catch {
    return null;
  }
}

export function createVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return String(code);
}

export async function createPendingToken(email: string, code: string) {
  const payload: PendingPayload = {
    email,
    codeHash: await sha256(code),
    exp: Date.now() + 1000 * 60 * 10,
  };

  return createSignedToken(payload);
}

export async function verifyPendingToken(token: string | undefined, email: string, code: string) {
  const payload = await parseSignedToken<PendingPayload>(token);
  if (!payload) return false;

  const codeHash = await sha256(code);
  return payload.exp > Date.now() && payload.email === email && payload.codeHash === codeHash;
}

export async function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  };

  return createSignedToken(payload);
}

export async function validateSessionToken(token?: string | null) {
  const payload = await parseSignedToken<SessionPayload>(token);
  if (!payload) return false;

  if (payload.exp <= Date.now()) return false;

  return true;
}

export async function hashPassword(password: string) {
  return sha256(password);
}

export async function createAccountToken(email: string, password: string) {
  const payload: AccountPayload = {
    email,
    passwordHash: await hashPassword(password),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 365,
  };

  return createSignedToken(payload);
}

export async function verifyAccountCredentials(
  accountToken: string | null | undefined,
  email: string,
  password: string
) {
  const payload = await parseSignedToken<AccountPayload>(accountToken);
  if (!payload) return false;

  const passwordHash = await hashPassword(password);
  return payload.exp > Date.now() && payload.email === email && payload.passwordHash === passwordHash;
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isEmailAllowed(email: string) {
  const allowed = process.env.ALLOWED_EMAIL?.trim().toLowerCase();
  if (!allowed) return true;

  return email.trim().toLowerCase() === allowed;
}

export function hasAuthSecret() {
  return Boolean(getAuthSecret());
}

export function getSessionDuration() {
  return 60 * 60 * 24 * 30;
}

export function getPendingDuration() {
  return 60 * 10;
}

export function getAccountDuration() {
  return 60 * 60 * 24 * 365;
}
