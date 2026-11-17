import type { Experience } from './experience';

export interface ResumeResponse {
  experience: Experience[];
  updatedAt: string | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin', ...init });
  const body = await response.json().catch(() => null);
  if (!response.ok || body === null) {
    throw new Error(body?.error ?? 'The server could not be reached.');
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
  logout: () => request<{ authenticated: boolean }>('/api/session', { method: 'DELETE' }),
};
