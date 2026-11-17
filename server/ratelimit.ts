// Two kinds of limiter, both free:
//  - memoryLimit: per-isolate counter, zero cost, best effort (each edge isolate counts separately).
//    Stops a single client hammering /api; the zone-wide WAF rule in the README covers the rest.
//  - KV limiters: strict, shared across the edge. Only counted events write to KV, and every
//    limiter has a global cap so a distributed attack stays inside the KV free tier
//    (1,000 writes/day).

const buckets = new Map<string, { count: number; reset: number }>();

/** Returns seconds to wait if `key` exceeded `max` requests per `windowSeconds`, else 0. */
export function memoryLimit(key: string, max: number, windowSeconds: number): number {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowSeconds * 1000 });
    return 0;
  }
  bucket.count += 1;
  return bucket.count > max ? Math.ceil((bucket.reset - now) / 1000) : 0;
}

interface Rule {
  /** `ip` counts per client, `all` counts every client together. */
  scope: 'ip' | 'all';
  max: number;
  window: number;
}

function kvLimiter(name: string, rules: Rule[]) {
  const keys = (ip: string) => {
    const now = Math.floor(Date.now() / 1000);
    return rules.map((rule) => ({
      ...rule,
      key: `rl:${name}:${rule.scope === 'ip' ? `ip:${ip}` : 'all'}:${Math.floor(now / rule.window)}`,
    }));
  };
  return {
    async blocked(kv: KVNamespace, ip: string): Promise<boolean> {
      const over = await Promise.all(keys(ip).map(async (k) => Number(await kv.get(k.key)) >= k.max));
      return over.some(Boolean);
    },
    async record(kv: KVNamespace, ip: string): Promise<void> {
      await Promise.all(
        keys(ip).map(async (k) => {
          const count = Number(await kv.get(k.key)) || 0;
          await kv.put(k.key, String(count + 1), { expirationTtl: k.window + 60 });
        }),
      );
    },
  };
}

/** 5 failed attempts per IP per 15 minutes, 15 overall per hour. */
export const failedLogins = kvLimiter('login', [
  { scope: 'ip', max: 5, window: 15 * 60 },
  { scope: 'all', max: 15, window: 60 * 60 },
]);

/** 3 messages per IP per hour, 30 overall per day. */
export const contactMessages = kvLimiter('contact', [
  { scope: 'ip', max: 3, window: 60 * 60 },
  { scope: 'all', max: 30, window: 24 * 60 * 60 },
]);
