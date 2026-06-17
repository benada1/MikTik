import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShieldCheck, Star, MapPin, Calendar, ChevronDown } from 'lucide-react';

const allTickets = [
  { id: '1', category: 'Concert', name: 'Tel Aviv Music Festival', date: 'Dec 15, 2024', venue: 'Yarkon Park', city: 'Tel Aviv', price: 280, originalPrice: 350, seller: 'Yossi M.', rating: 4.9, reviews: 124, available: 12, verified: true },
  { id: '2', category: 'Sports', name: 'Maccabi TLV vs Hapoel Jerusalem', date: 'Dec 18, 2024', venue: 'Bloomfield Stadium', city: 'Tel Aviv', price: 95, originalPrice: 120, seller: 'Dana K.', rating: 4.7, reviews: 56, available: 8, verified: true },
  { id: '3', category: 'Theater', name: 'Jerusalem Ballet Gala', date: 'Dec 20, 2024', venue: 'Khan Theatre', city: 'Jerusalem', price: 185, originalPrice: 185, seller: 'Avi S.', rating: 5.0, reviews: 33, available: 5, verified: true },
  { id: '4', category: 'Festival', name: 'New Year Eve Party 2025', date: 'Dec 31, 2024', venue: 'TLV Port', city: 'Tel Aviv', price: 350, originalPrice: 400, seller: 'Michal L.', rating: 4.8, reviews: 89, available: 30, verified: true },
  { id: '5', category: 'Concert', name: 'Eyal Golan Live', date: 'Jan 5, 2025', venue: 'Menora Mivtachim Arena', city: 'Tel Aviv', price: 220, originalPrice: 250, seller: 'Roni B.', rating: 4.6, reviews: 44, available: 6, verified: true },
  { id: '6', category: 'Sports', name: 'Israel vs Portugal - Football', date: 'Jan 10, 2025', venue: 'Teddy Stadium', city: 'Jerusalem', price: 140, originalPrice: 140, seller: 'Nir A.', rating: 4.9, reviews: 201, available: 20, verified: true },
  { id: '7', category: 'Comedy', name: 'Stand-Up Night at Haifa', date: 'Jan 12, 2025', venue: 'Haifa Auditorium', city: 'Haifa', price: 80, originalPrice: 90, seller: 'Shira T.', rating: 4.5, reviews: 18, available: 3, verified: false },
  { id: '8', category: 'Concert', name: 'Omer Adam Tour', date: 'Jan 20, 2025', venue: 'Caesarea Amphitheatre', city: 'Caesarea', price: 310, originalPrice: 310, seller: 'Lior D.', rating: 4.8, reviews: 72, available: 14, verified: true },
];

const categories = ['All', 'Concert', 'Sports', 'Theater', 'Festival', 'Comedy'];
const cities = ['All Cities', 'Tel Aviv', 'Jerusalem', 'Haifa', 'Caesarea'];

const categoryColors: Record<string, string> = {
  Concert: 'bg-purple-100 text-purple-700',
  Sports: 'bg-blue-100 text-blue-700',
  Theater: 'bg-rose-100 text-rose-700',
  Festival: 'bg-orange-100 text-orange-700',
  Comedy: 'bg-yellow-100 text-yellow-700',
  All: 'bg-slate-100 text-slate-700',
};

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All Cities');
  const [sort, setSort] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allTickets
    .filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.venue.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || t.category === category;
      const matchCity = city === 'All Cities' || t.city === city;
      return matchSearch && matchCat && matchCity;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return a.date.localeCompare(b.date);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Ticket Marketplace</h1>
        <p className="text-slate-500">{filtered.length} verified listings available</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, venues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="date">Sort: Date</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    category === c ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Ticket Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No tickets found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(ticket => (
            <Link
              key={ticket.id}
              to={`/ticket/${ticket.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all group"
            >
              {/* Color bar */}
              <div className={`h-1.5 ${
                ticket.category === 'Concert' ? 'bg-purple-500' :
                ticket.category === 'Sports' ? 'bg-blue-500' :
                ticket.category === 'Theater' ? 'bg-rose-500' :
                ticket.category === 'Festival' ? 'bg-orange-500' : 'bg-yellow-500'
              }`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[ticket.category]}`}>
                    {ticket.category}
                  </span>
                  {ticket.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                  {ticket.name}
                </h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {ticket.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {ticket.venue}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {ticket.seller[0]}
                  </div>
                  <span className="text-xs text-slate-600">{ticket.seller}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-slate-700">{ticket.rating}</span>
                    <span className="text-xs text-slate-400">({ticket.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-xl font-bold text-indigo-600">₪{ticket.price}</div>
                    {ticket.originalPrice > ticket.price && (
                      <div className="text-xs text-slate-400 line-through">₪{ticket.originalPrice}</div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{ticket.available} available</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
