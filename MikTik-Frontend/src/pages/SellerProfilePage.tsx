import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck, Star, MapPin, Calendar, ArrowLeft,
  CheckCircle, Users, MessageSquare, TrendingUp, Ticket, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const CAT_GRADIENT: Record<string, string> = {
  Concert: 'from-violet-950 via-purple-900 to-indigo-950',
  Sports: 'from-emerald-950 via-green-900 to-teal-950',
  Theater: 'from-rose-950 via-red-900 to-pink-950',
  Festival: 'from-orange-950 via-amber-900 to-yellow-950',
  Comedy: 'from-yellow-900 via-amber-800 to-orange-950',
};

interface ReviewEntry {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  ticketName: string;
  date: string;
}

interface Listing {
  id: string;
  name: string;
  category: string;
  date: string;
  venue: string;
  city: string;
  price: number;
  available: number;
}

interface EligiblePurchase {
  purchaseId: string;
  ticketName: string;
}

interface SellerProfile {
  id: string;
  name: string;
  bio: string;
  description: string;
  location: string;
  socialLinks: { instagram?: string; twitter?: string };
  verified: boolean;
  rating: number | null;
  totalReviews: number;
  totalSales: number;
  ratingVisible: boolean;
  memberSince: string;
  activeListings: Listing[];
  reviews: ReviewEntry[];
  eligiblePurchases: EligiblePurchase[];
}

function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${cls} ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
        />
      ))}
    </div>
  );
}

export default function SellerProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    document.title = profile ? `${profile.name} | MikTik` : 'Seller Profile | MikTik';
  }, [profile]);

  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState('');

  const loadProfile = async () => {
    if (!userId) return;
    const token = localStorage.getItem('tt_token');
    const r = await fetch(`${API}/sellers/profile/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (r.status === 404) { setNotFound(true); return; }
    const data = await r.json();
    if (data?.seller) {
      setProfile(data.seller);
      if (data.seller.eligiblePurchases?.length > 0 && !selectedPurchaseId) {
        setSelectedPurchaseId(data.seller.eligiblePurchases[0].purchaseId);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    loadProfile().finally(() => setLoading(false));
  }, [userId]);

  const handleSubmitReview = async () => {
    if (!reviewRating) { setReviewError('Please select a star rating.'); return; }
    if (!selectedPurchaseId) { setReviewError('No eligible purchase found.'); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      const token = localStorage.getItem('tt_token');
      const res = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ purchaseId: selectedPurchaseId, rating: reviewRating, comment: reviewComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      setReviewSuccess(true);
      await loadProfile();
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4 animate-pulse">
          <div className="h-8 w-32 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-48 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Seller not found</p>
          <Link to="/marketplace" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const canReview = !!user && profile.eligiblePurchases.length > 0 && !reviewSuccess;
  const eligiblePurchase = profile.eligiblePurchases.find(p => p.purchaseId === selectedPurchaseId);
  const reviewsRemaining = Math.max(0, 5 - profile.totalReviews);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to marketplace
        </Link>

        {/* Profile header */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 mb-4">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
              {(profile.name || 'S')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                {profile.verified && (
                  <span className="flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> ID Verified
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">{profile.bio}</p>
              )}
              {profile.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed whitespace-pre-wrap">{profile.description}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600 dark:text-slate-400">
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Member since {profile.memberSince}
                </span>
                {profile.socialLinks?.instagram && (
                  <a
                    href={`https://instagram.com/${profile.socialLinks.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-pink-500 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> @{profile.socialLinks.instagram.replace(/^@/, '')}
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a
                    href={`https://x.com/${profile.socialLinks.twitter.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-sky-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> @{profile.socialLinks.twitter.replace(/^@/, '')}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{profile.totalSales}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Total Sales</div>
            </div>

            <div className="text-center">
              {profile.ratingVisible ? (
                <>
                  <div className="flex justify-center mb-1">
                    <Stars value={Math.round(profile.rating ?? 0)} size="md" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(profile.rating ?? 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Avg. Rating</div>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-1">
                    <Star className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">New Seller</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {reviewsRemaining > 0 ? `${reviewsRemaining} review${reviewsRemaining !== 1 ? 's' : ''} to unlock` : 'Rating coming soon'}
                  </div>
                </>
              )}
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-1">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{profile.totalReviews}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Reviews</div>
            </div>
          </div>
        </div>

        {/* Rating threshold notice */}
        {!profile.ratingVisible && reviewsRemaining > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
            <TrendingUp className="w-4 h-4 shrink-0" />
            This seller needs {reviewsRemaining} more review{reviewsRemaining !== 1 ? 's' : ''} before their rating is displayed publicly ({profile.totalReviews}/5 received).
          </div>
        )}

        {/* Write a review */}
        {canReview && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Leave a Review</h2>

            {profile.eligiblePurchases.length > 1 ? (
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Select purchase to review</label>
                <select
                  value={selectedPurchaseId}
                  onChange={e => setSelectedPurchaseId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {profile.eligiblePurchases.map(p => (
                    <option key={p.purchaseId} value={p.purchaseId}>{p.ticketName}</option>
                  ))}
                </select>
              </div>
            ) : eligiblePurchase ? (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Reviewing your purchase of &ldquo;{eligiblePurchase.ticketName}&rdquo;
              </p>
            ) : null}

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(i)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        i <= (hoverRating || reviewRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Comment <span className="font-normal normal-case">(optional)</span></label>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                rows={3}
                placeholder="Share your experience with this seller…"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {reviewError && (
              <p className="text-xs text-red-600 dark:text-red-400 mb-3">{reviewError}</p>
            )}

            <button
              onClick={handleSubmitReview}
              disabled={submitting || !reviewRating}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        )}

        {reviewSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Your review has been submitted. Thank you!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Active listings */}
          <div className="lg:col-span-3">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-indigo-400" />
              Active Listings
              {profile.activeListings.length > 0 && (
                <span className="text-slate-600 dark:text-slate-400 font-normal text-sm">({profile.activeListings.length})</span>
              )}
            </h2>

            {profile.activeListings.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                No active listings right now
              </div>
            ) : (
              <div className="space-y-2">
                {profile.activeListings.map(listing => {
                  const gradient = CAT_GRADIENT[listing.category] ?? CAT_GRADIENT['Concert'];
                  const dateLabel = listing.date
                    ? new Date(listing.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '';
                  return (
                    <Link
                      key={listing.id}
                      to={`/ticket/${listing.id}`}
                      className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/5 p-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                        <span className="text-[10px] font-bold text-white/70 uppercase">{listing.category.slice(0, 3)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {listing.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {listing.venue}, {listing.city}{dateLabel ? ` · ${dateLabel}` : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">₪{listing.price}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{listing.available} left</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Reviews
              {profile.totalReviews > 0 && (
                <span className="text-slate-600 dark:text-slate-400 font-normal text-sm">({profile.totalReviews})</span>
              )}
            </h2>

            {profile.reviews.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                No reviews yet
              </div>
            ) : (
              <div className="space-y-3">
                {profile.reviews.map(review => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/5 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {(review.buyerName || 'A')[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{review.buyerName}</span>
                      </div>
                      <Stars value={review.rating} />
                    </div>
                    {review.ticketName && (
                      <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1 truncate">{review.ticketName}</p>
                    )}
                    {review.comment && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                    )}
                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-2">
                      {new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
