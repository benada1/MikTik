import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, Ticket, Star, ArrowRight,
  CheckCircle, Users, TrendingUp, Zap, CreditCard, AlertTriangle
} from 'lucide-react';

const stats = [
  { value: '50,000+', label: 'Tickets Sold' },
  { value: '98.7%', label: 'Satisfaction Rate' },
  { value: '₪0', label: 'Fraud Losses' },
  { value: '24/7', label: 'Support' },
];

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
    title: 'Escrow Protection',
    desc: 'Funds are held securely until you confirm ticket receipt. No risk, no scams.',
  },
  {
    icon: <Lock className="w-6 h-6 text-indigo-600" />,
    title: 'Verified Sellers',
    desc: 'Every seller is ID-verified and rated by real buyers. Trust the community.',
  },
  {
    icon: <Zap className="w-6 h-6 text-indigo-600" />,
    title: 'Instant Transfer',
    desc: 'Digital tickets transferred automatically upon payment confirmation.',
  },
  {
    icon: <CreditCard className="w-6 h-6 text-indigo-600" />,
    title: 'Secure Payments',
    desc: 'All transactions encrypted. Support for credit cards, PayPal & bank transfer.',
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-indigo-600" />,
    title: 'Dispute Resolution',
    desc: 'Our team mediates any issues fast. Buyer protection on every purchase.',
  },
  {
    icon: <Star className="w-6 h-6 text-indigo-600" />,
    title: 'Seller Ratings',
    desc: 'Transparent reviews and ratings help you buy with confidence every time.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Find Your Event',
    desc: 'Browse thousands of verified ticket listings for concerts, sports, theater, and more.',
  },
  {
    num: '02',
    title: 'Pay Securely',
    desc: 'Your payment is held in escrow — not released until you receive the tickets.',
  },
  {
    num: '03',
    title: 'Get Your Tickets',
    desc: 'Seller transfers the tickets. You confirm receipt. Funds are released.',
  },
];

const events = [
  { category: 'Concert', name: 'Tel Aviv Music Festival', date: 'Dec 15, 2024', price: '₪280', venue: 'Yarkon Park', available: 12 },
  { category: 'Sports', name: 'Maccabi Tel Aviv vs Hapoel', date: 'Dec 18, 2024', price: '₪95', venue: 'Bloomfield Stadium', available: 8 },
  { category: 'Theater', name: 'Jerusalem Ballet Gala', date: 'Dec 20, 2024', price: '₪185', venue: 'Khan Theatre', available: 5 },
  { category: 'Festival', name: 'New Year Eve Party', date: 'Dec 31, 2024', price: '₪350', venue: 'TLV Port', available: 30 },
];

const categoryColors: Record<string, string> = {
  Concert: 'bg-purple-100 text-purple-700',
  Sports: 'bg-blue-100 text-blue-700',
  Theater: 'bg-rose-100 text-rose-700',
  Festival: 'bg-orange-100 text-orange-700',
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Israel's #1 Verified Ticket Marketplace
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Buy & Sell Tickets{' '}
              <span className="text-indigo-300">Without the Risk</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 mb-10 leading-relaxed">
              Advanced anti-fraud protection and escrow-based transactions give you
              complete peace of mind for every ticket exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors text-base"
              >
                <Ticket className="w-5 h-5" />
                Browse Tickets
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-base"
              >
                Sell Your Tickets
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-indigo-200">
              {['No hidden fees', 'Buyer guarantee', 'ID-verified sellers', 'Escrow protected'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Events</h2>
            <p className="text-slate-500 mt-1">Hand-picked, verified listings</p>
          </div>
          <Link to="/marketplace" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map(e => (
            <Link
              key={e.name}
              to="/marketplace"
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[e.category]}`}>
                  {e.category}
                </span>
                <span className="text-xs text-slate-400">{e.available} left</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors leading-snug">
                {e.name}
              </h3>
              <p className="text-xs text-slate-500 mb-1">{e.date}</p>
              <p className="text-xs text-slate-400 mb-4">{e.venue}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">{e.price}</span>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">How TickeTrust Works</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Our escrow system protects both buyers and sellers at every step of the transaction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-indigo-200 z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 2rem)' }} />
                )}
                <div className="bg-white rounded-2xl p-6 border border-indigo-100 relative z-10">
                  <div className="text-4xl font-black text-indigo-100 mb-3">{s.num}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Why Choose TickeTrust</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Every feature is designed to eliminate ticket fraud and protect your money.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Join 50,000+ Israelis Trading Safely</h2>
          <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
            Sign up in seconds and start buying or selling tickets with full fraud protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Browse Tickets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
