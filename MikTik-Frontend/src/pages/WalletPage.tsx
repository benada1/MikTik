import { useState } from 'react';
import { CreditCard, ArrowDownLeft, ArrowUpRight, ShieldCheck, Plus, Banknote } from 'lucide-react';

const transactions = [
  { id: 'TXN-001', type: 'credit', label: 'Ticket Sale — Eyal Golan', amount: 406, date: 'Dec 10, 2024', status: 'completed' },
  { id: 'TXN-002', type: 'debit', label: 'Purchase — Tel Aviv Music Festival', amount: -294, date: 'Dec 8, 2024', status: 'completed' },
  { id: 'TXN-003', type: 'credit', label: 'Ticket Sale — Maccabi TLV', amount: 184, date: 'Dec 5, 2024', status: 'completed' },
  { id: 'TXN-004', type: 'debit', label: 'Withdrawal to Bank', amount: -500, date: 'Dec 1, 2024', status: 'completed' },
  { id: 'TXN-005', type: 'escrow', label: 'Escrow — New Year Party Tickets', amount: 700, date: 'Nov 28, 2024', status: 'pending' },
];

export default function WalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [tab, setTab] = useState<'overview' | 'withdraw' | 'topup'>('overview');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Wallet</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your funds and transactions</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 sm:col-span-2">
          <p className="text-indigo-200 text-sm mb-1">Available Balance</p>
          <div className="text-4xl font-bold mb-4">₪796</div>
          <div className="flex gap-3">
            <button
              onClick={() => setTab('withdraw')}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </button>
            <button
              onClick={() => setTab('topup')}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Top Up
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-500">In Escrow</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₪700</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="w-4 h-4 text-green-500" />
              <span className="text-xs text-slate-500">Total Earned</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₪1,296</div>
          </div>
        </div>
      </div>

      {/* Withdraw / Top Up forms */}
      {tab !== 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          {tab === 'withdraw' && (
            <>
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                Withdraw Funds
              </h2>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₪)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    max={796}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Available: ₪796</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Bank Account (IBAN)</label>
                  <input
                    type="text"
                    placeholder="IL000000000000000000"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTab('overview')}
                    className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                    Withdraw
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === 'topup' && (
            <>
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Top Up Wallet
              </h2>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₪)</label>
                  <div className="flex gap-2 mb-2">
                    {[100, 250, 500, 1000].map(a => (
                      <button
                        key={a}
                        className="flex-1 border border-slate-200 text-slate-600 text-sm py-1.5 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        ₪{a}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Or enter custom amount"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CVV</label>
                    <input type="text" placeholder="•••" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setTab('overview')} className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                    Add Funds
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Transaction History</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.map(t => (
            <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  t.type === 'credit' ? 'bg-green-100' : t.type === 'escrow' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> :
                   t.type === 'escrow' ? <ShieldCheck className="w-4 h-4 text-blue-600" /> :
                   <ArrowUpRight className="w-4 h-4 text-red-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.date} · {t.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  t.type === 'credit' ? 'text-green-600' : t.type === 'escrow' ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {t.type === 'credit' ? '+' : t.type === 'escrow' ? '' : ''}₪{Math.abs(t.amount)}
                </div>
                <div className={`text-xs ${t.status === 'pending' ? 'text-yellow-600' : 'text-slate-400'}`}>
                  {t.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
