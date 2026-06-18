import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Clock, CheckCircle, MessageSquare, Plus, X, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

interface Report {
  _id: string;
  orderId: string;
  eventName: string;
  reason: string;
  status: 'open' | 'pending' | 'closed';
  adminNote: string;
  user?: { name: string; email: string };
  createdAt: string;
}

export default function DisputeCenterPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [eventName, setEventName] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { t } = useLanguage();
  const { user } = useAuth();

  const isAdmin = user?.permissionLevel === 3;

  const STATUS_CFG = {
    open:    { label: t('status.open'),    icon: AlertTriangle, classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
    pending: { label: t('status.pending'), icon: Clock,         classes: 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10' },
    closed:  { label: t('status.closed'),  icon: CheckCircle,   classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
  };

  const fetchReports = () => {
    const token = localStorage.getItem('tt_token');
    const endpoint = isAdmin ? `${API}/reports` : `${API}/reports/my`;
    fetch(endpoint, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => r.json())
      .then(data => setReports(data.reports || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async () => {
    if (!orderId.trim() || !reason.trim()) {
      setFormError('Order ID and reason are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const token = localStorage.getItem('tt_token');
      const res = await fetch(`${API}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId, eventName, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setReports(prev => [data.report, ...prev]);
      setOrderId('');
      setEventName('');
      setReason('');
      setShowNew(false);
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('tt_token');
    const res = await fetch(`${API}/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      // When admin closes a report, remove it from their view immediately
      if (isAdmin && status === 'closed') {
        setReports(prev => prev.filter(r => r._id !== id));
      } else {
        setReports(prev => prev.map(r => r._id === id ? data.report : r));
      }
    }
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
          {!isAdmin && (
            <button
              onClick={() => setShowNew(v => !v)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> {t('dispute.newDispute')}
            </button>
          )}
        </div>

        {/* Guarantee notice */}
        <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-0.5">{t('dispute.protectionTitle')}</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">{t('dispute.protectionDesc')}</p>
          </div>
        </div>

        {/* New dispute form (users only) */}
        {showNew && !isAdmin && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm">{t('dispute.openNewTitle')}</h2>
              <button
                onClick={() => { setShowNew(false); setFormError(''); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {formError && <p className="text-xs text-red-500 mb-3">{formError}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{t('dispute.orderId')}</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="ORD-XXX"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Event Name (optional)</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                  placeholder="e.g. Maccabi TLV vs Real Madrid"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
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
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : t('dispute.submit')}
              </button>
            </div>
          </div>
        )}

        {/* Reports list */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dispute.noDisputes')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('dispute.noDisputesSub')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(r => {
              const cfg = STATUS_CFG[r.status];
              const StatusIcon = cfg.icon;
              const date = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <div key={r._id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {r.eventName || r.orderId}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('dispute.opened')} {date}</p>
                      {isAdmin && r.user && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                          <User className="w-3 h-3" /> {r.user.name} · {r.user.email}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.classes}`}>
                      <StatusIcon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{r.reason}</p>
                  {r.adminNote && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3 italic">Admin note: {r.adminNote}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{t('dispute.order')} {r.orderId}</span>
                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        {r.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(r._id, 'pending')}
                            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                          >
                            Mark Pending
                          </button>
                        )}
                        {r.status !== 'open' && (
                          <button
                            onClick={() => updateStatus(r._id, 'open')}
                            className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(r._id, 'closed')}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      r.status === 'open' && (
                        <button className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" /> {t('dispute.messageSupport')}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
