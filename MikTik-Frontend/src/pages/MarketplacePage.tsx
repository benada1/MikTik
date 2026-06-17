import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Eye, Zap, X, MapPin } from 'lucide-react';

const ALL_TICKETS = [
  { id: '1', category: 'Sports', name: 'Hapoel Beer Sheva vs Maccabi Haifa', month: 'Mar', day: '22', venue: 'Turner Stadium', city: 'Beer Sheva', price: 100, originalPrice: 120, discount: 17, views: 312, available: 15, verified: true, instant: true, section: 'East Stand', row: 3 },
  { id: '2', category: 'Comedy', name: 'Gad Elbaz Stand-Up Special', month: 'Mar', day: '29', venue: 'Zappa Herzliya', city: 'Herzliya', price: 150, originalPrice: 180, discount: 17, views: 134, available: 2, verified: true, instant: false, section: 'Floor', row: 2 },
  { id: '3', category: 'Theater', name: 'Habima Theater – The Dybbuk', month: 'Mar', day: '8', venue: 'Habima National Theatre', city: 'Tel Aviv', price: 250, originalPrice: 260, discount: 4, views: 89, available: 22, verified: true, instant: true, section: 'Stalls', row: 8 },
  { id: '4', category: 'Festival', name: 'InDNegev Festival 2025', month: 'Apr', day: '3', venue: 'Negev Desert', city: 'Beer Sheva', price: 320, originalPrice: 390, discount: 18, views: 541, available: 6, verified: true, instant: false, section: 'General', row: 0 },
  { id: '5', category: 'Sports', name: 'Maccabi Tel Aviv vs Real Madrid – Euroleague', month: 'Mar', day: '15', venue: 'Menora Mivtachim Arena', city: 'Tel Aviv', price: 380, originalPrice: 450, discount: 16, views: 820, available: 4, verified: true, instant: true, section: 'VIP A', row: 3 },
  { id: '6', category: 'Concert', name: "Idan Raichel – Live at the Sultan's Pool", month: 'May', day: '10', venue: "Sultan's Pool", city: 'Jerusalem', price: 280, originalPrice: 310, discount: 10, views: 673, available: 9, verified: true, instant: true, section: 'Premium', row: 5 },
  { id: '7', category: 'Concert', name: 'Eyal Golan Live Tour', month: 'Apr', day: '18', venue: 'Yarkon Park', city: 'Tel Aviv', price: 220, originalPrice: 250, discount: 12, views: 445, available: 18, verified: true, instant: false, section: 'Lawn', row: 0 },
  { id: '8', category: 'Sports', name: 'Israel vs Portugal – World Cup Qualifier', month: 'Jun', day: '7', venue: 'Teddy Stadium', city: 'Jerusalem', price: 140, originalPrice: 140, discount: 0, views: 1200, available: 30, verified: true, instant: true, section: 'North Stand', row: 22 },
  { id: '9', category: 'Comedy', name: 'Stand-Up Night at Haifa', month: 'Apr', day: '25', venue: 'Haifa Auditorium', city: 'Haifa', price: 80, originalPrice: 90, discount: 11, views: 67, available: 3, verified: false, instant: false, section: 'Balcony', row: 1 },
];

const CATEGORIES = ['All', 'Concert', 'Sports', 'Theater', 'Festival', 'Comedy'];
const CITIES = ['All Cities', 'Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva', 'Herzliya'];

const CAT_GRADIENT: Record<string, string> = {
  Concert: 'from-violet-950 via-purple-900 to-indigo-950',
  Sports: 'from-emerald-950 via-green-900 to-teal-950',
  Theater: 'from-rose-950 via-red-900 to-pink-950',
  Festival: 'from-orange-950 via-amber-900 to-yellow-950',
  Comedy: 'from-yellow-900 via-amber-800 to-orange-950',
};
const CAT_TAG: Record<string, string> = {
  Concert: 'bg-purple-500/80', Sports: 'bg-emerald-500/80',
  Theater: 'bg-rose-500/80', Festival: 'bg-orange-500/80', Comedy: 'bg-yellow-500/80',
};
const CAT_EMOJI: Record<string, string> = {
  Concert: '🎵', Sports: '⚽', Theater: '🎭', Festival: '🎪', Comedy: '😂',
};

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All Cities');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [instantOnly, setInstantOnly] = useState(false);

  const hasFilters = category !== 'All' || city !== 'All Cities' || maxPrice < 5000 || verifiedOnly || instantOnly || search;

  const clearFilters = () => {
    setCategory('All'); setCity('All Cities'); setMaxPrice(5000);
    setVerifiedOnly(false); setInstantOnly(false); setSearch('');
  };

  const filtered = ALL_TICKETS.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.venue.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All' && t.category !== category) return false;
    if (city !== 'All Cities' && t.city !== city) return false;
    if (t.price > maxPrice) return false;
    if (verifiedOnly && !t.verified) return false;
    if (instantOnly && !t.instant) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'popular') return b.views - a.views;
    return 0;
  });

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6 text-right">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Marketplace</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Find tickets for upcoming events across Israel</p>
        </div>

        {/* Search + sort row */}
        <div className="flex gap-3 mb-4">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="popular">Most popular</option>
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, venues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === c
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {c !== 'All' && CAT_EMOJI[c]}
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> tickets found
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <Search className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="font-medium text-slate-500 dark:text-slate-400">No tickets match your filters</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(t => (
                  <Link
                    key={t.id}
                    to={`/ticket/${t.id}`}
                    className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/40 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 hover:-translate-y-1"
                  >
                    {/* Image / gradient area */}
                    <div className={`relative h-48 bg-linear-to-br ${CAT_GRADIENT[t.category]}`}>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Date badge */}
                      <div className="absolute top-3 right-3 text-center bg-black/40 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10">
                        <div className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{t.month}</div>
                        <div className="text-lg font-black text-white leading-none">{t.day}</div>
                      </div>

                      {/* Top-left badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white ${CAT_TAG[t.category]}`}>
                          {CAT_EMOJI[t.category]} {t.category}
                        </span>
                        {t.instant && (
                          <span className="flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            <Zap className="w-2.5 h-2.5 fill-white" /> Instant
                          </span>
                        )}
                      </div>

                      {/* Title overlaid at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-sm text-white leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
                          {t.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-3">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{t.city} · {t.venue}</span>
                        {t.verified && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          {t.discount > 0 && (
                            <>
                              <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">-{t.discount}%</span>
                              <span className="text-xs text-slate-400 line-through">₪{t.originalPrice}</span>
                            </>
                          )}
                          <span className="text-lg font-bold text-slate-900 dark:text-white">₪{t.price}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Eye className="w-3 h-3" />{t.views}
                        </span>
                      </div>

                      {(t.row > 0 || t.available > 0) && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                          {t.row > 0 ? `Row ${t.row} · ` : ''}{t.available} tickets · {t.section}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-5 sticky top-24">
              <div className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">City</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    Price Range (₪0 – ₪{maxPrice.toLocaleString()})
                  </label>
                  <input type="range" min={0} max={5000} step={50} value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-indigo-500" />
                  <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
                    <span>₪0</span><span>₪5,000</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-3">
                  {/* Verified toggle */}
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Verified sellers only</span>
                    <button
                      onClick={() => setVerifiedOnly(v => !v)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${verifiedOnly ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${verifiedOnly ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </label>

                  {/* Instant toggle */}
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Instant transfer only</span>
                    <button
                      onClick={() => setInstantOnly(v => !v)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${instantOnly ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${instantOnly ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </label>
                </div>

                {hasFilters && (
                  <button onClick={clearFilters} className="w-full text-xs text-indigo-600 dark:text-indigo-400 hover:underline pt-1">
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
