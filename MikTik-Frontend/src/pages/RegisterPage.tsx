import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Ticket, Sun, Moon, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function getPasswordStrength(pw: string): { label: string; color: string; width: string } | null {
  if (!pw) return null;
  if (pw.length < 8) return { label: 'Too short', color: 'bg-red-500', width: 'w-1/4' };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const score = [hasUpper, hasNum, hasSymbol].filter(Boolean).length;
  if (score === 0) return { label: 'Weak', color: 'bg-orange-500', width: 'w-2/4' };
  if (score === 1) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof form>>({});
  const { theme, toggle } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setFieldErrors(fe => ({ ...fe, [k]: '' }));
    setError('');
  };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/marketplace', { replace: true });
    } catch (err: any) {
      const msg: string = err.message || 'Something went wrong. Please try again.';
      if (msg.toLowerCase().includes('email already exists') || msg.toLowerCase().includes('sign in')) {
        setFieldErrors(fe => ({ ...fe, email: msg }));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-violet-700 to-indigo-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-[17px]">TicketTrust</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Israel's<br />safest ticket market
          </h2>
          <p className="text-indigo-200 mb-8 leading-relaxed">
            Create a free account and start buying or selling tickets with full escrow protection in minutes.
          </p>
          <div className="space-y-3">
            {['Free to join, no subscription', 'Instant ID verification', 'Sell in under 5 minutes'].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-white/90 text-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-200" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-300 text-xs relative z-10">© 2025 TicketTrust. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-[17px]">TicketTrust</span>
          </Link>
          <div className="lg:ml-auto flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">Have an account?</span>
            <Link to="/login" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
              Sign in →
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Free forever. No credit card required.</p>

            {error && (
              <div className="flex items-start gap-2.5 mb-5 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Yossi Cohen"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${fieldErrors.name ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-white/10'}`}
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${fieldErrors.email ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-white/10'}`}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      {fieldErrors.email.includes('sign in') ? (
                        <>
                          {fieldErrors.email.split('sign in')[0]}
                          <Link to="/login" className="font-semibold underline">sign in</Link>
                          {fieldErrors.email.split('sign in')[1]}
                        </>
                      ) : fieldErrors.email}
                    </span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min 8 characters"
                    className={`w-full px-4 pr-10 py-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${fieldErrors.password ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-white/10'}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.password}</p>
                ) : strength && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {strength.label === 'Strong' && <CheckCircle className="w-3 h-3 text-green-500" />}
                      <span className="text-xs text-slate-400">{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Confirm password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${fieldErrors.confirm ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-white/10'}`}
                />
                {fieldErrors.confirm && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.confirm}</p>
                )}
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                By creating an account you agree to our{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Creating account...' : 'Create free account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
