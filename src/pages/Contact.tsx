import { useState, type FormEvent } from 'react';
import { defaultResume } from '../lib/resume';

export default function Contact() {
  const { profile } = defaultResume;
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // No backend mailer (nothing to pay for or to spam): the form opens the visitor's own email app.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Get in touch</h1>
        <p className="mt-2 text-lg">Have a question or want to work together?</p>
      </header>

      <div className="grid gap-6 md:grid-cols-5">
        <form onSubmit={handleSubmit} className="card space-y-4 md:col-span-3">
          <div>
            <label htmlFor="subject" className="label">Subject</label>
            <input id="subject" className="input" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="message" className="label">Message</label>
            <textarea id="message" className="input" rows={7} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Open in your email app</button>
          <p className="text-sm text-slate-500">
            This opens a draft to {profile.email} in your email app. Nothing is sent from this page.
          </p>
        </form>

        <div className="card space-y-4 md:col-span-2">
          <h2 className="text-lg font-bold">Contact details</h2>
          <ul className="space-y-2 text-sm">
            <li><a className="link" href={`mailto:${profile.email}`}>{profile.email}</a></li>
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
