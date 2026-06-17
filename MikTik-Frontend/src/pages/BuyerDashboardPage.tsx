import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, Clock, CheckCircle, XCircle, Star, Download, AlertCircle } from 'lucide-react';

const purchases = [
  {
    id: 'TT-1001',
    event: 'Tel Aviv Music Festival',
    date: 'Dec 15, 2024',
    venue: 'Yarkon Park',
    seller: 'Yossi M.',
    sellerRating: 4.9,
    price: 280,
    qty: 2,
    status: 'confirmed',
    escrow: 'released',
  },
  {
    id: 'TT-1002',
    event: 'Maccabi TLV vs Hapoel',
    date: 'Dec 18, 2024',
    venue: 'Bloomfield Stadium',
    seller: 'Dana K.',
    sellerRating: 4.7,
    price: 95,
    qty: 1,
    status: 'pending',
    escrow: 'held',
  },
  {
    id: 'TT-1003',
    event: 'Omer Adam Tour',
    date: 'Jan 20, 2025',
    venue: 'Caesarea Amphitheatre',
    seller: 'Lior D.',
    sellerRating: 4.8,
    price: 310,
    qty: 2,
    status: 'transfer',
    escrow: 'held',
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
  pending: { label: 'Pending Transfer', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" /> },
  transfer: { label: 'In Transfer', color: 'bg-blue-100 text-blue-700', icon: <ShieldCheck className="w-4 h-4" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> },
};

const stats = [
  { label: 'Total Purchases', value: '3', icon: <Ticket className="w-5 h-5 text-indigo-600" /> },
  { label: 'Confirmed Tickets', value: '2', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
  { label: 'Escrow Protected', value: '₪810', icon: <ShieldCheck className="w-5 h-5 text-blue-600" /> },
  { label: 'Total Spent', value: '₪1,090', icon: <Star className="w-5 h-5 text-amber-500" /> },
];

export default function BuyerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tickets</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, Yossi 👋</p>
        </div>
        <Link
          to="/marketplace"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          Browse Marketplace
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-slate-50 p-2 rounded-lg">{s.icon}</div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Escrow Notice */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-indigo-900">Your funds are protected</p>
          <p className="text-xs text-indigo-700 mt-0.5">
            ₪810 is held in escrow for pending transactions. Funds release automatically once you confirm ticket receipt.
          </p>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Purchase History</h2>
          <span className="text-xs text-slate-400">{purchases.length} orders</span>
        </div>

        <div className="divide-y divide-slate-100">
          {purchases.map(p => {
            const status = statusConfig[p.status];
            return (
              <div key={p.id} className="px-6 py-5 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">{p.id}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      {p.escrow === 'held' && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Escrow
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 truncate">{p.event}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{p.date} · {p.venue}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {p.seller[0]}
                      </div>
                      <span className="text-xs text-slate-600">{p.seller}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-slate-500">{p.sellerRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₪{p.price * p.qty}</div>
                      <div className="text-xs text-slate-400">{p.qty}x ₪{p.price}</div>
                    </div>
                    <div className="flex gap-2">
                      {p.status === 'confirmed' && (
                        <button className="flex items-center gap-1 text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          Tickets
                        </button>
                      )}
                      {p.status === 'transfer' && (
                        <button className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Confirm Receipt
                        </button>
                      )}
                      {p.status === 'pending' && (
                        <Link to="/dispute-center" className="flex items-center gap-1 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Issue?
                        </Link>
                      )}
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
