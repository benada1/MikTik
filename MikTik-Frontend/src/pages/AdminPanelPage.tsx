import { useState, useEffect } from 'react';
import { ShieldCheck, Store, CheckCircle, XCircle, ChevronRight, X, UserX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';

interface Address {
  street: string;
  city: string;
  country: string;
}

interface SellerApp {
  _id: string;
  user: { _id: string; name: string; email: string };
  fullName: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  address: Address;
  bio: string;
  idImageUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'revoked';
  rejectionReason: string;
  reviewedAt: string;
  createdAt: string;
}

type Filter = 'pending' | 'approved' | 'rejected' | 'revoked' | 'all';

export default function AdminPanelPage() {
  const [applications, setApplications] = useState<SellerApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [selected, setSelected] = useState<SellerApp | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tt_token');
      const res = await fetch(`${API}/seller-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('tt_token');
      await fetch(`${API}/seller-applications/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchApplications();
      setSelected(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('tt_token');
      await fetch(`${API}/seller-applications/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: rejectReason }),
      });
      await fetchApplications();
      setSelected(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('tt_token');
      await fetch(`${API}/seller-applications/${id}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: rejectReason }),
      });
      await fetchApplications();
      setSelected(null);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = applications.filter(a => filter === 'all' || a.status === filter);
  const counts: Record<Filter, number> = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    revoked: applications.filter(a => a.status === 'revoked').length,
  };

  const statusStyle = (s: SellerApp['status']) =>
    s === 'pending'
      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      : s === 'approved'
      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : s === 'revoked'
      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.subtitle')}</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 mb-6 w-fit">
          {(['pending', 'approved', 'rejected', 'revoked', 'all'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t(`admin.${f}`)}
              {counts[f] > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  f === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                  f === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                  f === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  f === 'revoked' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                  'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-sm">
            {t('admin.no')} {filter === 'all' ? '' : t(`admin.${filter}`)} {t('admin.noApplications')}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(app => (
              <button
                key={app._id}
                onClick={() => { setSelected(app); setRejectReason(''); }}
                className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm shrink-0">
                  {(app.fullName || app.user.name)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{app.fullName || app.user.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{app.user.email} · {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle(app.status)}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Centered modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-y-auto">

            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white text-sm">{t('admin.applicationDetails')}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">

              {/* Status + date */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle(selected.status)}`}>
                  {t(`admin.${selected.status}`)}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {t('admin.submitted')} {new Date(selected.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Personal */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.personal')}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.accountName')}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{selected.user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.email')}</p>
                    <p className="font-medium text-slate-900 dark:text-white break-all">{selected.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.fullLegalName')}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{selected.fullName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.phone')}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{selected.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.idPassport')}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{selected.idNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.dateOfBirth')}</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.address')}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {selected.address?.street && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.street')}</p>
                      <p className="font-medium text-slate-900 dark:text-white">{selected.address.street}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.city')}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{selected.address?.city || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{t('admin.country')}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{selected.address?.country || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selected.bio && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.bio')}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 leading-relaxed">
                    {selected.bio}
                  </p>
                </div>
              )}

              {/* ID document */}
              {selected.idImageUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.idDocument')}</p>
                  <a
                    href={`http://localhost:5000${selected.idImageUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                    {t('admin.viewDocument')}
                  </a>
                </div>
              )}

              {/* Rejection / revocation reason display */}
              {(selected.status === 'rejected' || selected.status === 'revoked') && selected.rejectionReason && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">{t('admin.rejectionReason')}</p>
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
                    {selected.rejectionReason}
                  </p>
                </div>
              )}

              {/* Actions — pending only */}
              {selected.status === 'pending' && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder={t('admin.rejectReasonPlaceholder')}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(selected._id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" /> {t('admin.approve')}
                    </button>
                    <button
                      onClick={() => handleReject(selected._id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" /> {t('admin.reject')}
                    </button>
                  </div>
                </div>
              )}

              {/* Restore — revoked sellers only */}
              {selected.status === 'revoked' && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => handleApprove(selected._id)}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle className="w-4 h-4" /> {t('admin.restoreSeller')}
                  </button>
                </div>
              )}

              {/* Revoke — approved sellers only */}
              {selected.status === 'approved' && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder={t('admin.revokeReasonPlaceholder')}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                  <button
                    onClick={() => handleRevoke(selected._id)}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl text-sm font-semibold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-60"
                  >
                    <UserX className="w-4 h-4" /> {t('admin.revoke')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
