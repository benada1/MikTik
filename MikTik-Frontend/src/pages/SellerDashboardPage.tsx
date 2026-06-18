import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Eye, Trash2, CheckCircle, Clock, ShieldCheck, Ticket, ArrowRight, MapPin, Calendar } from 'lucide-react';

const API = 'http://localhost:5000/api';

interface Listing {
  id: string;
  name: string;
  category: string;
  date: string;
  venue: string;
  city: string;
  price: number;
  available: number;
  status: 'active' | 'sold' | 'pending';
  views: number;
}

const STATUS_CFG = {
  active:  { label: 'Active',   icon: CheckCircle, classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
  sold:    { label: 'Sold out', icon: TrendingUp,  classes: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' },
  pending: { label: 'Pending',  icon: Clock,       classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
};

export default function SellerDashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('tt_token');
    fetch(`${API}/tickets/my`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data =>
        setListings(
          (data.tickets || []).map((t: any) => ({
            id: t.id ?? t._id,
            name: t.name,
            category: t.category,
            date: t.date,
            venue: t.venue,
            city: t.city,
            price: t.price,
            available: t.available,
            status: t.status,
            views: t.views ?? 0,
          }))
        )
      )
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this listing?')) return;
    setDeleting(id);
    const token = localStorage.getItem('tt_token');
    try {
      const res = await fetch(`${API}/tickets/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setListings(prev => prev.filter(l => l.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const totalEarned = listings
    .filter(l => l.status === 'sold')
    .reduce((s, l) => s + l.price, 0);

  const active = listings.filter(l => l.status === 'active').length;

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
            { label: 'Total listings', value: listings.length },
            { label: 'Active',         value: active },
            { label: 'Total views',    value: listings.reduce((s, l) => s + l.views, 0) },
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
            Earnings are held in escrow and released once buyers confirm receipt.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No listings yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">List your first ticket and start selling.</p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> List a ticket <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(l => {
              const cfg = STATUS_CFG[l.status] ?? STATUS_CFG.active;
              const StatusIcon = cfg.icon;
              const eventDate = l.date
                ? new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—';
              return (
                <div key={l.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{l.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.classes}`}>
                          <StatusIcon className="w-3 h-3" />{cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Calendar className="w-3 h-3" />{eventDate}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <MapPin className="w-3 h-3" />{l.city} · {l.venue}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(l.id)}
                      disabled={deleting === l.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white">₪{l.price}</span>
                    <span>{l.available} remaining</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views} views</span>
                    <Link
                      to={`/ticket/${l.id}`}
                      className="ml-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                    >
                      View listing
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
