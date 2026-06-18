import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Ticket, Sun, Moon, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function getPasswordStrengthKey(pw: string): { key: string; color: string; width: string } | null {
  if (!pw) return null;
  if (pw.length < 8) return { key: 'password.tooShort', color: 'bg-red-500', width: 'w-1/4' };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const score = [hasUpper, hasNum, hasSymbol].filter(Boolean).length;
  if (score === 0) return { key: 'password.weak', color: 'bg-orange-500', width: 'w-2/4' };
  if (score === 1) return { key: 'password.fair', color: 'bg-yellow-500', width: 'w-3/4' };
  return { key: 'password.strong', color: 'bg-green-500', width: 'w-full' };
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
  const { t } = useLanguage();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setFieldErrors(fe => ({ ...fe, [k]: '' }));
    setError('');
  };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = t('register.nameRequired');
    if (!form.email.trim()) errs.email = t('register.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('register.emailInvalid');
    if (!form.password) errs.password = t('register.passwordRequired');
    else if (form.password.length < 8) errs.password = t('register.passwordMinError');
    if (!form.confirm) errs.confirm = t('register.confirmRequired');
    else if (form.password !== form.confirm) errs.confirm = t('register.passwordMismatch');
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

  const strengthData = getPasswordStrengthKey(form.password);

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
          <span className="text-white font-bold text-[17px]">MikTik</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4 whitespace-pre-line">
            {t('register.joinSafest')}
          </h2>
          <p className="text-indigo-200 mb-8 leading-relaxed">
            {t('register.joinDesc')}
          </p>
          <div className="space-y-3">
            {[t('register.freeJoin'), t('register.instantId'), t('register.sellFast')].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-white/90 text-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-200" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-300 text-xs relative z-10">{t('register.copyright')}</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-[17px]">MikTik</span>
          </Link>
          <div className="lg:ml-auto flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('register.haveAccount')}</span>
            <Link to="/login" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
              {t('login.signIn')} →
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t('register.createAccount')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{t('register.freeForever')}</p>

            {error && (
              <div className="flex items-start gap-2.5 mb-5 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('register.fullName')}</label>
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('register.emailLabel')}</label>
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
                          <Link to="/login" className="font-semibold underline">{t('register.signIn')}</Link>
                          {fieldErrors.email.split('sign in')[1]}
                        </>
                      ) : fieldErrors.email}
                    </span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('register.passwordLabel')}</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder={t('register.passwordMin')}
                    className={`w-full px-4 pr-10 py-3 bg-slate-50 dark:bg-zinc-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${fieldErrors.password ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-white/10'}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.password}</p>
                ) : strengthData && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strengthData.color} ${strengthData.width}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {strengthData.key === 'password.strong' && <CheckCircle className="w-3 h-3 text-green-500" />}
                      <span className="text-xs text-slate-400">{t(strengthData.key)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('register.confirmPassword')}</label>
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
                {t('register.termsPrefix')}{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t('register.termsOfService')}</a>
                {' '}{t('register.and')}{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t('register.privacyPolicy')}</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? t('register.creating') : t('register.createFree')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
