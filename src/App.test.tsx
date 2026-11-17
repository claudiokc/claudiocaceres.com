import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { validateExperience } from './lib/experience';

describe('App', () => {
  it('renders the home page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Claudio Cáceres' })).toBeTruthy();
  });
});

describe('validateExperience', () => {
  const job = { title: 'Engineer', company: 'Acme', period: '2020', highlights: ['Built things', ' '] };

  it('cleans valid input and drops unknown fields and blank highlights', () => {
    const result = validateExperience([{ ...job, admin: true }]);
    expect(result).toEqual({
      ok: true,
      value: [{ title: 'Engineer', company: 'Acme', location: '', period: '2020', description: '', highlights: ['Built things'], stack: '' }],
    });
  });

  it('rejects missing titles, non-arrays and oversized fields', () => {
    expect(validateExperience([{ ...job, title: '' }]).ok).toBe(false);
    expect(validateExperience({}).ok).toBe(false);
    expect(validateExperience([{ ...job, stack: 'x'.repeat(601) }]).ok).toBe(false);
  });
});
