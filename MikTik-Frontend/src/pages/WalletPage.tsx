import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, Plus, Banknote, CreditCard } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TXN-001', type: 'credit', label: 'Ticket Sale — Eyal Golan', amount: 406, date: 'Dec 10, 2024', status: 'completed' },
  { id: 'TXN-002', type: 'debit',  label: 'Purchase — Tel Aviv Music Festival', amount: 616, date: 'Dec 8, 2024',  status: 'completed' },
  { id: 'TXN-003', type: 'credit', label: 'Ticket Sale — New Year Eve Party (2×)', amount: 700, date: 'Dec 5, 2024',  status: 'pending' },
  { id: 'TXN-004', type: 'debit',  label: 'Withdrawal to bank account', amount: 900, date: 'Dec 1, 2024',  status: 'completed' },
  { id: 'TXN-005', type: 'credit', label: 'Ticket Sale — Jerusalem Ballet', amount: 185, date: 'Nov 28, 2024', status: 'completed' },
];

const balance = 1291;

export default function WalletPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wallet</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your balance and transactions</p>
        </div>

        {/* Balance card */}
        <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full" />
          </div>
          <div className="relative">
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">Available balance</p>
            <p className="text-4xl font-bold text-white mb-1">₪{balance.toLocaleString()}</p>
            <p className="text-indigo-300 text-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Escrow-protected funds
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowAdd(true); setShowWithdraw(false); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20 rounded-xl text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> Add funds
              </button>
              <button
                onClick={() => { setShowWithdraw(true); setShowAdd(false); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20 rounded-xl text-white text-sm font-semibold transition-colors"
              >
                <Banknote className="w-4 h-4" /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Add / Withdraw panel */}
        {(showAdd || showWithdraw) && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
              {showAdd ? 'Add funds' : 'Withdraw funds'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Amount (₪)</label>
                <input
                  type="number"
                  placeholder="500"
                  min="1"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              {showAdd && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Payment method</label>
                  <div className="flex gap-2">
                    {['Credit card', 'Bank transfer', 'PayPal'].map(m => (
                      <button key={m} className="flex-1 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition-colors">
                  Confirm
                </button>
                <button onClick={() => { setShowAdd(false); setShowWithdraw(false); }} className="px-4 py-2.5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: ArrowDownLeft, label: 'Total earned', value: `₪${(406+700+185).toLocaleString()}`, color: 'text-emerald-600 dark:text-emerald-400' },
            { icon: ArrowUpRight, label: 'Total spent', value: `₪${(616).toLocaleString()}`, color: 'text-red-500 dark:text-red-400' },
            { icon: CreditCard, label: 'Pending', value: '₪700', color: 'text-amber-600 dark:text-amber-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
              <s.icon className={`w-4 h-4 mb-2 ${s.color}`} />
              <div className="text-base font-bold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Transaction history */}
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Transaction history</h2>
          <div className="space-y-2">
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {tx.type === 'credit'
                    ? <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    : <ArrowUpRight className="w-4 h-4 text-red-500 dark:text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tx.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{tx.date} · {tx.id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₪{tx.amount}
                  </p>
                  <p className={`text-xs ${tx.status === 'pending' ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
