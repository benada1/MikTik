import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Calendar, Ticket, ArrowLeft, CheckCircle, Lock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';

const API = 'http://localhost:5000/api';

interface TicketDetail {
  id: string;
  category: string;
  name: string;
  date: string;
  month: string;
  day: string;
  startTime?: string;
  venue: string;
  city: string;
  price: number;
  originalPrice: number;
  discount: number;
  seller: string | null;
  sellerName: string;
  sellerRating: number;
  sellerReviews: number;
  sellerSince: string;
  available: number;
  section: string;
  row: string;
  description: string;
  bundleOnly: boolean;
  files?: string[];
}

const CAT_GRADIENT: Record<string, string> = {
  Concert: 'from-violet-950 via-purple-900 to-indigo-950',
  Sports: 'from-emerald-950 via-green-900 to-teal-950',
  Theater: 'from-rose-950 via-red-900 to-pink-950',
  Festival: 'from-orange-950 via-amber-900 to-yellow-950',
  Comedy: 'from-yellow-900 via-amber-800 to-orange-950',
};

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { fetchNotifications } = useNotifications();

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [bought, setBought] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    const token = localStorage.getItem('tt_token');
    fetch(`${API}/tickets/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (data?.ticket) {
          setTicket(data.ticket);
          if (data.ticket.bundleOnly) setQty(data.ticket.available);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return; }
    setBuying(true);
    setBuyError('');
    try {
      const token = localStorage.getItem('tt_token');
      const res = await fetch(`${API}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ticketId: id, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('ticketDetails.purchaseFailed'));
      setBought(true);
      setTicket(prev => prev ? { ...prev, available: prev.available - qty } : prev);
      fetchNotifications();
    } catch (err: any) {
      setBuyError(err.message || t('ticketDetails.somethingWrong'));
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-56 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-40 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('ticketDetails.notFound')}</p>
          <Link to="/marketplace" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            {t('ticketDetails.backToMarketplaceLink')}
          </Link>
        </div>
      </div>
    );
  }

  const gradient = CAT_GRADIENT[ticket.category] || CAT_GRADIENT['Concert'];
  const fee = Math.round(ticket.price * qty * 0.05);
  const total = ticket.price * qty + fee;
  const isOwnTicket = user && ticket.seller && ticket.seller === user.id;
  const dateLabel = ticket.date
    ? new Date(ticket.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : `${ticket.month} ${ticket.day}`;
  const dateTimeLabel = ticket.startTime ? `${dateLabel} · ${ticket.startTime}` : dateLabel;

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('ticketDetails.backToMarketplace')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Hero card */}
            <div className={`relative h-56 rounded-2xl overflow-hidden bg-linear-to-br ${gradient}`}>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-4 right-4 text-center bg-black/30 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{ticket.month}</div>
                <div className="text-2xl font-black text-white leading-none">{ticket.day}</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-white/70 bg-white/10 border border-white/10 px-2 py-0.5 rounded-md">{ticket.category}</span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> {t('ticketDetails.verifiedListing')}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{ticket.name}</h1>
              </div>
            </div>

            {/* Details card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">{t('ticketDetails.eventDetails')}</h2>
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: dateTimeLabel },
                  { icon: MapPin, label: `${ticket.venue}, ${ticket.city}` },
                  { icon: Ticket, label: `${t('ticketDetails.section')} ${ticket.section}${ticket.row ? ` · ${t('ticketDetails.row')} ${ticket.row}` : ''}` },
                  { icon: Users, label: `${ticket.available} ${ticket.available !== 1 ? t('ticketDetails.tickets') : t('ticketDetails.ticket')} ${t('ticketDetails.available')}` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
              {ticket.description && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/5">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">{t('ticketDetails.aboutListing')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{ticket.description}</p>
                </div>
              )}
            </div>

            {/* Seller card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">{t('ticketDetails.seller')}</h2>
              <div className="flex items-center gap-4">
                <Link
                  to={ticket.seller ? `/seller/${ticket.seller}` : '#'}
                  className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0 hover:ring-2 hover:ring-indigo-400 transition-all"
                >
                  {(ticket.sellerName || 'U')[0]}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ticket.seller ? (
                      <Link
                        to={`/seller/${ticket.seller}`}
                        className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {ticket.sellerName || t('ticketDetails.unknownSeller')}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-900 dark:text-white">{ticket.sellerName || t('ticketDetails.unknownSeller')}</span>
                    )}
                    <span className="flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5" /> {t('ticketDetails.idVerified')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= Math.round(ticket.sellerRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{ticket.sellerRating}</span>
                    <span className="text-xs text-slate-400">({ticket.sellerReviews} {t('ticketDetails.reviews')})</span>
                    {ticket.sellerSince && <span className="text-xs text-slate-400 ml-1">· {t('ticketDetails.memberSince')} {ticket.sellerSince}</span>}
                  </div>
                  {ticket.seller && (
                    <Link
                      to={`/seller/${ticket.seller}`}
                      className="inline-block mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      View seller profile →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm">{t('ticketDetails.guarantee')}</h3>
              </div>
              <ul className="space-y-2">
                {[
                  t('ticketDetails.guarantee1'),
                  t('ticketDetails.guarantee2'),
                  t('ticketDetails.guarantee3'),
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-indigo-700 dark:text-indigo-300">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Purchase card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">

              {bought ? (
                <div className="py-4">
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('ticketDetails.purchaseConfirmed')}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {qty > 1 ? t('ticketDetails.purchaseDescMulti') : t('ticketDetails.purchaseDescSingle')}
                    </p>
                  </div>
                  {ticket.files && ticket.files.length > 0 && (
                    <div className="mb-5 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('ticketDetails.ticketFiles')}</p>
                      {ticket.files.map((f, i) => {
                        const url = `http://localhost:5000${f}`;
                        const isImage = /\.(png|jpg|jpeg)$/i.test(f);
                        return isImage ? (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt={`Ticket ${i + 1}`} className="w-full rounded-xl border border-slate-200 dark:border-white/10 object-cover max-h-40" />
                          </a>
                        ) : (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                          >
                            {t('ticketDetails.downloadFile')} {i + 1}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  <button
                    onClick={() => navigate('/buyer-dashboard')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    {t('ticketDetails.viewMyTickets')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">₪{ticket.price}</span>
                    {ticket.discount > 0 && (
                      <>
                        <span className="text-sm text-slate-400 line-through">₪{ticket.originalPrice}</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">-{ticket.discount}%</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">{t('ticketDetails.perTicket')}</p>

                  {ticket.bundleOnly && ticket.available > 1 ? (
                    <div className="mb-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 px-4 py-3 flex items-start gap-2">
                      <Users className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">{t('ticketDetails.bundleBadge')}</p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{t('ticketDetails.bundleNotice')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('ticketDetails.quantity')}</label>
                      <select
                        value={qty}
                        onChange={e => setQty(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {Array.from({ length: Math.min(ticket.available, 8) }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>{n} {n > 1 ? t('ticketDetails.tickets') : t('ticketDetails.ticket')}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Price breakdown */}
                  <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3.5 mb-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>₪{ticket.price} × {qty}</span>
                      <span>₪{ticket.price * qty}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{t('ticketDetails.serviceFee')}</span>
                      <span>₪{fee}</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-white/10 pt-2 flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{t('ticketDetails.total')}</span>
                      <span>₪{total}</span>
                    </div>
                  </div>

                  {buyError && (
                    <p className="text-xs text-red-600 dark:text-red-400 mb-3 text-center">{buyError}</p>
                  )}

                  {isOwnTicket ? (
                    <div className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 text-sm text-center font-semibold">
                      {t('ticketDetails.ownListing')}
                    </div>
                  ) : ticket.available === 0 ? (
                    <div className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 text-sm text-center font-semibold">
                      {t('ticketDetails.soldOut')}
                    </div>
                  ) : (
                    <button
                      onClick={handleBuy}
                      disabled={buying}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mb-3 text-sm"
                    >
                      {buying ? t('ticketDetails.processing') : t('ticketDetails.buyNow')}
                    </button>
                  )}

                  {!isOwnTicket && ticket.available > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <Lock className="w-3 h-3" />
                      {t('ticketDetails.encrypted')}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
