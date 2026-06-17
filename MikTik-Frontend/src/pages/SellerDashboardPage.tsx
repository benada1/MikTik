import { Link } from 'react-router-dom';
import { Plus, Ticket, TrendingUp, Eye, Edit, Trash2, CheckCircle, Clock, Star, ShieldCheck } from 'lucide-react';

const listings = [
  { id: 'L-201', event: 'New Year Eve Party 2025', date: 'Dec 31, 2024', venue: 'TLV Port', price: 350, qty: 4, sold: 2, status: 'active', views: 87 },
  { id: 'L-202', event: 'Eyal Golan Live', date: 'Jan 5, 2025', venue: 'Menora Mivtachim Arena', price: 220, qty: 2, sold: 2, status: 'sold-out', views: 143 },
  { id: 'L-203', event: 'Israel vs Portugal - Football', date: 'Jan 10, 2025', venue: 'Teddy Stadium', price: 140, qty: 6, sold: 1, status: 'active', views: 52 },
];

const stats = [
  { label: 'Total Listings', value: '3', icon: <Ticket className="w-5 h-5 text-indigo-600" /> },
  { label: 'Total Sales', value: '5', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
  { label: 'Revenue', value: '₪1,180', icon: <TrendingUp className="w-5 h-5 text-blue-600" /> },
  { label: 'Seller Rating', value: '4.9', icon: <Star className="w-5 h-5 text-amber-500" /> },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  'sold-out': { label: 'Sold Out', color: 'bg-slate-100 text-slate-500' },
  pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700' },
};

export default function SellerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your ticket listings</p>
        </div>
        <Link
          to="/sell"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Listing
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

      {/* Pending Payouts */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-900">Payout Ready</p>
          <p className="text-xs text-green-700 mt-0.5">
            ₪490 is ready to be withdrawn. Funds released after buyer confirmation.
          </p>
        </div>
        <button className="ml-auto text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
          Withdraw
        </button>
      </div>

      {/* Listings */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">My Listings</h2>
          <span className="text-xs text-slate-400">{listings.length} listings</span>
        </div>

        <div className="divide-y divide-slate-100">
          {listings.map(l => {
            const s = statusConfig[l.status];
            return (
              <div key={l.id} className="px-6 py-5 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">{l.id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 truncate">{l.event}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{l.date} · {l.venue}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{l.views} views</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{l.sold}/{l.qty} sold</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₪{l.price}</div>
                      <div className="text-xs text-slate-400">per ticket</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
