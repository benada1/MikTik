import { useState, useEffect } from 'react';
import {
  ShieldCheck, Store, CheckCircle, XCircle, ChevronRight, X,
  UserX, Percent, Users, Ticket, TrendingUp, AlertTriangle,
  MessageSquare, BarChart2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Pagination from '../components/Pagination';

const API = 'http://localhost:5000/api';

interface Address { street: string; city: string; country: string; }

interface SellerApp {
  _id: string;
  user: { _id: string; name: string; email: string };
  fullName: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  address: Address;
  bio: string;
  status: 'pending' | 'approved' | 'rejected' | 'revoked';
  rejectionReason: string;
  reviewedAt: string;
  createdAt: string;
}

interface Report {
  _id: string;
  user: { name: string; email: string };
  orderId: string;
  eventName: string;
  reason: string;
  status: 'open' | 'pending' | 'closed';
  adminNote?: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalSellers: number;
  activeTickets: number;
  openReports: number;
  totalPurchases: number;
  totalRevenue: number;
  totalFees: number;
}

type AppFilter = 'pending' | 'approved' | 'rejected' | 'revoked' | 'all';
type Section = 'applications' | 'reports' | 'stats';

export default function AdminPanelPage() {
  useEffect(() => { document.title = 'Admin Panel | MikTik'; }, []);

  const [section, setSection] = useState<Section>('applications');
  const [applications, setApplications] = useState<SellerApp[]>([]);
  const [appPages, setAppPages] = useState(1);
  const [appPage, setAppPage] = useState(1);
  const [appTotal, setAppTotal] = useState(0);
  const [appsLoading, setAppsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportPages, setReportPages] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [reportTotal, setReportTotal] = useState(0);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppFilter>('pending');
  const [selected, setSelected] = useState<SellerApp | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [sellerCommission, setSellerCommission] = useState<number | null>(null);
  const [commissionInput, setCommissionInput] = useState('');
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportNote, setReportNote] = useState('');
  const [reportActionLoading, setReportActionLoading] = useState(false);
  const { t } = useLanguage();

  const token = () => localStorage.getItem('tt_token');

  const fetchStats = async () => {
    const res = await fetch(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    if (!data.error) setStats(data);
  };

  const fetchApplications = async (pg: number, fil: AppFilter) => {
    setAppsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg) });
      if (fil !== 'all') params.set('status', fil);
      const res = await fetch(`${API}/seller-applications?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setApplications(data.applications || []);
      setAppPages(data.pages ?? 1);
      setAppTotal(data.total ?? 0);
    } catch {} finally { setAppsLoading(false); }
  };

  const fetchReports = async (pg: number) => {
    setReportsLoading(true);
    try {
      const res = await fetch(`${API}/reports?page=${pg}`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setReports(data.reports || []);
      setReportPages(data.pages ?? 1);
      setReportTotal(data.total ?? 0);
    } catch {} finally { setReportsLoading(false); }
  };

  useEffect(() => {
    setLoading(true);
    fetchStats().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchApplications(appPage, filter);
  }, [filter, appPage]);

  useEffect(() => {
    fetchReports(reportPage);
  }, [reportPage]);

  useEffect(() => {
    if (!selected || selected.status !== 'approved') {
      setSellerCommission(null); setCommissionInput(''); return;
    }
    fetch(`${API}/sellers/by-user/${selected.user._id}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(data => { if (typeof data.commissionRate === 'number') { setSellerCommission(data.commissionRate); setCommissionInput(String(data.commissionRate)); } })
      .catch(() => {});
  }, [selected]);

  useEffect(() => {
    if (!selected && !selectedReport) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); setSelectedReport(null); }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [selected, selectedReport]);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await fetch(`${API}/seller-applications/${id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } });
      await Promise.all([fetchApplications(appPage, filter), fetchStats()]);
      setSelected(null);
    } finally { setActionLoading(false); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      await fetch(`${API}/seller-applications/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ reason: rejectReason }),
      });
      await Promise.all([fetchApplications(appPage, filter), fetchStats()]);
      setSelected(null);
    } finally { setActionLoading(false); }
  };

  const handleRevoke = async (id: string) => {
    setActionLoading(true);
    try {
      await fetch(`${API}/seller-applications/${id}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ reason: rejectReason }),
      });
      await Promise.all([fetchApplications(appPage, filter), fetchStats()]);
      setSelected(null);
    } finally { setActionLoading(false); }
  };

  const handleUpdateCommission = async () => {
    if (!selected) return;
    const rate = Number(commissionInput);
    if (isNaN(rate) || rate < 0 || rate > 100) return;
    setCommissionLoading(true);
    try {
      const res = await fetch(`${API}/sellers/by-user/${selected.user._id}/commission`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ commissionRate: rate }),
      });
      const data = await res.json();
      if (typeof data.commissionRate === 'number') { setSellerCommission(data.commissionRate); setCommissionInput(String(data.commissionRate)); }
    } finally { setCommissionLoading(false); }
  };

  const handleReportStatus = async (id: string, status: string) => {
    setReportActionLoading(true);
    try {
      await fetch(`${API}/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ status, adminNote: reportNote }),
      });
      await Promise.all([fetchReports(reportPage), fetchStats()]);
      setSelectedReport(null); setReportNote('');
    } finally { setReportActionLoading(false); }
  };

  const statusStyle = (s: SellerApp['status']) =>
    s === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
    s === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
    s === 'revoked' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
    'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';

  const reportStatusStyle = (s: Report['status']) =>
    s === 'open' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
    s === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
    'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400';

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.subtitle')}</p>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Users, label: 'Users', value: stats.totalUsers, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              { icon: Store, label: 'Sellers', value: stats.totalSellers, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { icon: Ticket, label: 'Active Listings', value: stats.activeTickets, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
              { icon: AlertTriangle, label: 'Open Reports', value: stats.openReports, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
              { icon: TrendingUp, label: 'Total Purchases', value: stats.totalPurchases, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { icon: BarChart2, label: 'Total Revenue', value: `₪${stats.totalRevenue.toLocaleString()}`, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20' },
              { icon: BarChart2, label: 'Total Fees', value: `₪${stats.totalFees.toLocaleString()}`, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section switcher */}
        <div role="tablist" aria-label="Admin sections" className="flex gap-1 bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 mb-6 w-fit">
          {([
            { key: 'applications' as const, label: 'Seller Applications', icon: Store, badge: undefined as number | undefined },
            { key: 'reports' as const, label: 'Reports', icon: MessageSquare, badge: reportTotal > 0 ? reportTotal : undefined },
          ]).map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              role="tab"
              aria-selected={section === key}
              onClick={() => setSection(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                section === key
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Seller Applications section ── */}
        {section === 'applications' && (
          <>
            <div role="tablist" aria-label="Application status filter" className="flex gap-1 bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 mb-6 w-fit flex-wrap">
              {(['pending', 'approved', 'rejected', 'revoked', 'all'] as AppFilter[]).map(f => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => { setFilter(f); setAppPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    filter === f
                      ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {t(`admin.${f}`)}
                  {filter === f && appTotal > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      f === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      f === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                      f === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                      f === 'revoked' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                      'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {appTotal}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {appsLoading ? (
              <div role="status" aria-label="Loading applications" className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-20 text-slate-600 dark:text-slate-400 text-sm">
                {t('admin.no')} {filter === 'all' ? '' : t(`admin.${filter}`)} {t('admin.noApplications')}
              </div>
            ) : (
              <div className="space-y-2">
                {applications.map(app => (
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
                      <p className="text-xs text-slate-600 dark:text-slate-400">{app.user.email} · {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            <Pagination page={appPage} pages={appPages} onPageChange={setAppPage} />
          </>
        )}

        {/* ── Reports section ── */}
        {section === 'reports' && (
          <>
            {reportsLoading ? (
              <div role="status" aria-label="Loading reports" className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-20 text-slate-600 dark:text-slate-400 text-sm">No open reports.</div>
            ) : (
              <div className="space-y-2">
                {reports.map(r => (
                  <button
                    key={r._id}
                    onClick={() => { setSelectedReport(r); setReportNote(r.adminNote || ''); }}
                    className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex items-center gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.eventName || r.orderId}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{r.user?.email} · {r.orderId} · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${reportStatusStyle(r.status)}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            <Pagination page={reportPage} pages={reportPages} onPageChange={setReportPage} />
          </>
        )}
      </div>

      {/* ── Seller application modal ── */}
      {selected && (
        <div role="dialog" aria-modal="true" aria-labelledby="seller-app-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <h2 id="seller-app-dialog-title" className="font-semibold text-slate-900 dark:text-white text-sm">{t('admin.applicationDetails')}</h2>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle(selected.status)}`}>
                  {t(`admin.${selected.status}`)}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {t('admin.submitted')} {new Date(selected.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('admin.personal')}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.accountName')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.user.name}</p></div>
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.email')}</p><p className="font-medium text-slate-900 dark:text-white break-all">{selected.user.email}</p></div>
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.fullLegalName')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.fullName || '—'}</p></div>
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.phone')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.phone || '—'}</p></div>
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.idPassport')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.idNumber || '—'}</p></div>
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.dateOfBirth')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : '—'}</p></div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('admin.address')}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {selected.address?.street && (
                    <div className="col-span-2"><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.street')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.address.street}</p></div>
                  )}
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.city')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.address?.city || '—'}</p></div>
                  <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{t('admin.country')}</p><p className="font-medium text-slate-900 dark:text-white">{selected.address?.country || '—'}</p></div>
                </div>
              </div>

              {selected.bio && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('admin.bio')}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 leading-relaxed">{selected.bio}</p>
                </div>
              )}


              {(selected.status === 'rejected' || selected.status === 'revoked') && selected.rejectionReason && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">{t('admin.rejectionReason')}</p>
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">{selected.rejectionReason}</p>
                </div>
              )}

              {selected.status === 'pending' && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder={t('admin.rejectReasonPlaceholder')} rows={2}
                    aria-label={t('admin.rejectReasonPlaceholder')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(selected._id)} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-60">
                      <CheckCircle className="w-4 h-4" aria-hidden="true" /> {t('admin.approve')}
                    </button>
                    <button onClick={() => handleReject(selected._id)} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-60">
                      <XCircle className="w-4 h-4" aria-hidden="true" /> {t('admin.reject')}
                    </button>
                  </div>
                </div>
              )}

              {selected.status === 'revoked' && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                  <button onClick={() => handleApprove(selected._id)} disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-60">
                    <CheckCircle className="w-4 h-4" aria-hidden="true" /> {t('admin.restoreSeller')}
                  </button>
                </div>
              )}

              {selected.status === 'approved' && sellerCommission !== null && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('admin.commissionRate')}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.commissionDesc')}</p>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <input type="number" value={commissionInput} onChange={e => setCommissionInput(e.target.value)} min="0" max="100" step="0.5"
                        aria-label={t('admin.commissionRate')}
                        className="w-full px-3 py-2.5 pr-8 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                    </div>
                    <button onClick={handleUpdateCommission} disabled={commissionLoading || String(sellerCommission) === commissionInput}
                      className="px-4 py-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl text-sm font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50">
                      {commissionLoading ? '...' : t('admin.saveCommission')}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('admin.currentCommission').replace('{rate}', String(sellerCommission))}</p>
                </div>
              )}

              {selected.status === 'approved' && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder={t('admin.revokeReasonPlaceholder')} rows={2}
                    aria-label={t('admin.revokeReasonPlaceholder')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                  <button onClick={() => handleRevoke(selected._id)} disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl text-sm font-semibold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-60">
                    <UserX className="w-4 h-4" aria-hidden="true" /> {t('admin.revoke')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Report modal ── */}
      {selectedReport && (
        <div role="dialog" aria-modal="true" aria-labelledby="report-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setSelectedReport(null)} />
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" aria-hidden="true" />
                <h2 id="report-dialog-title" className="font-semibold text-slate-900 dark:text-white text-sm">Report Details</h2>
              </div>
              <button onClick={() => setSelectedReport(null)} aria-label="Close" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${reportStatusStyle(selectedReport.status)}`}>
                  {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">Buyer</p><p className="font-medium text-slate-900 dark:text-white">{selectedReport.user?.name}</p><p className="text-xs text-slate-600 dark:text-slate-400">{selectedReport.user?.email}</p></div>
                <div><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">Order ID</p><p className="font-mono font-medium text-slate-900 dark:text-white">{selectedReport.orderId}</p></div>
                {selectedReport.eventName && <div className="col-span-2"><p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">Event</p><p className="font-medium text-slate-900 dark:text-white">{selectedReport.eventName}</p></div>}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Reason</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 leading-relaxed">{selectedReport.reason}</p>
              </div>

              {selectedReport.adminNote && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Admin Note</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3">{selectedReport.adminNote}</p>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <textarea
                  value={reportNote}
                  onChange={e => setReportNote(e.target.value)}
                  placeholder="Add admin note (visible to buyer)..."
                  aria-label="Add admin note"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-slate-400"
                />
                <div className="flex gap-2">
                  {selectedReport.status !== 'pending' && (
                    <button onClick={() => handleReportStatus(selectedReport._id, 'pending')} disabled={reportActionLoading}
                      className="flex-1 py-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl text-sm font-semibold hover:bg-amber-200 transition-colors disabled:opacity-60">
                      Mark Pending
                    </button>
                  )}
                  {selectedReport.status !== 'closed' && (
                    <button onClick={() => handleReportStatus(selectedReport._id, 'closed')} disabled={reportActionLoading}
                      className="flex-1 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-60">
                      Close Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
