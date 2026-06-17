import { useState } from 'react';
import { Users, Ticket, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye, Ban } from 'lucide-react';

const STATS = [
  { label: 'Total users', value: '12,847', change: '+234 this week', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { label: 'Active listings', value: '3,241', change: '+89 today', icon: Ticket, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Open disputes', value: '17', change: '3 urgent', icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Revenue (30d)', value: '₪284K', change: '+12% vs last month', icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
];

const USERS = [
  { id: 'U-001', name: 'Yossi Mizrahi', email: 'yossi@example.com', joined: 'Dec 1, 2024', listings: 5, sales: 12, status: 'active', verified: true },
  { id: 'U-002', name: 'Dana Katz', email: 'dana@example.com', joined: 'Nov 15, 2024', listings: 2, sales: 4, status: 'active', verified: true },
  { id: 'U-003', name: 'Ron Shapiro', email: 'ron@example.com', joined: 'Dec 8, 2024', listings: 0, sales: 0, status: 'suspended', verified: false },
  { id: 'U-004', name: 'Michal Levi', email: 'michal@example.com', joined: 'Oct 30, 2024', listings: 8, sales: 31, status: 'active', verified: true },
];

const PENDING_LISTINGS = [
  { id: 'L-301', event: 'Omer Adam – Jerusalem', seller: 'Amir B.', price: 290, qty: 4, submitted: '2h ago' },
  { id: 'L-302', event: 'Haifa International Film Festival', seller: 'Sara T.', price: 120, qty: 2, submitted: '4h ago' },
];

type Tab = 'overview' | 'users' | 'listings';

export default function AdminPanelPage() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform management and oversight</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 mb-8 w-fit">
          {(['overview', 'users', 'listings'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map(s => (
                <div key={s.label} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.change}</div>
                </div>
              ))}
            </div>

            {/* Pending listings */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Pending approval</h2>
              <div className="space-y-3">
                {PENDING_LISTINGS.map(l => (
                  <div key={l.id} className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{l.event}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{l.seller} · ₪{l.price} · {l.qty} tickets · {l.submitted}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                        <CheckCircle className="w-3 h-3" /> Approve
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/5">
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm">All users</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {USERS.map(u => (
                <div key={u.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm shrink-0">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</p>
                      {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      {u.status === 'suspended' && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-md font-semibold">Suspended</span>}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{u.email} · Joined {u.joined}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 shrink-0">
                    <span>{u.listings} listings</span>
                    <span>{u.sales} sales</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings tab */}
        {tab === 'listings' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Listings requiring review</h2>
            <div className="space-y-3">
              {PENDING_LISTINGS.map(l => (
                <div key={l.id} className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{l.event}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {l.id} · Seller: {l.seller} · ₪{l.price} × {l.qty} tickets · Submitted {l.submitted}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                    <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
