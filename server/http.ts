export interface Env {
  /** KV namespace holding the edited experience, contact messages and rate-limit counters. */
  RESUME_KV?: KVNamespace;
  /** Output of `npm run hash-password`. */
  ADMIN_PASSWORD_HASH?: string;
  /** Random string used to sign session cookies. */
  SESSION_SECRET?: string;
  /** Optional: alerts for new contact messages (see README). */
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

/** KV key prefix for contact-form messages. */
export const MESSAGE_PREFIX = 'msg:';

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export function clientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') ?? 'unknown';
}

export async function readJson(request: Request): Promise<unknown> {
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return undefined;
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
