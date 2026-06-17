import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, Clock, CheckCircle, XCircle, Download, AlertCircle, ArrowRight } from 'lucide-react';

const PURCHASES = [
  { id: 'ORD-001', event: 'Tel Aviv Music Festival', date: 'Dec 15, 2024', venue: 'Yarkon Park', qty: 2, total: 616, status: 'confirmed', ticketId: '1' },
  { id: 'ORD-002', event: 'Maccabi TLV vs Real Madrid', date: 'Mar 15, 2025', venue: 'Menora Mivtachim Arena', qty: 1, total: 205, status: 'pending', ticketId: '5' },
  { id: 'ORD-003', event: 'Habima Theater – The Dybbuk', date: 'Mar 8, 2025', venue: 'Habima National Theatre', qty: 2, total: 525, status: 'confirmed', ticketId: '3' },
  { id: 'ORD-004', event: 'InDNegev Festival 2025', date: 'Apr 3, 2025', venue: 'Negev Desert', qty: 1, total: 336, status: 'cancelled', ticketId: '4' },
];

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', icon: CheckCircle, classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
  pending:   { label: 'Pending',   icon: Clock,         classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
  cancelled: { label: 'Cancelled', icon: XCircle,       classes: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' },
};

export default function BuyerDashboardPage() {
  const confirmed = PURCHASES.filter(p => p.status === 'confirmed').length;

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Tickets</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your purchases and order history</p>
          </div>
          <Link to="/marketplace" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            Browse tickets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total orders', value: PURCHASES.length },
            { label: 'Confirmed', value: confirmed },
            { label: 'Pending', value: PURCHASES.filter(p => p.status === 'pending').length },
            { label: 'Total spent', value: `₪${PURCHASES.filter(p => p.status !== 'cancelled').reduce((s, p) => s + p.total, 0)}` },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Escrow notice */}
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            All payments are held in escrow and released to sellers only after you confirm receipt.
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-3">
          {PURCHASES.map(order => {
            const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{order.event}</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{order.date} · {order.venue}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.classes}`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>{order.id}</span>
                        <span>{order.qty} ticket{order.qty > 1 ? 's' : ''}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">₪{order.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === 'confirmed' && (
                          <button className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium transition-colors">
                            <AlertCircle className="w-3.5 h-3.5" /> View escrow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
