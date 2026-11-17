import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { defaultResume } from '../lib/resume';

const GA_MEASUREMENT_ID = 'G-SRQZQ7KK1M';
const SITE = 'Claudio Cáceres';

const titles: Record<string, string> = {
  '/': `${SITE} — Senior Software Engineer`,
  '/resume': `Resume — ${SITE}`,
  '/contact': `Contact — ${SITE}`,
  '/login': `Sign in — ${SITE}`,
  '/admin': `Admin — ${SITE}`,
};

export default function Layout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    document.title = titles[pathname] ?? `Page not found — ${SITE}`;
    const { gtag } = window as unknown as { gtag?: (command: string, id: string, params: object) => void };
    gtag?.('config', GA_MEASUREMENT_ID, { page_path: pathname + search });
  }, [pathname, search]);

  const { profile } = defaultResume;
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
      <footer className="no-print border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm text-slate-500 sm:px-6">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="flex gap-4">
            <a className="hover:text-slate-900" href={profile.github}>GitHub</a>
            <a className="hover:text-slate-900" href={profile.linkedin}>LinkedIn</a>
            <a className="hover:text-slate-900" href={`mailto:${profile.email}`}>Email</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
