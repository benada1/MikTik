import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ShieldCheck, Upload, Info } from 'lucide-react';

const categories = ['Concert', 'Sports', 'Theater', 'Festival', 'Comedy', 'Other'];
const cities = ['Tel Aviv', 'Jerusalem', 'Haifa', 'Caesarea', 'Beer Sheva', 'Eilat', 'Other'];

export default function SellTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventName: '', category: '', date: '', venue: '', city: '',
    price: '', qty: '1', description: '', ticketType: 'digital',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Listing Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your ticket listing is under review. It will be live within 1 hour after verification.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm({ eventName: '', category: '', date: '', venue: '', city: '', price: '', qty: '1', description: '', ticketType: 'digital' }); }}
              className="text-sm font-medium text-indigo-600 border border-indigo-200 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              List Another
            </button>
            <button
              onClick={() => navigate('/seller-dashboard')}
              className="text-sm font-medium text-white bg-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">List Your Tickets</h1>
        <p className="text-slate-500 text-sm mt-1">Reach thousands of verified buyers safely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Event Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-indigo-600" />
                Event Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Name *</label>
                  <input
                    type="text"
                    value={form.eventName}
                    onChange={e => update('eventName', e.target.value)}
                    placeholder="e.g. Eyal Golan Live Concert"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => update('category', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    >
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => update('date', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Venue *</label>
                    <input
                      type="text"
                      value={form.venue}
                      onChange={e => update('venue', e.target.value)}
                      placeholder="Venue name"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                    <select
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    >
                      <option value="">Select...</option>
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Pricing & Quantity</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per Ticket (₪) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">₪</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => update('price', e.target.value)}
                      placeholder="0"
                      required
                      min="1"
                      className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Tickets *</label>
                  <input
                    type="number"
                    value={form.qty}
                    onChange={e => update('qty', e.target.value)}
                    min="1"
                    max="20"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Type */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Ticket Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'digital', label: 'Digital / PDF', desc: 'Auto-transferred on sale' },
                  { val: 'physical', label: 'Physical', desc: 'Arrange handoff with buyer' },
                ].map(t => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => update('ticketType', t.val)}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      form.ticketType === t.val
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">{t.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload */}
            {form.ticketType === 'digital' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Upload Tickets
                </h2>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Drop PDF tickets here</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse — PDF, PNG up to 10MB</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Seat section, row, any special details..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {loading ? 'Submitting...' : 'List Tickets for Sale'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-indigo-900">Seller Protection</h3>
            </div>
            <ul className="space-y-2 text-xs text-indigo-700">
              <li>✓ Funds held in escrow until buyer confirms</li>
              <li>✓ Anti-chargeback protection</li>
              <li>✓ Dispute mediation available</li>
              <li>✓ Verified buyer guarantee</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Fee Structure</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Platform fee</span>
                <span className="font-medium">5%</span>
              </div>
              <div className="flex justify-between">
                <span>Payment processing</span>
                <span className="font-medium">2.5%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Escrow service</span>
                <span>Included</span>
              </div>
              <hr className="border-slate-100 my-1" />
              {form.price && (
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>You receive</span>
                  <span>₪{Math.floor(Number(form.price) * 0.925)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
