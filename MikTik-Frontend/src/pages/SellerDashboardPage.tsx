import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Eye, Edit, Trash2, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

const LISTINGS = [
  { id: 'L-201', event: 'New Year Eve Party 2025', date: 'Dec 31, 2024', venue: 'TLV Port', price: 350, qty: 4, sold: 2, status: 'active', views: 87 },
  { id: 'L-202', event: 'Eyal Golan Live Tour', date: 'Jan 20, 2025', venue: 'Yarkon Park', price: 220, qty: 6, sold: 6, status: 'sold', views: 203 },
  { id: 'L-203', event: 'Israel vs Portugal', date: 'Jan 10, 2025', venue: 'Teddy Stadium', price: 140, qty: 3, sold: 0, status: 'pending', views: 12 },
];

const STATUS_CFG = {
  active:  { label: 'Active',  icon: CheckCircle, classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
  sold:    { label: 'Sold out',icon: TrendingUp,  classes: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' },
  pending: { label: 'Pending', icon: Clock,        classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
};

export default function SellerDashboardPage() {
  const totalEarned = LISTINGS.reduce((s, l) => s + l.price * l.sold, 0);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Listings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your tickets for sale</p>
          </div>
          <Link
            to="/sell"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> New listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total listings', value: LISTINGS.length },
            { label: 'Active',         value: LISTINGS.filter(l => l.status === 'active').length },
            { label: 'Tickets sold',   value: LISTINGS.reduce((s, l) => s + l.sold, 0) },
            { label: 'Total earned',   value: `₪${totalEarned.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Verification notice */}
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Your seller account is ID-verified. Earnings are held in escrow and released once buyers confirm receipt.
          </p>
        </div>

        {/* Listings */}
        <div className="space-y-3">
          {LISTINGS.map(l => {
            const cfg = STATUS_CFG[l.status as keyof typeof STATUS_CFG];
            const StatusIcon = cfg.icon;
            return (
              <div key={l.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{l.event}</h3>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.classes}`}>
                        <StatusIcon className="w-3 h-3" />{cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{l.date} · {l.venue}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                  <span>{l.id}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₪{l.price}</span>
                  <span>{l.sold}/{l.qty} sold</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views} views</span>
                  <span className="ml-auto font-semibold text-slate-900 dark:text-white">₪{(l.price * l.sold).toLocaleString()} earned</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
