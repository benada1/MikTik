import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Menu, X, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/sell', label: 'Sell Tickets' },
  { to: '/buyer-dashboard', label: 'My Tickets' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
            <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
              Ticket<span className="text-indigo-600 dark:text-indigo-400">Trust</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(l.to)
                    ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Notifications">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 dark:bg-indigo-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center leading-none">3</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors shadow-sm shadow-indigo-500/25"
              >
                Get started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-950 px-4 py-3 space-y-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 pb-1 flex flex-col gap-2">
            <Link to="/login" onClick={() => setOpen(false)} className="block text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
              Sign in
            </Link>
            <Link to="/register" onClick={() => setOpen(false)} className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 dark:bg-indigo-500 text-white">
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
