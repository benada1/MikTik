import { useState } from 'react';
import { Users, Ticket, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye, Ban } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '12,847', change: '+234 this week', icon: <Users className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50' },
  { label: 'Active Listings', value: '3,241', change: '+89 today', icon: <Ticket className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
  { label: 'Transactions', value: '₪2.4M', change: '+₪84K today', icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
  { label: 'Open Disputes', value: '14', change: '3 urgent', icon: <AlertTriangle className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50' },
];

const pendingListings = [
  { id: 'L-301', event: 'Haifa Comedy Night', seller: 'Shira T.', price: 80, qty: 3, submitted: '2h ago', verified: false },
  { id: 'L-302', event: 'Beer Sheva Jazz Festival', seller: 'Amos K.', price: 120, qty: 5, submitted: '5h ago', verified: true },
  { id: 'L-303', event: 'Eilat Beach Party', seller: 'New Seller', price: 250, qty: 10, submitted: '8h ago', verified: false },
];

const recentUsers = [
  { name: 'Yossi Cohen', email: 'yossi@example.com', role: 'seller', joined: 'Dec 10', status: 'active', sales: 5 },
  { name: 'Dana Levi', email: 'dana@example.com', role: 'buyer', joined: 'Dec 11', status: 'active', sales: 0 },
  { name: 'New User', email: 'spam@test.com', role: 'seller', joined: 'Dec 12', status: 'flagged', sales: 0 },
];

const tabs = ['Overview', 'Listings', 'Users', 'Disputes'];

export default function AdminPanelPage() {
  const [tab, setTab] = useState('Overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Platform management & moderation</p>
        </div>
        <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Admin Access
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-green-600 mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending approvals */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Pending Listings</h2>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{pendingListings.length} waiting</span>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingListings.map(l => (
                <div key={l.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-slate-400">{l.id}</span>
                        {l.verified ? (
                          <span className="text-xs text-green-600 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Verified seller</span>
                        ) : (
                          <span className="text-xs text-orange-600 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" /> Unverified</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900">{l.event}</p>
                      <p className="text-xs text-slate-500">{l.seller} · ₪{l.price} × {l.qty} · {l.submitted}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Recent Users</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentUsers.map(u => (
                <div key={u.email} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900">{u.name}</p>
                        {u.status === 'flagged' && (
                          <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">flagged</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{u.email} · {u.role} · joined {u.joined}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {u.status === 'flagged' && (
                      <button className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Listings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">All Listings — Pending Review</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingListings.map(l => (
              <div key={l.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400">{l.id}</span>
                  <p className="text-sm font-semibold text-slate-900">{l.event}</p>
                  <p className="text-xs text-slate-500">by {l.seller} · ₪{l.price} each · {l.qty} tickets</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${l.verified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {l.verified ? 'Verified' : 'Review needed'}
                  </span>
                  <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors">Approve</button>
                  <button className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">User Management</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentUsers.map(u => (
              <div key={u.email} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email} · Role: {u.role} · Sales: {u.sales}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.status}
                  </span>
                  <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Disputes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-orange-300" />
          <p className="font-medium text-slate-600">14 open disputes</p>
          <p className="text-sm mt-1">3 marked urgent — requires immediate review</p>
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            View All Disputes
          </button>
        </div>
      )}
    </div>
  );
}
