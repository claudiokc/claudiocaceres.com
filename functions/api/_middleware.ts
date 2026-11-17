import { clientIp, json, type Env } from '../../server/http';
import { memoryLimit } from '../../server/ratelimit';

const MAX_BODY_BYTES = 64 * 1024;

export const onRequest: PagesFunction<Env> = async ({ request, next }) => {
  const wait = memoryLimit(clientIp(request), 60, 60);
  if (wait) return json({ error: 'Too many requests.' }, 429, { 'Retry-After': String(wait) });

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // Same-origin only: blocks cross-site form posts on top of the SameSite=Strict cookie.
    const origin = request.headers.get('Origin');
    if (!origin || new URL(origin).host !== new URL(request.url).host) {
      return json({ error: 'Forbidden.' }, 403);
    }
    if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) {
      return json({ error: 'Payload too large.' }, 413);
    }
  }

  try {
    return await next();
  } catch (error) {
    console.error(error);
    return json({ error: 'Something went wrong.' }, 500);
  }
};
