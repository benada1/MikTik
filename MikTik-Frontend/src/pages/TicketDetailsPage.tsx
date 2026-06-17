import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Calendar, Ticket, ArrowLeft, CheckCircle, Lock, Users } from 'lucide-react';

const tickets: Record<string, {
  id: string; category: string; name: string; date: string; venue: string; city: string;
  price: number; originalPrice: number; seller: string; sellerRating: number; sellerReviews: number;
  sellerSince: string; available: number; section: string; row: string; description: string;
}> = {
  '1': {
    id: '1', category: 'Concert', name: 'Tel Aviv Music Festival', date: 'December 15, 2024', venue: 'Yarkon Park',
    city: 'Tel Aviv', price: 280, originalPrice: 350, seller: 'Yossi M.', sellerRating: 4.9,
    sellerReviews: 124, sellerSince: '2022', available: 12, section: 'GA Floor',
    row: 'N/A', description: 'Official tickets for the Tel Aviv Music Festival main stage. GA floor access with great view. Digital tickets transferred instantly upon payment.',
  },
  '2': {
    id: '2', category: 'Sports', name: 'Maccabi TLV vs Hapoel Jerusalem', date: 'December 18, 2024',
    venue: 'Bloomfield Stadium', city: 'Tel Aviv', price: 95, originalPrice: 120, seller: 'Dana K.',
    sellerRating: 4.7, sellerReviews: 56, sellerSince: '2023', available: 8, section: 'East Stand',
    row: 'F', description: 'Great seats in the East Stand, Row F. Home team section. Digital barcode tickets.',
  },
  '3': {
    id: '3', category: 'Theater', name: 'Jerusalem Ballet Gala', date: 'December 20, 2024',
    venue: 'Khan Theatre', city: 'Jerusalem', price: 185, originalPrice: 185, seller: 'Avi S.',
    sellerRating: 5.0, sellerReviews: 33, sellerSince: '2021', available: 5, section: 'Stalls',
    row: 'C', description: 'Premium stall seats for the Jerusalem Ballet Gala performance.',
  },
};

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const ticket = tickets[id ?? ''] ?? tickets['1'];
  const [qty, setQty] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                {ticket.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Listing
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-4">{ticket.name}</h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>{ticket.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>{ticket.venue}, {ticket.city}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Ticket className="w-5 h-5 text-indigo-500" />
                <span>Section: {ticket.section} · Row: {ticket.row}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>{ticket.available} tickets available</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="font-semibold text-slate-900 mb-2">About this listing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">About the Seller</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 flex-shrink-0">
                {ticket.seller[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{ticket.seller}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ID Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(ticket.sellerRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{ticket.sellerRating}</span>
                  <span className="text-xs text-slate-400">({ticket.sellerReviews} reviews)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Member since {ticket.sellerSince}</p>
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              TickeTrust Buyer Guarantee
            </h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Payment held in escrow until tickets received</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Full refund if tickets are invalid or not delivered</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> 24/7 dispute resolution support</li>
            </ul>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-indigo-600">₪{ticket.price}</span>
              {ticket.originalPrice > ticket.price && (
                <span className="text-sm text-slate-400 line-through">₪{ticket.originalPrice}</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-5">per ticket · escrow protected</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
              <select
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Array.from({ length: Math.min(ticket.available, 8) }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n} ticket{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1">
              <div className="flex justify-between text-sm text-slate-600">
                <span>₪{ticket.price} × {qty}</span>
                <span>₪{ticket.price * qty}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Service fee</span>
                <span>₪{Math.round(ticket.price * qty * 0.05)}</span>
              </div>
              <hr className="border-slate-200" />
              <div className="flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span>₪{Math.round(ticket.price * qty * 1.05)}</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors mb-3">
              Buy Now — Escrow Protected
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              256-bit encrypted · 100% secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
