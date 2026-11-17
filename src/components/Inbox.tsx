import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { StoredMessage } from '../lib/contact';

export default function Inbox() {
  const [messages, setMessages] = useState<StoredMessage[] | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    api
      .messages()
      .then((data) => setMessages(data.messages))
      .catch((err) => setError((err as Error).message));
  };

  useEffect(load, []);

  const remove = async (message: StoredMessage) => {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    try {
      await api.deleteMessage(message.id);
      setMessages((current) => current?.filter((m) => m.id !== message.id) ?? null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section aria-labelledby="inbox" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="inbox" className="text-2xl font-bold">
          Messages{messages && ` (${messages.length})`}
        </h2>
        <button type="button" className="btn" onClick={load}>Refresh</button>
      </div>
      <p className="text-sm text-slate-500">From the contact form, newest first. Kept for 180 days.</p>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {messages === null && !error && <p>Loading…</p>}
      {messages?.length === 0 && <p className="card text-sm">No messages yet.</p>}
      {messages?.map((message) => (
        <article key={message.id} className="card space-y-2">
          <header className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{message.name}</h3>
              <p className="text-sm">
                <a className="link" href={`mailto:${message.email}`}>{message.email}</a>
                {' · '}
                <time dateTime={message.receivedAt}>{new Date(message.receivedAt).toLocaleString()}</time>
              </p>
            </div>
            <button type="button" className="btn text-red-700" onClick={() => remove(message)}>Delete</button>
          </header>
          <p className="whitespace-pre-wrap text-sm">{message.message}</p>
        </article>
      ))}
    </section>
  );
}
