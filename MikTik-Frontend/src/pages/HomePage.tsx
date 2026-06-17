import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, ArrowRight, CheckCircle, CreditCard, Users, TrendingUp, Star, Eye, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';

interface FeaturedTicket {
  id: string;
  name: string;
  category: string;
  month: string;
  day: string;
  city: string;
  venue: string;
  price: number;
  originalPrice: number;
  discount: number;
  views: number;
  verified: boolean;
}

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

const CATEGORY_DATA = [
  { key: 'sports',    emoji: '⚽', to: '/marketplace?category=sports',  color: 'from-emerald-900/60 to-teal-950/60 border-emerald-800/40 hover:border-emerald-600/60' },
  { key: 'concerts',  emoji: '🎵', to: '/marketplace?category=concert', color: 'from-violet-900/60 to-indigo-950/60 border-violet-800/40 hover:border-violet-600/60' },
  { key: 'theater',   emoji: '🎭', to: '/marketplace?category=theater', color: 'from-rose-900/60 to-pink-950/60 border-rose-800/40 hover:border-rose-600/60' },
  { key: 'festivals', emoji: '🎪', to: '/marketplace?category=festival',color: 'from-orange-900/60 to-amber-950/60 border-orange-800/40 hover:border-orange-600/60' },
  { key: 'comedy',    emoji: '😂', to: '/marketplace?category=comedy',  color: 'from-yellow-900/60 to-amber-950/60 border-yellow-800/40 hover:border-yellow-600/60' },
  { key: 'standup',   emoji: '🎤', to: '/marketplace?category=comedy',  color: 'from-sky-900/60 to-blue-950/60 border-sky-800/40 hover:border-sky-600/60' },
];

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredTickets, setFeaturedTickets] = useState<FeaturedTicket[]>([]);

  useEffect(() => {
    fetch(`${API}/tickets?sort=popular&limit=4`)
      .then(r => r.json())
      .then(data => setFeaturedTickets(data.tickets || []))
      .catch(() => {});
  }, []);

  const STATS = [
    { value: '50K+', label: t('stats.ticketsSold') },
    { value: '98.7%', label: t('stats.satisfactionRate') },
    { value: '₪0', label: t('stats.fraudLosses') },
    { value: '24/7', label: t('stats.support') },
  ];

  const FEATURES = [
    { icon: ShieldCheck, title: t('feature.escrow.title'), desc: t('feature.escrow.desc') },
    { icon: Lock, title: t('feature.sellers.title'), desc: t('feature.sellers.desc') },
    { icon: Zap, title: t('feature.transfer.title'), desc: t('feature.transfer.desc') },
    { icon: CreditCard, title: t('feature.payments.title'), desc: t('feature.payments.desc') },
    { icon: Users, title: t('feature.dispute.title'), desc: t('feature.dispute.desc') },
    { icon: Star, title: t('feature.ratings.title'), desc: t('feature.ratings.desc') },
  ];

  const STEPS = [
    { n: '1', title: t('step.1.title'), desc: t('step.1.desc') },
    { n: '2', title: t('step.2.title'), desc: t('step.2.desc') },
    { n: '3', title: t('step.3.title'), desc: t('step.3.desc') },
  ];

  const TRUST_BADGES = [
    { icon: CheckCircle, label: t('hero.trust.payments') },
    { icon: Zap, label: t('hero.trust.ai') },
    { icon: ArrowRight, label: t('hero.trust.transfer') },
  ];

  return (
    <div className="bg-white dark:bg-zinc-950">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-indigo-600/10 dark:bg-indigo-500/7 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/4 w-100 h-100 bg-violet-600/10 dark:bg-violet-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-75 h-75 bg-indigo-400/5 dark:bg-indigo-400/4 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25 px-3 py-1.5 rounded-full mb-8 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-4 leading-[1.05]">
            {t('hero.title1')}
            <br />
            <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              {t('hero.title2')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4" />
              {t('hero.browseTickets')}
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all border border-slate-200 dark:border-white/10 hover:-translate-y-0.5"
            >
              {t('hero.sellTickets')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('section.categories.title')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('section.categories.sub')}</p>
          </div>
          <Link to="/marketplace" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
            {t('section.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORY_DATA.map(c => (
            <Link
              key={c.key}
              to={c.to}
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-linear-to-br border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/30 ${c.color} bg-white dark:bg-transparent`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t(`category.${c.key}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('section.featured.title')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('section.featured.sub')}</p>
          </div>
          <Link to="/marketplace" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
            {t('section.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTickets.map(e => (
            <Link key={e.id} to={`/ticket/${e.id}`} className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 hover:-translate-y-1 bg-white dark:bg-zinc-900">
              <div className={`relative h-44 bg-linear-to-br ${CAT_GRADIENT[e.category] || CAT_GRADIENT['Concert']}`}>
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute top-3 right-3 text-center bg-black/30 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10">
                  <div className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{e.month}</div>
                  <div className="text-lg font-black text-white leading-none">{e.day}</div>
                </div>

                {e.verified && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    {t('event.verified')}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white mb-1.5 inline-block ${CAT_TAG[e.category] || ''}`}>
                    {e.category}
                  </span>
                  <h3 className="font-bold text-sm text-white leading-snug line-clamp-2">
                    {e.name}
                  </h3>
                </div>
              </div>

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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('howItWorks.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">{t('howItWorks.sub')}</p>
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('features.title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">{t('features.sub')}</p>
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
            <h2 className="text-2xl font-bold text-white mb-3">{t('cta.title')}</h2>
            <p className="text-indigo-200 dark:text-indigo-300 text-sm mb-8 max-w-md mx-auto">{t('cta.sub')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="px-6 py-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-semibold text-sm transition-colors shadow-lg">
                {t('cta.createAccount')}
              </Link>
              <Link to="/marketplace" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors">
                {t('cta.browse')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
