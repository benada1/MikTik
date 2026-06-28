import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ShieldCheck, Eye, X, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Pagination from '../components/Pagination';

const API = 'http://localhost:5000/api';

interface Ticket {
  id: string;
  name: string;
  category: string;
  month: string;
  day: string;
  startTime?: string;
  venue: string;
  city: string;
  price: number;
  originalPrice: number;
  discount: number;
  views: number;
  available: number;
  verified: boolean;
  section: string;
  row: string;
  instant: boolean;
  bundleOnly: boolean;
}

const CITIES = ['All Cities', 'תל אביב-יפו', 'ירושלים', 'חיפה', 'באר שבע', 'הרצליה', 'נתניה', 'ראשון לציון', 'רמת גן', 'פתח תקווה', 'אשדוד'];

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
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const CATEGORIES = [t('marketplace.catAll'), 'Concert', 'Sports', 'Theater', 'Festival', 'Comedy'];

  const urlCategory = searchParams.get('category');
  const initialCategory = urlCategory
    ? (CATEGORIES.find(c => c.toLowerCase() === urlCategory.toLowerCase()) ?? t('marketplace.catAll'))
    : t('marketplace.catAll');

  useEffect(() => { document.title = 'Marketplace | MikTik'; }, []);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState('All Cities');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const catAll = t('marketplace.catAll');
  const hasFilters = category !== catAll || city !== 'All Cities' || maxPrice < 5000 || verifiedOnly || search;

  useEffect(() => {
    const param = searchParams.get('category');
    if (param) {
      const matched = CATEGORIES.find(c => c.toLowerCase() === param.toLowerCase());
      if (matched) setCategory(matched);
    }
  }, [searchParams]);

  const clearFilters = () => {
    setCategory(catAll); setCity('All Cities'); setMaxPrice(5000);
    setVerifiedOnly(false); setSearch(''); setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    const apiCategory = category === catAll ? '' : category;
    if (apiCategory) params.set('category', apiCategory);
    if (city !== 'All Cities') params.set('city', city);
    if (maxPrice < 5000) params.set('maxPrice', String(maxPrice));
    if (verifiedOnly) params.set('verified', 'true');
    if (search) params.set('search', search);
    if (sort !== 'newest') params.set('sort', sort);
    params.set('page', String(page));

    const token = localStorage.getItem('tt_token');
    fetch(`${API}/tickets?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        setTickets(data.tickets || []);
        setTotal(data.total ?? 0);
        setPages(data.pages ?? 1);
      })
      .catch(() => { setTickets([]); setTotal(0); setPages(1); })
      .finally(() => setLoading(false));
  }, [category, city, maxPrice, verifiedOnly, search, sort, page]);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6 text-right">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('marketplace.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('marketplace.subtitle')}</p>
        </div>

        {/* Search + sort row */}
        <div className="flex gap-3 mb-4">
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
          >
            <option value="newest">{t('marketplace.newestFirst')}</option>
            <option value="price-asc">{t('marketplace.priceLowHigh')}</option>
            <option value="price-desc">{t('marketplace.priceHighLow')}</option>
            <option value="popular">{t('marketplace.mostPopular')}</option>
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('marketplace.searchPlaceholder')}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
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
              onClick={() => { setCategory(c); setPage(1); }}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === c
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {c !== catAll && CAT_EMOJI[c]}
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {loading ? t('marketplace.loading') : <><span className="font-semibold text-slate-900 dark:text-white">{total}</span> {t('marketplace.ticketsFound')}</>}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> {t('marketplace.clearFilters')}
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 animate-pulse">
                    <div className="h-48 bg-slate-200 dark:bg-zinc-800" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
                      <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-24">
                <Search className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="font-medium text-slate-500 dark:text-slate-400">{t('marketplace.noTickets')}</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t('marketplace.clearAllFilters')}
                </button>
              </div>
            ) : tickets.length === 0 && page > 1 ? (
              <div className="text-center py-24">
                <p className="font-medium text-slate-500 dark:text-slate-400">No tickets on this page.</p>
                <button onClick={() => setPage(1)} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Back to page 1</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {tickets.map(tk => (
                  <Link
                    key={tk.id}
                    to={`/ticket/${tk.id}`}
                    className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/40 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 hover:-translate-y-1"
                  >
                    {/* Image / gradient area */}
                    <div className={`relative h-48 bg-linear-to-br ${CAT_GRADIENT[tk.category] || CAT_GRADIENT['Concert']}`}>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Date badge */}
                      <div className="absolute top-3 right-3 text-center bg-black/40 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10">
                        <div className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{tk.month}</div>
                        <div className="text-lg font-black text-white leading-none">{tk.day}</div>
                        {tk.startTime && <div className="text-[9px] font-semibold text-white/70 mt-0.5">{tk.startTime}</div>}
                      </div>

                      {/* Top-left badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white ${CAT_TAG[tk.category] || ''}`}>
                          {CAT_EMOJI[tk.category]} {tk.category}
                        </span>
                        {tk.bundleOnly && tk.available > 1 && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white bg-indigo-500/80">
                            🎟️ {t('marketplace.bundle')} ×{tk.available}
                          </span>
                        )}
                      </div>

                      {/* Title overlaid at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-sm text-white leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
                          {tk.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{tk.city} · {tk.venue}</span>
                        {tk.verified && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          {tk.discount > 0 && (
                            <>
                              <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">-{tk.discount}%</span>
                              <span className="text-xs text-slate-400 line-through">₪{tk.originalPrice}</span>
                            </>
                          )}
                          <span className="text-lg font-bold text-slate-900 dark:text-white">₪{tk.price}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <Eye className="w-3 h-3" />{tk.views}
                        </span>
                      </div>

                      {(tk.row || tk.available > 0) && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                          {tk.row ? `${t('ticketDetails.row')} ${tk.row} · ` : ''}{tk.available} tickets · {tk.section}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-5 sticky top-24">
              <div className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t('marketplace.category')}</label>
                  <select
                    value={category}
                    onChange={e => { setCategory(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c === catAll ? t('marketplace.allCategories') : c}</option>)}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t('marketplace.city')}</label>
                  <select
                    value={city}
                    onChange={e => { setCity(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CITIES.map(c => <option key={c}>{c === 'All Cities' ? t('marketplace.allCities') : c}</option>)}
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                    {t('marketplace.priceRange')} (₪0 – ₪{maxPrice.toLocaleString()})
                  </label>
                  <input type="range" min={0} max={5000} step={50} value={maxPrice}
                    onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1); }} className="w-full accent-indigo-500" />
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <span>₪0</span><span>₪5,000</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-3">
                  {/* Verified toggle */}
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{t('marketplace.verifiedOnly')}</span>
                    <button
                      onClick={() => { setVerifiedOnly(v => !v); setPage(1); }}
                      className={`relative w-9 h-5 rounded-full transition-colors ${verifiedOnly ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${verifiedOnly ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </label>

                </div>

                {hasFilters && (
                  <button onClick={clearFilters} className="w-full text-xs text-indigo-600 dark:text-indigo-400 hover:underline pt-1">
                    {t('marketplace.clearAllFilters')}
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
