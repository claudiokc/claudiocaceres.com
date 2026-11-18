import { validateContact, type StoredMessage } from '../../src/lib/contact';
import { clientIp, json, MESSAGE_PREFIX, readJson, type Env } from '../../server/http';
import { notifyNewMessage } from '../../server/notify';
import { contactMessages } from '../../server/ratelimit';

const KEEP_SECONDS = 180 * 24 * 60 * 60;

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  if (!env.RESUME_KV) return json({ error: 'The contact form is not set up yet.' }, 503);
  const kv = env.RESUME_KV;
  const ip = clientIp(request);

  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  // Honeypot: a field hidden from people. Bots that fill it get a fake success and nothing is stored.
  if (body && typeof body.website === 'string' && body.website.trim()) return json({ sent: true });

  const result = validateContact(body);
  if (!result.ok) return json({ error: result.error }, 400);

  if (await contactMessages.blocked(kv, ip)) {
    return json({ error: 'Too many messages right now. Please try again later or email me directly.' }, 429);
  }
  await contactMessages.record(kv, ip);

  const receivedAt = new Date().toISOString();
  // Inverted timestamp so KV's ascending key order lists the newest message first.
  const id = `${String(9_999_999_999_999 - Date.now()).padStart(13, '0')}-${crypto.randomUUID().slice(0, 8)}`;
  const stored: StoredMessage = { id, receivedAt, ...result.value };
  await kv.put(`${MESSAGE_PREFIX}${id}`, JSON.stringify(stored), { expirationTtl: KEEP_SECONDS });
  // Runs after the response is sent, so the visitor never waits on Telegram.
  waitUntil(notifyNewMessage(env, stored));

  return json({ sent: true });
};

/** Any other method (e.g. opening /api/contact in a browser). */
export const onRequest: PagesFunction<Env> = async () =>
  json({ error: 'Use POST to send a message.' }, 405, { Allow: 'POST' });
