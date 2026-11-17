import type { Resume } from './resume';

/** Builds a text-based (selectable, ATS-readable) A4 PDF of the resume and downloads it. */
export async function downloadCv(resume: Resume): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;

  const room = (height: number) => {
    if (y + height > bottom) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (
    text: string,
    { size = 10, style = 'normal', color = 60, indent = 0, gap = 4 }: { size?: number; style?: string; color?: number; indent?: number; gap?: number } = {},
  ) => {
    if (!text) return;
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lineHeight = size * 1.35;
    for (const line of doc.splitTextToSize(text, width - indent) as string[]) {
      room(lineHeight);
      y += lineHeight;
      doc.text(line, margin + indent, y - lineHeight * 0.25);
    }
    y += gap;
  };

  const section = (title: string) => {
    room(60);
    y += 10;
    write(title.toUpperCase(), { size: 11, style: 'bold', color: 20, gap: 2 });
    doc.setDrawColor(200);
    doc.line(margin, y, margin + width, y);
    y += 8;
  };

  const { profile } = resume;
  write(profile.name, { size: 22, style: 'bold', color: 20, gap: 0 });
  write(profile.title, { size: 12, color: 70 });
  write(
    [profile.email, profile.location, profile.site, profile.linkedin, profile.github]
      .map((v) => v.replace(/^https?:\/\//, ''))
      .join('  |  '),
    { size: 9, color: 90 },
  );

  section('Summary');
  write(resume.summary);

  section('Professional Experience');
  for (const job of resume.experience) {
    room(50);
    write(job.title, { size: 11, style: 'bold', color: 20, gap: 0 });
    write([job.company, job.location, job.period].filter(Boolean).join('  |  '), { style: 'bold', color: 80 });
    write(job.description, { style: 'italic' });
    for (const highlight of job.highlights) {
      room(14);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text('•', margin + 4, y + 10);
      write(highlight, { indent: 14, gap: 1 });
    }
    if (job.stack) write(`Tech stack: ${job.stack}`, { size: 9, color: 100 });
    y += 6;
  }

  section('Skills');
  for (const skill of resume.skills) write(`${skill.name}: ${skill.items}`, { gap: 2 });

  section('Education');
  for (const item of resume.education) write(`${item.degree} — ${item.school}`, { gap: 2 });

  section('Certifications & Courses');
  write(resume.certifications.join('  |  '));

  doc.setProperties({ title: `${profile.name} — CV`, author: profile.name });
  doc.save(`${profile.name.replace(/\s+/g, '-')}-CV.pdf`);
}
