import { useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import { CONTACT_LIMITS, validateContact } from '../lib/contact';
import { defaultResume } from '../lib/resume';

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; text: string };

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy the email address:', email);
    }
  };
  return (
    <button type="button" className="btn px-2 py-1 text-xs" onClick={copy}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function Contact() {
  const { profile } = defaultResume;
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const set = (field: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const check = validateContact(form);
    if (!check.ok) return setStatus({ kind: 'error', text: check.error });
    setStatus({ kind: 'sending' });
    try {
      await api.sendMessage(form);
      setStatus({ kind: 'sent' });
      setForm({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      setStatus({ kind: 'error', text: `${(err as Error).message} You can also email me at ${profile.email}.` });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Get in touch</h1>
        <p className="mt-2 text-lg">Have a question or want to work together?</p>
      </header>

      <div className="grid gap-6 md:grid-cols-5">
        {status.kind === 'sent' ? (
          <div className="card space-y-3 md:col-span-3" role="status">
            <h2 className="text-xl font-bold">Thanks, your message was sent.</h2>
            <p>I'll reply to the email address you gave, usually within a couple of days.</p>
            <button type="button" className="btn" onClick={() => setStatus({ kind: 'idle' })}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4 md:col-span-3" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label">Name</label>
                <input id="name" className="input" autoComplete="name" maxLength={CONTACT_LIMITS.name}
                  value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label htmlFor="email" className="label">Your email</label>
                <input id="email" type="email" className="input" autoComplete="email" maxLength={CONTACT_LIMITS.email}
                  value={form.email} onChange={set('email')} required />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="label">Message</label>
              <textarea id="message" className="input" rows={7} maxLength={CONTACT_LIMITS.message}
                value={form.message} onChange={set('message')} required />
            </div>
            {/* Honeypot for bots: hidden from people and screen readers. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
            </div>
            {status.kind === 'error' && <p role="alert" className="text-sm text-red-600">{status.text}</p>}
            <button type="submit" className="btn btn-primary" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}

        <div className="card space-y-4 md:col-span-2">
          <h2 className="text-lg font-bold">Contact details</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex flex-wrap items-center gap-2">
              <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>
              <CopyEmail email={profile.email} />
            </li>
            <li><a className="link" href={profile.github}>{profile.github.replace('https://', '')}</a></li>
            <li><a className="link" href={profile.linkedin}>{profile.linkedin.replace('https://', '')}</a></li>
          </ul>
          <h2 className="text-lg font-bold">Location</h2>
          <p className="text-sm">Based in Buenos Aires, Argentina. Available for remote work worldwide.</p>
        </div>
      </div>
    </div>
  );
}
