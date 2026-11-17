// Two limiters, both free:
//  - memoryLimit: per-isolate counter, zero cost, best effort (each edge isolate counts separately).
//    Stops a single client hammering /api; the zone-wide WAF rule in the README covers the rest.
//  - failedLogins: KV-backed, strict. Only failed attempts write, and the global cap keeps a
//    distributed attack inside the KV free tier (1,000 writes/day).

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

const PER_IP = { max: 5, window: 15 * 60 };
const GLOBAL = { max: 15, window: 60 * 60 };

function keys(ip: string) {
  const now = Math.floor(Date.now() / 1000);
  return [
    { key: `rl:login:ip:${ip}:${Math.floor(now / PER_IP.window)}`, ...PER_IP },
    { key: `rl:login:all:${Math.floor(now / GLOBAL.window)}`, ...GLOBAL },
  ];
}

export const failedLogins = {
  async blocked(kv: KVNamespace, ip: string): Promise<boolean> {
    const counts = await Promise.all(keys(ip).map(async (k) => Number(await kv.get(k.key)) >= k.max));
    return counts.some(Boolean);
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
