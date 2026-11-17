// Shared by the contact page and functions/api/contact.ts.

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface StoredMessage extends ContactMessage {
  id: string;
  receivedAt: string;
}

export const CONTACT_LIMITS = { name: 100, email: 200, message: 4000 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Result = { ok: true; value: ContactMessage } | { ok: false; error: string };

export function validateContact(input: unknown): Result {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Invalid message.' };
  const r = input as Record<string, unknown>;
  const name = typeof r.name === 'string' ? r.name.trim() : '';
  const email = typeof r.email === 'string' ? r.email.trim() : '';
  const message = typeof r.message === 'string' ? r.message.trim() : '';

  if (!name || name.length > CONTACT_LIMITS.name) return { ok: false, error: 'Please enter your name.' };
  if (!EMAIL.test(email) || email.length > CONTACT_LIMITS.email) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (!message) return { ok: false, error: 'Please write a message.' };
  if (message.length > CONTACT_LIMITS.message) {
    return { ok: false, error: `Please keep the message under ${CONTACT_LIMITS.message} characters.` };
  }
  return { ok: true, value: { name, email, message } };
}
