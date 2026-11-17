import type { Env } from './http';

const COOKIE = 'session';
const SESSION_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes as ArrayBuffer)));
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function authConfigured(env: Env): boolean {
  return Boolean(env.ADMIN_PASSWORD_HASH && env.SESSION_SECRET && env.RESUME_KV);
}

/** Stored format: pbkdf2-sha256$<iterations>$<salt b64>$<hash b64> (see scripts/hash-password.mjs). */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterations, salt, expected] = stored.split('$');
  if (scheme !== 'pbkdf2-sha256' || !iterations || !salt || !expected) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(salt), iterations: Number(iterations) },
    key,
    256,
  );
  return safeEqual(toBase64(bits), expected);
}

export async function sessionCookie(env: Env): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const signature = await hmac(env.SESSION_SECRET!, String(expires));
  return `${COOKIE}=${expires}.${signature}; Path=/api; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearedCookie(): string {
  return `${COOKIE}=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  if (!env.SESSION_SECRET) return false;
  const cookies = request.headers.get('Cookie') ?? '';
  const match = cookies.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!match) return false;
  const [expires, signature] = match.slice(COOKIE.length + 1).split('.', 2);
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(signature, await hmac(env.SESSION_SECRET, expires));
}
