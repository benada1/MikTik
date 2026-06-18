import { useState } from 'react';
import { AlertTriangle, ShieldCheck, Clock, CheckCircle, MessageSquare, Plus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DISPUTES = [
  { id: 'DSP-001', order: 'ORD-002', event: 'Maccabi TLV vs Real Madrid', amount: 205, status: 'open', opened: 'Dec 12, 2024', reason: 'Tickets not received after payment confirmation.' },
  { id: 'DSP-002', order: 'ORD-004', event: 'InDNegev Festival 2025', amount: 336, status: 'resolved', opened: 'Nov 20, 2024', reason: 'Event was cancelled. Requested full refund.' },
];

export default function DisputeCenterPage() {
  const [showNew, setShowNew] = useState(false);
  const [reason, setReason] = useState('');
  const { t } = useLanguage();

  const STATUS_CFG = {
    open:     { label: t('status.open'),     icon: AlertTriangle, classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
    resolved: { label: t('status.resolved'), icon: CheckCircle,   classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
    pending:  { label: t('status.pending'),  icon: Clock,         classes: 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10' },
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dispute.title')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('dispute.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowNew(v => !v)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> {t('dispute.newDispute')}
          </button>
        </div>

        {/* Guarantee notice */}
        <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-0.5">{t('dispute.protectionTitle')}</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
              {t('dispute.protectionDesc')}
            </p>
          </div>
        </div>

        {/* New dispute form */}
        {showNew && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm">{t('dispute.openNewTitle')}</h2>
              <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('dispute.orderId')}</label>
                <input type="text" placeholder="ORD-XXX" className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('dispute.reason')}</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  placeholder={t('dispute.reasonPlaceholder')}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
                />
              </div>
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition-colors">
                {t('dispute.submit')}
              </button>
            </div>
          </div>
        )}

        {/* Disputes list */}
        <div className="space-y-3">
          {DISPUTES.length === 0 ? (
            <div className="text-center py-16">
              <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dispute.noDisputes')}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('dispute.noDisputesSub')}</p>
            </div>
          ) : (
            DISPUTES.map(d => {
              const cfg = STATUS_CFG[d.status as keyof typeof STATUS_CFG];
              const StatusIcon = cfg.icon;
              return (
                <div key={d.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{d.event}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{d.id} · {t('dispute.opened')} {d.opened}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.classes}`}>
                      <StatusIcon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{d.reason}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{t('dispute.order')} {d.order} · ₪{d.amount}</span>
                    {d.status === 'open' && (
                      <button className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" /> {t('dispute.messageSupport')}
                      </button>
                    )}
                    {d.status === 'resolved' && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{t('dispute.refundIssued')}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
