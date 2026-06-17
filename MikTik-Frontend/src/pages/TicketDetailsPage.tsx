import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Calendar, Ticket, ArrowLeft, CheckCircle, Lock, Users, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

interface TicketDetail {
  id: string;
  category: string;
  name: string;
  date: string;
  month: string;
  day: string;
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
  instant: boolean;
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
        if (data?.ticket) setTicket(data.ticket);
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
      if (!res.ok) throw new Error(data.error || 'Purchase failed');
      setBought(true);
      // Refresh ticket to reflect updated available count
      setTicket(prev => prev ? { ...prev, available: prev.available - qty } : prev);
    } catch (err: any) {
      setBuyError(err.message || 'Something went wrong');
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
          <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Ticket not found</p>
          <Link to="/marketplace" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to Marketplace
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

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
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
                    <ShieldCheck className="w-3 h-3" /> Verified Listing
                  </span>
                  {ticket.instant && (
                    <span className="flex items-center gap-1 text-xs text-yellow-300 font-semibold">
                      <Zap className="w-3 h-3" /> Instant Transfer
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white">{ticket.name}</h1>
              </div>
            </div>

            {/* Details card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Event details</h2>
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: dateLabel },
                  { icon: MapPin, label: `${ticket.venue}, ${ticket.city}` },
                  { icon: Ticket, label: `Section: ${ticket.section}${ticket.row ? ` · Row: ${ticket.row}` : ''}` },
                  { icon: Users, label: `${ticket.available} ticket${ticket.available !== 1 ? 's' : ''} available` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
              {ticket.description && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/5">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">About this listing</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{ticket.description}</p>
                </div>
              )}
            </div>

            {/* Seller card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Seller</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                  {(ticket.sellerName || 'U')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">{ticket.sellerName || 'Unknown Seller'}</span>
                    <span className="flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5" /> ID Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= Math.round(ticket.sellerRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{ticket.sellerRating}</span>
                    <span className="text-xs text-slate-400">({ticket.sellerReviews} reviews)</span>
                    {ticket.sellerSince && <span className="text-xs text-slate-400 ml-1">· Member since {ticket.sellerSince}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm">TicketTrust Buyer Guarantee</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Payment held in escrow until tickets received',
                  'Full refund if tickets are invalid or not delivered',
                  '24/7 dispute resolution support',
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
                /* Success state */
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Purchase confirmed!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    Your ticket{qty > 1 ? 's are' : ' is'} held in escrow and will be released once delivered.
                  </p>
                  <button
                    onClick={() => navigate('/buyer-dashboard')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    View my tickets
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
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">per ticket · escrow protected</p>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Quantity</label>
                    <select
                      value={qty}
                      onChange={e => setQty(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {Array.from({ length: Math.min(ticket.available, 8) }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} ticket{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price breakdown */}
                  <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3.5 mb-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>₪{ticket.price} × {qty}</span>
                      <span>₪{ticket.price * qty}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Service fee (5%)</span>
                      <span>₪{fee}</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-white/10 pt-2 flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Total</span>
                      <span>₪{total}</span>
                    </div>
                  </div>

                  {buyError && (
                    <p className="text-xs text-red-600 dark:text-red-400 mb-3 text-center">{buyError}</p>
                  )}

                  {isOwnTicket ? (
                    <div className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 text-sm text-center font-semibold">
                      This is your listing
                    </div>
                  ) : ticket.available === 0 ? (
                    <div className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 text-sm text-center font-semibold">
                      Sold out
                    </div>
                  ) : (
                    <button
                      onClick={handleBuy}
                      disabled={buying}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mb-3 text-sm"
                    >
                      {buying ? 'Processing...' : 'Buy now — escrow protected'}
                    </button>
                  )}

                  {!isOwnTicket && ticket.available > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <Lock className="w-3 h-3" />
                      256-bit encrypted · 100% secure
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
