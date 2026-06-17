import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, Lock, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Ticke<span className="text-indigo-400">Trust</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Israel's most secure ticket marketplace with escrow protection and verified listings.
            </p>
            <div className="flex gap-3 mt-4">
              <div className="flex items-center gap-1 text-xs text-green-400">
                <ShieldCheck className="w-4 h-4" />
                Escrow
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-400">
                <Lock className="w-4 h-4" />
                Encrypted
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <CreditCard className="w-4 h-4" />
                Secure Pay
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Browse Tickets</Link></li>
              <li><Link to="/sell" className="hover:text-white transition-colors">Sell Tickets</Link></li>
              <li><Link to="/buyer-dashboard" className="hover:text-white transition-colors">My Purchases</Link></li>
              <li><Link to="/seller-dashboard" className="hover:text-white transition-colors">My Listings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dispute-center" className="hover:text-white transition-colors">Dispute Center</Link></li>
              <li><Link to="/wallet" className="hover:text-white transition-colors">Wallet & Payments</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© 2024 TickeTrust. All rights reserved. Licensed in Israel.</p>
          <p className="text-slate-500">Secure ticket exchange powered by escrow technology</p>
        </div>
      </div>
    </footer>
  );
}
