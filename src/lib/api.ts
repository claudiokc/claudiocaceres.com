import type { ContactMessage, StoredMessage } from './contact';
import type { Experience } from './experience';

export interface ResumeResponse {
  experience: Experience[];
  updatedAt: string | null;
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin', ...init }).catch(() => null);
  const body = await response?.json().catch(() => null);
  if (!response?.ok || body == null) {
    throw new ApiError(body?.error ?? 'The server could not be reached.', response?.status ?? 0);
  }
  return body as T;
}

const jsonBody = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export const api = {
  resume: () => request<ResumeResponse>('/api/resume'),
  saveExperience: (experience: Experience[]) => request<ResumeResponse>('/api/resume', jsonBody('PUT', { experience })),
  session: () => request<{ authenticated: boolean }>('/api/session'),
  login: (password: string) => request<{ authenticated: boolean }>('/api/login', jsonBody('POST', { password })),
  sendMessage: (message: ContactMessage & { website: string }) =>
    request<{ sent: boolean }>('/api/contact', jsonBody('POST', message)),
  messages: () => request<{ messages: StoredMessage[] }>('/api/messages'),
  deleteMessage: (id: string) =>
    request<{ deleted: boolean }>(`/api/messages?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  logout: () => request<{ authenticated: boolean }>('/api/session', { method: 'DELETE' }),
};
