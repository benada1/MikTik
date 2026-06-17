import { useState } from 'react';
import { AlertTriangle, ShieldCheck, Clock, CheckCircle, MessageSquare, Plus } from 'lucide-react';

const disputes = [
  {
    id: 'DSP-001', orderId: 'TT-1002', event: 'Maccabi TLV vs Hapoel Jerusalem',
    reason: 'Tickets not received after 48 hours', status: 'open', date: 'Dec 12, 2024',
    amount: 95, lastUpdate: '2 hours ago',
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" /> },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  closed: { label: 'Closed', color: 'bg-slate-100 text-slate-500', icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

const reasons = [
  'Tickets not received',
  'Tickets are invalid/fake',
  'Wrong tickets sent',
  'Seller unresponsive',
  'Refund not processed',
  'Other',
];

export default function DisputeCenterPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: '', reason: '', details: '' });

  const update = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dispute Center</h1>
          <p className="text-slate-500 text-sm mt-1">We mediate and protect every transaction</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Open Dispute
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-indigo-900">You're protected by TickeTrust</p>
          <p className="text-xs text-indigo-700 mt-1">
            All transactions are escrow-protected. If something goes wrong, open a dispute and our team will investigate within 24 hours. Funds are held safely until resolution.
          </p>
        </div>
      </div>

      {/* New Dispute Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Open a New Dispute
          </h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Order ID</label>
              <input
                type="text"
                value={form.orderId}
                onChange={e => update('orderId', e.target.value)}
                placeholder="e.g. TT-1002"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
              <select
                value={form.reason}
                onChange={e => update('reason', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="">Select a reason...</option>
                {reasons.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Details</label>
              <textarea
                value={form.details}
                onChange={e => update('details', e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Disputes */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">My Disputes</h2>
        </div>

        {disputes.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-300" />
            <p className="font-medium">No active disputes</p>
            <p className="text-sm">All your transactions are in good standing</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {disputes.map(d => {
              const s = statusConfig[d.status];
              return (
                <div key={d.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{d.id}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900">{d.event}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Order: {d.orderId} · {d.date}</p>
                      <p className="text-sm text-slate-600 mt-2">{d.reason}</p>
                      <p className="text-xs text-slate-400 mt-1">Last update: {d.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₪{d.amount}</div>
                      <button className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How disputes work */}
      <div className="mt-6 bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">How Disputes Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Open a Dispute', desc: 'Submit your issue with order details and evidence.' },
            { step: '2', title: 'We Investigate', desc: 'Our team reviews both sides within 24 hours.' },
            { step: '3', title: 'Resolution', desc: 'Funds refunded or released based on our findings.' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{s.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
