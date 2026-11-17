// Shared by the React app and the Pages Functions (functions/api/*).

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  stack: string;
}

export const LIMITS = {
  entries: 30,
  highlights: 30,
  short: 120,
  long: 600,
};

export function emptyExperience(): Experience {
  return { title: '', company: '', location: '', period: '', description: '', highlights: [], stack: '' };
}

type Result = { ok: true; value: Experience[] } | { ok: false; error: string };

function text(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed : null;
}

/** Validates untrusted input and returns a clean copy containing only known fields. */
export function validateExperience(input: unknown): Result {
  if (!Array.isArray(input)) return { ok: false, error: 'Experience must be a list.' };
  if (input.length > LIMITS.entries) return { ok: false, error: `At most ${LIMITS.entries} entries.` };

  const value: Experience[] = [];
  for (const [i, raw] of input.entries()) {
    const where = `Entry ${i + 1}`;
    if (typeof raw !== 'object' || raw === null) return { ok: false, error: `${where} is invalid.` };
    const r = raw as Record<string, unknown>;

    const title = text(r.title, LIMITS.short);
    const company = text(r.company, LIMITS.short);
    const location = text(r.location, LIMITS.short);
    const period = text(r.period, LIMITS.short);
    const description = text(r.description, LIMITS.long);
    const stack = text(r.stack, LIMITS.long);
    if (title === null || company === null || location === null || period === null || description === null || stack === null) {
      return { ok: false, error: `${where} has a field that is too long or not text.` };
    }
    if (!title || !company) return { ok: false, error: `${where} needs a title and a company.` };

    const rawHighlights = r.highlights ?? [];
    if (!Array.isArray(rawHighlights) || rawHighlights.length > LIMITS.highlights) {
      return { ok: false, error: `${where} can have at most ${LIMITS.highlights} highlights.` };
    }
    const highlights: string[] = [];
    for (const h of rawHighlights) {
      const line = text(h, LIMITS.long);
      if (line === null) return { ok: false, error: `${where} has a highlight that is too long or not text.` };
      if (line) highlights.push(line);
    }

    value.push({ title, company, location, period, description, highlights, stack });
  }
  return { ok: true, value };
}
