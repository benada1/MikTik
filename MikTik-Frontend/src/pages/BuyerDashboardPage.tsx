import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, CheckCircle, Clock, XCircle, Download, ArrowRight, MapPin, Calendar, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import Pagination from '../components/Pagination';

const API = 'http://localhost:5000/api';

interface PurchasedTicket {
  id: string;
  name: string;
  category: string;
  venue: string;
  city: string;
  date: string;
  month: string;
  day: string;
  section: string;
  row: string;
}

interface Purchase {
  id: string;
  orderId: string;
  ticket: PurchasedTicket | null;
  quantity: number;
  priceEach: number;
  fee: number;
  totalPaid: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const CAT_GRADIENT: Record<string, string> = {
  Concert: 'from-violet-950 via-purple-900 to-indigo-950',
  Sports: 'from-emerald-950 via-green-900 to-teal-950',
  Theater: 'from-rose-950 via-red-900 to-pink-950',
  Festival: 'from-orange-950 via-amber-900 to-yellow-950',
  Comedy: 'from-yellow-900 via-amber-800 to-orange-950',
};

type FilterMode = 'all' | 'expired' | 'upcoming';

interface ReviewState {
  purchaseId: string;
  eventName: string;
  rating: number;
  comment: string;
  submitting: boolean;
  submitted: boolean;
}

export default function BuyerDashboardPage() {
  useEffect(() => { document.title = 'My Tickets | MikTik'; }, []);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [page, setPage] = useState(1);
  const [reviewState, setReviewState] = useState<ReviewState | null>(null);
  const { t } = useLanguage();
  const { notifications, markRead } = useNotifications();

  const PAGE_SIZE = 10;

  const STATUS_CFG = {
    confirmed: { label: t('status.confirmed'), icon: CheckCircle, classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
    pending:   { label: t('status.pending'),   icon: Clock,       classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
    cancelled: { label: t('status.cancelled'), icon: XCircle,     classes: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' },
  };

  useEffect(() => {
    const token = localStorage.getItem('tt_token');
    fetch(`${API}/purchases/my`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => setPurchases(data.purchases || []))
      .catch(() => setPurchases([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const isExpired = (p: Purchase) => {
    if (!p.ticket?.date) return false;
    return new Date(p.ticket.date) < now;
  };

  const filteredPurchases = purchases.filter(p => {
    if (filter === 'expired') return isExpired(p);
    if (filter === 'upcoming') return !isExpired(p);
    return true;
  });

  const totalPages = Math.ceil(filteredPurchases.length / PAGE_SIZE) || 1;
  const pagedPurchases = filteredPurchases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalSpent = purchases
    .filter(p => p.status !== 'cancelled')
    .reduce((sum, p) => sum + p.totalPaid, 0);

  const confirmed = purchases.filter(p => p.status === 'confirmed').length;
  const pending = purchases.filter(p => p.status === 'pending').length;

  const reviewPrompts = notifications.filter(n => n.type === 'review_prompt' && !n.read);

  const openReview = (notif: typeof notifications[0]) => {
    const relatedPurchase = purchases.find(p => p.id === notif.relatedId || String(notif.relatedId) === p.id);
    setReviewState({
      purchaseId: String(notif.relatedId),
      eventName: relatedPurchase?.ticket?.name || notif.message,
      rating: 0,
      comment: '',
      submitting: false,
      submitted: false,
    });
    markRead(notif._id);
  };

  const submitReview = async () => {
    if (!reviewState || reviewState.rating === 0) return;
    setReviewState(s => s ? { ...s, submitting: true } : s);
    try {
      const token = localStorage.getItem('tt_token');
      const res = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ purchaseId: reviewState.purchaseId, rating: reviewState.rating, comment: reviewState.comment }),
      });
      if (res.ok) setReviewState(s => s ? { ...s, submitted: true, submitting: false } : s);
      else setReviewState(s => s ? { ...s, submitting: false } : s);
    } catch {
      setReviewState(s => s ? { ...s, submitting: false } : s);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('buyer.title')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('buyer.subtitle')}</p>
          </div>
          <Link to="/marketplace" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            {t('buyer.browseTickets')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('buyer.totalOrders'), value: purchases.length },
            { label: t('buyer.confirmed'), value: confirmed },
            { label: t('buyer.pending'), value: pending },
            { label: t('buyer.totalSpent'), value: `₪${totalSpent}` },
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
            {t('buyer.escrowNotice')}
          </p>
        </div>

        {/* Review prompts */}
        {reviewPrompts.length > 0 && (
          <div className="mb-6 space-y-3">
            {reviewPrompts.map(n => (
              <button
                key={n._id}
                onClick={() => openReview(n)}
                className="w-full flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl px-5 py-4 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-left"
              >
                <Star className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Rate your experience</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.message}</p>
                </div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">Leave review →</span>
              </button>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'upcoming', 'expired'] as FilterMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => { setFilter(mode); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filter === mode
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500'
                  : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
            >
              {t(`buyer.filter.${mode}` as any)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-zinc-800 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('buyer.noTickets')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('buyer.noTicketsSub')}</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors"
            >
              {t('buyer.browseTickets')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pagedPurchases.map(order => {
              const tk = order.ticket;
              const gradient = tk ? (CAT_GRADIENT[tk.category] || CAT_GRADIENT['Concert']) : CAT_GRADIENT['Concert'];
              const eventDate = tk?.date
                ? new Date(tk.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : tk ? `${tk.month} ${tk.day}` : '—';

              return (
                <div key={order.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
                  <div className="flex">
                    {/* Gradient thumbnail */}
                    <div className={`relative w-24 sm:w-32 shrink-0 bg-linear-to-br ${gradient} flex flex-col items-center justify-center`}>
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="relative text-center px-2">
                        <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{tk?.month ?? '—'}</div>
                        <div className="text-2xl font-black text-white leading-none">{tk?.day ?? '—'}</div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0 p-4">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                            {tk?.name ?? t('buyer.unavailable')}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {tk?.city && (
                              <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                <MapPin className="w-3 h-3" />{tk.city} · {tk.venue}
                              </span>
                            )}
                            {eventDate && (
                              <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                <Calendar className="w-3 h-3" />{eventDate}
                              </span>
                            )}
                          </div>
                          {(tk?.section || tk?.row) && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              {tk.section}{tk.row ? ` · ${t('buyer.row')} ${tk.row}` : ''}
                            </p>
                          )}
                        </div>

                        {(() => {
                          const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.confirmed;
                          const Icon = cfg.icon;
                          return (
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.classes}`}>
                              <Icon className="w-3 h-3" /> {cfg.label}
                            </span>
                          );
                        })()}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono">{order.orderId}</span>
                          <span>{order.quantity} ticket{order.quantity > 1 ? 's' : ''}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">₪{order.totalPaid}</span>
                        </div>
                        {tk && (
                          <Link
                            to={`/ticket/${tk.id}`}
                            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> {t('buyer.viewTicket')}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination page={page} pages={totalPages} onPageChange={setPage} />
      </div>

      {/* Review modal */}
      {reviewState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !reviewState.submitting && setReviewState(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6">
            {reviewState.submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Thanks for your review!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Your feedback helps keep the marketplace trustworthy.</p>
                <button onClick={() => setReviewState(null)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">Close</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Rate your experience</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 line-clamp-2">{reviewState.eventName}</p>

                <div className="flex justify-center gap-2 mb-5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} onClick={() => setReviewState(s => s ? { ...s, rating: i } : s)}>
                      <Star className={`w-8 h-8 transition-colors ${i <= reviewState.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'}`} />
                    </button>
                  ))}
                </div>

                <textarea
                  value={reviewState.comment}
                  onChange={e => setReviewState(s => s ? { ...s, comment: e.target.value } : s)}
                  placeholder="Optional comment..."
                  rows={3}
                  className="w-full px-3 py-2.5 mb-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <div className="flex gap-2">
                  <button onClick={() => setReviewState(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">
                    Skip
                  </button>
                  <button
                    onClick={submitReview}
                    disabled={reviewState.rating === 0 || reviewState.submitting}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    {reviewState.submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
