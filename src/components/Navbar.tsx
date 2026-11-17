import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className="no-print border-b border-slate-200 bg-white">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="text-lg font-bold tracking-tight text-slate-900">
          Claudio Cáceres
        </NavLink>
        <ul className="flex gap-1">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
