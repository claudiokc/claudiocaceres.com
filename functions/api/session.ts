import { clearedCookie, isAuthenticated } from '../../server/auth';
import { json, type Env } from '../../server/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) =>
  json({ authenticated: await isAuthenticated(request, env) });

/** Sign out. */
export const onRequestDelete: PagesFunction<Env> = async () =>
  json({ authenticated: false }, 200, { 'Set-Cookie': clearedCookie() });
