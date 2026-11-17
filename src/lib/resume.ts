import { useEffect, useState } from 'react';
import defaults from '../data/resume.json';
import { api } from './api';
import type { Experience } from './experience';

export type Resume = typeof defaults & { experience: Experience[] };

export const defaultResume: Resume = defaults;

/**
 * The resume bundled with the site, with the experience section replaced by the
 * version saved from /admin once it loads. If the API is unavailable the bundled
 * copy stays, so the page never breaks.
 */
export function useResume(): Resume {
  const [experience, setExperience] = useState<Experience[]>(defaults.experience);

  useEffect(() => {
    let cancelled = false;
    api
      .resume()
      .then((data) => {
        if (!cancelled && Array.isArray(data.experience)) setExperience(data.experience);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...defaults, experience };
}
