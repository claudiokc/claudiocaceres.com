import { Link } from 'react-router-dom';
import { useResume } from '../lib/resume';

const services = [
  {
    title: 'Backend & APIs',
    text: 'Robust APIs with Python (Django, Flask), database design, and integrations with third-party platforms.',
  },
  {
    title: 'Frontend',
    text: 'Modern, responsive web applications with React and TypeScript, built for performance and maintainability.',
  },
  {
    title: 'Cloud & Delivery',
    text: 'Infrastructure on AWS and GCP, Docker, Terraform, and CI/CD pipelines that keep releases boring.',
  },
];

export default function Home() {
  const { profile, summary, experience } = useResume();
  const current = experience[0];

  return (
    <div className="space-y-12">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{profile.title}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{summary}</p>
        {current && (
          <p className="mt-3 text-sm text-slate-500">
            Currently {current.title} at {current.company} · {profile.location}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/resume" className="btn btn-primary">View resume</Link>
          <Link to="/contact" className="btn">Get in touch</Link>
        </div>
      </section>

      <section aria-labelledby="what-i-do">
        <h2 id="what-i-do" className="text-2xl font-bold">What I do</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="card">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{service.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
