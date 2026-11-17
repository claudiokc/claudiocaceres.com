import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { emptyExperience, validateExperience, type Experience } from '../lib/experience';

type Notice = { kind: 'ok' | 'error'; text: string } | null;

const fields: { key: 'title' | 'company' | 'location' | 'period'; label: string; placeholder?: string }[] = [
  { key: 'title', label: 'Job title' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location (optional)', placeholder: 'Remote' },
  { key: 'period', label: 'Period', placeholder: 'Sep 2025 - Present' },
];

export default function Admin() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [jobs, setJobs] = useState<Experience[]>([]);
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.session(), api.resume()])
      .then(([session, resume]) => {
        setJobs(resume.experience);
        setAuthenticated(session.authenticated);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) return <p>Loading…</p>;
  if (!authenticated) return <Navigate to="/login" replace />;

  const update = (index: number, patch: Partial<Experience>) =>
    setJobs((current) => current.map((job, i) => (i === index ? { ...job, ...patch } : job)));

  const move = (index: number, offset: number) =>
    setJobs((current) => {
      const next = [...current];
      const [job] = next.splice(index, 1);
      next.splice(index + offset, 0, job);
      return next;
    });

  const remove = (index: number) => {
    const job = jobs[index];
    if (window.confirm(`Remove "${job.title || 'this role'}"${job.company ? ` at ${job.company}` : ''}?`)) {
      setJobs((current) => current.filter((_, i) => i !== index));
    }
  };

  const save = async () => {
    const result = validateExperience(jobs);
    if (!result.ok) return setNotice({ kind: 'error', text: result.error });
    setSaving(true);
    setNotice(null);
    try {
      const saved = await api.saveExperience(result.value);
      setJobs(saved.experience);
      setNotice({ kind: 'ok', text: 'Saved. The resume page now shows this version.' });
    } catch (err) {
      setNotice({ kind: 'error', text: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await api.logout().catch(() => undefined);
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Professional experience</h1>
          <p className="mt-1 text-sm">Listed in this order on the resume page and in the CV download.</p>
        </div>
        <button type="button" className="btn" onClick={signOut}>Sign out</button>
      </header>

      {jobs.map((job, index) => (
        <fieldset key={index} className="card space-y-4">
          <legend className="sr-only">Role {index + 1}</legend>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">{job.title || 'New role'}{job.company && ` · ${job.company}`}</h2>
            <div className="flex gap-2">
              <button type="button" className="btn" onClick={() => move(index, -1)} disabled={index === 0}>Move up</button>
              <button type="button" className="btn" onClick={() => move(index, 1)} disabled={index === jobs.length - 1}>Move down</button>
              <button type="button" className="btn text-red-700" onClick={() => remove(index)}>Remove</button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="label" htmlFor={`${key}-${index}`}>{label}</label>
                <input
                  id={`${key}-${index}`}
                  className="input"
                  value={job[key]}
                  placeholder={placeholder}
                  onChange={(e) => update(index, { [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="label" htmlFor={`description-${index}`}>Short description (optional)</label>
            <input
              id={`description-${index}`}
              className="input"
              value={job.description}
              onChange={(e) => update(index, { description: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor={`highlights-${index}`}>Highlights, one per line</label>
            <textarea
              id={`highlights-${index}`}
              className="input"
              rows={Math.max(3, job.highlights.length + 1)}
              value={job.highlights.join('\n')}
              onChange={(e) => update(index, { highlights: e.target.value.split('\n') })}
            />
          </div>
          <div>
            <label className="label" htmlFor={`stack-${index}`}>Tech stack</label>
            <input
              id={`stack-${index}`}
              className="input"
              value={job.stack}
              onChange={(e) => update(index, { stack: e.target.value })}
            />
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-slate-50 py-4">
        <button type="button" className="btn" onClick={() => setJobs((current) => [emptyExperience(), ...current])}>
          Add role at top
        </button>
        <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {notice && (
          <p role={notice.kind === 'error' ? 'alert' : 'status'} className={`text-sm ${notice.kind === 'error' ? 'text-red-600' : 'text-green-700'}`}>
            {notice.text}
          </p>
        )}
      </div>
    </div>
  );
}
