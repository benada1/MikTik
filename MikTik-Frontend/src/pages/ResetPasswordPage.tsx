import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, KeyRound, CheckCircle, Ticket, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
        <div className="w-full max-w-sm text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-6">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-[17px]">MikTik</span>
        </Link>

        {done ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password updated!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Redirecting you to sign in…
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              <ArrowLeft className="w-4 h-4" /> Go to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
              <KeyRound className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Set new password</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full px-4 py-3 pr-11 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Confirm password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Saving…' : 'Set new password'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
