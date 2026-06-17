import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck } from 'lucide-react';

const LINKS = {
  Marketplace: [
    { label: 'Browse Tickets', to: '/marketplace' },
    { label: 'Sell Tickets', to: '/sell' },
    { label: 'My Purchases', to: '/buyer-dashboard' },
    { label: 'My Listings', to: '/seller-dashboard' },
  ],
  Support: [
    { label: 'Dispute Center', to: '/dispute-center' },
    { label: 'Wallet & Payments', to: '/wallet' },
    { label: 'How It Works', to: '/' },
    { label: 'Safety Guide', to: '/' },
  ],
  Account: [
    { label: 'Sign In', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service', to: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="text-[17px] font-bold text-slate-900 dark:text-white">
                Ticket<span className="text-indigo-600 dark:text-indigo-400">Trust</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Israel's most secure ticket marketplace. Every transaction escrow-protected.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escrow protected · ID verified</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500">© 2025 TicketTrust. All rights reserved.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Secure ticket exchange · Licensed in Israel</p>
        </div>
      </div>
    </footer>
  );
}
