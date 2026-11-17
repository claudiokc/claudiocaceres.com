import type { StoredMessage } from '../../src/lib/contact';
import { isAuthenticated } from '../../server/auth';
import { json, MESSAGE_PREFIX, type Env } from '../../server/http';

/** Newest 100 contact messages (signed in only). */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESUME_KV) return json({ error: 'Storage is not configured.' }, 503);
  if (!(await isAuthenticated(request, env))) return json({ error: 'Not signed in.' }, 401);

  const { keys } = await env.RESUME_KV.list({ prefix: MESSAGE_PREFIX, limit: 100 });
  const messages = await Promise.all(keys.map((k) => env.RESUME_KV!.get<StoredMessage>(k.name, 'json')));
  return json({ messages: messages.filter(Boolean) });
};

/** Delete one message: DELETE /api/messages?id=<id> (signed in only). */
export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESUME_KV) return json({ error: 'Storage is not configured.' }, 503);
  if (!(await isAuthenticated(request, env))) return json({ error: 'Not signed in.' }, 401);

  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!/^\d{13}-[0-9a-f]{8}$/.test(id)) return json({ error: 'Invalid message id.' }, 400);
  await env.RESUME_KV.delete(`${MESSAGE_PREFIX}${id}`);
  return json({ deleted: true });
};
