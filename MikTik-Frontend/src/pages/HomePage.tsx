import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, ArrowRight, CheckCircle, CreditCard, Users, TrendingUp, Star, Eye, MapPin } from 'lucide-react';

const STATS = [
  { value: '50K+', label: 'Tickets sold' },
  { value: '98.7%', label: 'Satisfaction rate' },
  { value: '₪0', label: 'Fraud losses' },
  { value: '24/7', label: 'Support' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Escrow Protection', desc: 'Payment held securely until you confirm ticket receipt. Zero risk.' },
  { icon: Lock, title: 'Verified Sellers', desc: 'Every seller is ID-verified and rated by real buyers.' },
  { icon: Zap, title: 'Instant Transfer', desc: 'Digital tickets transferred automatically on payment confirmation.' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'All transactions encrypted. Cards, PayPal & bank transfer supported.' },
  { icon: Users, title: 'Dispute Resolution', desc: 'Our team mediates any issues fast. Full buyer protection on every order.' },
  { icon: Star, title: 'Seller Ratings', desc: 'Transparent reviews and ratings to buy with confidence.' },
];

const STEPS = [
  { n: '1', title: 'Find your event', desc: 'Browse thousands of verified listings — concerts, sports, theater, and more.' },
  { n: '2', title: 'Pay securely', desc: 'Payment held in escrow — released only after you confirm receipt.' },
  { n: '3', title: 'Get your tickets', desc: 'Seller transfers tickets. You confirm. Funds release. Done.' },
];

const EVENTS = [
  { id: '1', category: 'Concert', name: 'Tel Aviv Music Festival', month: 'Mar', day: '22', price: 280, originalPrice: 340, discount: 17, venue: 'Yarkon Park', city: 'Tel Aviv', views: 312, gradient: 'from-violet-950 via-purple-900 to-indigo-950', tag: 'bg-purple-500/80' },
  { id: '5', category: 'Sports', name: 'Maccabi TLV vs Real Madrid', month: 'Mar', day: '15', price: 195, originalPrice: 195, discount: 0, venue: 'Menora Mivtachim Arena', city: 'Tel Aviv', views: 820, gradient: 'from-emerald-950 via-green-900 to-teal-950', tag: 'bg-emerald-500/80' },
  { id: '3', category: 'Theater', name: 'Habima – The Dybbuk', month: 'Mar', day: '8', price: 250, originalPrice: 260, discount: 4, venue: 'Habima National Theatre', city: 'Tel Aviv', views: 89, gradient: 'from-rose-950 via-red-900 to-pink-950', tag: 'bg-rose-500/80' },
  { id: '4', category: 'Festival', name: 'InDNegev Festival 2025', month: 'Apr', day: '3', price: 320, originalPrice: 390, discount: 18, venue: 'Negev Desert', city: 'Beer Sheva', views: 541, gradient: 'from-orange-950 via-amber-900 to-yellow-950', tag: 'bg-orange-500/80' },
];

const CATEGORIES = [
  { label: 'Sports', emoji: '⚽', to: '/marketplace?category=sports', color: 'from-emerald-900/60 to-teal-950/60 border-emerald-800/40 hover:border-emerald-600/60' },
  { label: 'Concerts', emoji: '🎵', to: '/marketplace?category=concert', color: 'from-violet-900/60 to-indigo-950/60 border-violet-800/40 hover:border-violet-600/60' },
  { label: 'Theater', emoji: '🎭', to: '/marketplace?category=theater', color: 'from-rose-900/60 to-pink-950/60 border-rose-800/40 hover:border-rose-600/60' },
  { label: 'Festivals', emoji: '🎪', to: '/marketplace?category=festival', color: 'from-orange-900/60 to-amber-950/60 border-orange-800/40 hover:border-orange-600/60' },
  { label: 'Comedy', emoji: '😂', to: '/marketplace?category=comedy', color: 'from-yellow-900/60 to-amber-950/60 border-yellow-800/40 hover:border-yellow-600/60' },
  { label: 'Stand-Up', emoji: '🎤', to: '/marketplace?category=comedy', color: 'from-sky-900/60 to-blue-950/60 border-sky-800/40 hover:border-sky-600/60' },
];

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-zinc-950">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-indigo-600/10 dark:bg-indigo-500/7 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/4 w-100 h-100 bg-violet-600/10 dark:bg-violet-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-75 h-75 bg-indigo-400/5 dark:bg-indigo-400/4 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25 px-3 py-1.5 rounded-full mb-8 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Israel's most trusted ticket marketplace
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.05]">
            Buy & sell tickets
            <br />
            <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              with full confidence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Escrow-protected payments, AI fraud detection, and ID-verified sellers.
            The safest way to buy and sell tickets for events across Israel.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4" />
              Browse tickets
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all border border-slate-200 dark:border-white/10 hover:-translate-y-0.5"
            >
              Sell your tickets
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            {[
              { icon: CheckCircle, label: 'Trusted payments' },
              { icon: Zap, label: 'AI fraud detection' },
              { icon: ArrowRight, label: 'Instant transfer' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-emerald-500" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="border-y border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{s.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Browse ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Browse by category</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Find tickets for every type of event</p>
          </div>
          <Link to="/marketplace" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(c => (
            <Link
              key={c.label}
              to={c.to}
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-linear-to-br border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/30 ${c.color} bg-white dark:bg-transparent`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured events</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Hand-picked verified listings</p>
          </div>
          <Link to="/marketplace" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EVENTS.map(e => (
            <Link key={e.id} to={`/ticket/${e.id}`} className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 hover:-translate-y-1 bg-white dark:bg-zinc-900">
              {/* Card image */}
              <div className={`relative h-44 bg-linear-to-br ${e.gradient}`}>
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                {/* Date */}
                <div className="absolute top-3 right-3 text-center bg-black/30 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10">
                  <div className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{e.month}</div>
                  <div className="text-lg font-black text-white leading-none">{e.day}</div>
                </div>

                {/* Verified */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </div>

                {/* Title overlaid at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white mb-1.5 inline-block ${e.tag}`}>{e.category}</span>
                  <h3 className="font-bold text-sm text-white leading-snug line-clamp-2">
                    {e.name}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-3.5">
                <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mb-2.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{e.city} · {e.venue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    {e.discount > 0 && (
                      <>
                        <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400">-{e.discount}%</span>
                        <span className="text-xs text-slate-400 line-through">₪{e.originalPrice}</span>
                      </>
                    )}
                    <span className="text-base font-bold text-slate-900 dark:text-white">₪{e.price}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Eye className="w-3 h-3" />{e.views}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-zinc-900/40 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">Our escrow system protects buyers and sellers at every step.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-8">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 h-0.5 bg-slate-200 dark:bg-white/10 z-10" />
                )}
                <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-bold text-sm mb-5 shadow-md shadow-indigo-500/25">
                  {s.n}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Everything you need</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">Designed to eliminate fraud and protect every transaction.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="group p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 bg-white dark:bg-zinc-900 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/30">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-700 dark:from-indigo-950 dark:via-indigo-900 dark:to-violet-950 border border-indigo-500/30 px-8 py-16 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <TrendingUp className="w-10 h-10 text-indigo-200 dark:text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Join 50,000+ Israelis trading safely</h2>
            <p className="text-indigo-200 dark:text-indigo-300 text-sm mb-8 max-w-md mx-auto">Sign up in seconds and start buying or selling with full fraud protection.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="px-6 py-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-semibold text-sm transition-colors shadow-lg">
                Create free account
              </Link>
              <Link to="/marketplace" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors">
                Browse tickets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
