import { useState, type ReactNode } from 'react';
import { downloadCv } from '../lib/cv';
import { useResume } from '../lib/resume';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-slate-200 pt-6">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function Resume() {
  const resume = useResume();
  const { profile } = resume;
  const [status, setStatus] = useState<'idle' | 'working' | 'failed'>('idle');

  const handleDownload = async () => {
    setStatus('working');
    try {
      await downloadCv(resume);
      setStatus('idle');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <article className="card space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-lg text-indigo-700">{profile.title}</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="link" href={profile.github}>GitHub</a>
            <a className="link" href={profile.linkedin}>LinkedIn</a>
            <span>{profile.location}</span>
          </p>
        </div>
        <div className="no-print text-right">
          <button type="button" className="btn btn-primary" onClick={handleDownload} disabled={status === 'working'}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            {status === 'working' ? 'Preparing…' : 'Download CV (PDF)'}
          </button>
          {status === 'failed' && (
            <p role="alert" className="mt-2 text-sm text-red-600">Could not create the PDF. Please try again.</p>
          )}
        </div>
      </header>

      <Section title="Summary">
        <p className="leading-relaxed">{resume.summary}</p>
      </Section>

      <Section title="Professional Experience">
        <div className="space-y-8">
          {resume.experience.map((job, index) => (
            <div key={`${job.company}-${index}`}>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-indigo-700">{[job.company, job.location, job.period].filter(Boolean).join(' • ')}</p>
              {job.description && <p className="mt-1">{job.description}</p>}
              {job.highlights.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {job.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              )}
              {job.stack && <p className="mt-2 text-sm text-slate-500">Tech stack: {job.stack}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills">
        <dl className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {resume.skills.map((skill) => (
            <div key={skill.name} className="rounded-lg bg-slate-50 p-3">
              <dt className="font-semibold text-slate-900">{skill.name}</dt>
              <dd className="text-sm">{skill.items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Education">
        <ul className="space-y-3">
          {resume.education.map((item) => (
            <li key={item.degree}>
              <h3 className="font-semibold">{item.degree}</h3>
              <p className="text-indigo-700">{item.school}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Certifications & Courses">
        <ul className="flex flex-wrap gap-2">
          {resume.certifications.map((name) => (
            <li key={name} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{name}</li>
          ))}
        </ul>
      </Section>
    </article>
  );
}
