/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Writes /llms.txt from src/data/resume.json so it never drifts from the resume. */
function llmsTxt(): Plugin {
  return {
    name: 'llms-txt',
    generateBundle() {
      const resume = JSON.parse(readFileSync(new URL('./src/data/resume.json', import.meta.url), 'utf8'));
      const { profile } = resume;
      const lines = [
        `# ${profile.name}`,
        '',
        `> ${profile.title}. ${resume.summary}`,
        '',
        `Location: ${profile.location}.`,
        '',
        '## Pages',
        '',
        `- [Home](${profile.site}/): Overview`,
        `- [Resume](${profile.site}/resume): Professional experience, skills, education, and a PDF download`,
        `- [Contact](${profile.site}/contact): How to get in touch`,
        '',
        '## Contact',
        '',
        `- [Email](mailto:${profile.email})`,
        `- [GitHub](${profile.github})`,
        `- [LinkedIn](${profile.linkedin})`,
        '',
        '## Professional experience',
        '',
        ...resume.experience.flatMap((job: { title: string; company: string; period: string; description: string; highlights: string[]; stack: string }) => [
          `### ${job.title} — ${job.company} (${job.period})`,
          '',
          ...(job.description ? [job.description, ''] : []),
          ...job.highlights.map((h) => `- ${h}`),
          ...(job.stack ? ['', `Tech stack: ${job.stack}`] : []),
          '',
        ]),
        '## Skills',
        '',
        ...resume.skills.map((s: { name: string; items: string }) => `- ${s.name}: ${s.items}`),
        '',
        '## Education',
        '',
        ...resume.education.map((e: { degree: string; school: string }) => `- ${e.degree}, ${e.school}`),
        '',
        '## Certifications and courses',
        '',
        ...resume.certifications.map((c: string) => `- ${c}`),
        '',
        '## Notes',
        '',
        `- The experience section can be edited on the live site; ${profile.site}/api/resume returns the current version as JSON.`,
        '',
      ];
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: lines.join('\n') });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), llmsTxt()],
  server: {
    port: 3000,
    // `npm run dev:api` serves the Pages Functions on 8788.
    proxy: { '/api': 'http://127.0.0.1:8788' },
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
  },
});
