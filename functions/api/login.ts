import { authConfigured, sessionCookie, verifyPassword } from '../../server/auth';
import { clientIp, json, readJson, type Env } from '../../server/http';
import { failedLogins } from '../../server/ratelimit';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!authConfigured(env)) return json({ error: 'Login is not configured on this deployment.' }, 503);
  const kv = env.RESUME_KV!;
  const ip = clientIp(request);

  if (await failedLogins.blocked(kv, ip)) {
    return json({ error: 'Too many failed attempts. Try again later.' }, 429, { 'Retry-After': '900' });
  }

  const body = (await readJson(request)) as { password?: unknown } | undefined;
  const password = typeof body?.password === 'string' ? body.password.slice(0, 256) : '';
  if (!password || !(await verifyPassword(password, env.ADMIN_PASSWORD_HASH!))) {
    await failedLogins.record(kv, ip);
    return json({ error: 'Wrong password.' }, 401);
  }

  return json({ authenticated: true }, 200, { 'Set-Cookie': await sessionCookie(env) });
};
