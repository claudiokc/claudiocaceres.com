import defaults from '../../src/data/resume.json';
import { validateExperience } from '../../src/lib/experience';
import { isAuthenticated } from '../../server/auth';
import { json, readJson, type Env } from '../../server/http';

const KEY = 'resume:experience';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const stored = env.RESUME_KV ? await env.RESUME_KV.get(KEY, 'json') : null;
  return json(stored ?? { experience: defaults.experience, updatedAt: null }, 200, {
    'Cache-Control': 'public, max-age=60',
  });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESUME_KV) return json({ error: 'Storage is not configured.' }, 503);
  if (!(await isAuthenticated(request, env))) return json({ error: 'Not signed in.' }, 401);

  const body = (await readJson(request)) as { experience?: unknown } | undefined;
  const result = validateExperience(body?.experience);
  if (!result.ok) return json({ error: result.error }, 400);

  const saved = { experience: result.value, updatedAt: new Date().toISOString() };
  await env.RESUME_KV.put(KEY, JSON.stringify(saved));
  return json(saved);
};
