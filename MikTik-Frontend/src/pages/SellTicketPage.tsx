import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Upload, Info, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Concert', 'Sports', 'Theater', 'Festival', 'Comedy', 'Other'];

const inputClass = "w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";
const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2";

export default function SellTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    event: '', category: '', date: '', venue: '', city: '',
    section: '', row: '', qty: '1', price: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Listing submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Your ticket listing is under review and will go live within a few minutes.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/seller-dashboard')} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors">
              View my listings
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ event: '', category: '', date: '', venue: '', city: '', section: '', row: '', qty: '1', price: '', description: '' }); }} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors hover:bg-slate-200 dark:hover:bg-zinc-800">
              List another ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sell a ticket</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">List your ticket securely. We handle escrow and payment.</p>
        </div>

        {/* Escrow notice */}
        <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-8">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1">Seller protection included</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
              Buyers pay into escrow. Funds are released to you once they confirm receipt. Zero fraud risk.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event info */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-5">Event information</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Event name</label>
                <input type="text" value={form.event} onChange={set('event')} placeholder="e.g. Tel Aviv Music Festival" required className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={form.category} onChange={set('category')} required className={inputClass}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Event date</label>
                  <input type="date" value={form.date} onChange={set('date')} required className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Venue</label>
                  <input type="text" value={form.venue} onChange={set('venue')} placeholder="Yarkon Park" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={form.city} onChange={set('city')} placeholder="Tel Aviv" required className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket details */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-5">Ticket details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Section</label>
                  <input type="text" value={form.section} onChange={set('section')} placeholder="GA Floor" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Row</label>
                  <input type="text" value={form.row} onChange={set('row')} placeholder="A" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Qty</label>
                  <select value={form.qty} onChange={set('qty')} className={inputClass}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Price per ticket (₪)</label>
                <input type="number" value={form.price} onChange={set('price')} placeholder="250" min="1" required className={inputClass} />
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3" /> A 5% service fee is deducted from each sale.
                </p>
              </div>
              <div>
                <label className={labelClass}>Description (optional)</label>
                <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Describe the seats, view, or any other details buyers should know..." className={`${inputClass} resize-none`} />
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">Ticket files</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Upload your ticket files. They will be held securely and only released to the buyer after payment is confirmed.</p>
            <label className="flex flex-col items-center justify-center gap-2 h-28 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all">
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Drop files here or <span className="text-indigo-600 dark:text-indigo-400 font-medium">click to upload</span></span>
              <span className="text-xs text-slate-400">PDF, PNG, JPG up to 10MB</span>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" multiple />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {loading ? 'Submitting...' : 'List ticket for sale'}
          </button>
        </form>
      </div>
    </div>
  );
}
