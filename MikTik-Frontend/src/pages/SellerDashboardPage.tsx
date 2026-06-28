import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Eye, Trash2, CheckCircle, Clock, ShieldCheck, Ticket, ArrowRight, MapPin, Calendar, Tag, Star, Edit3, X, Save, ExternalLink, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Pagination from '../components/Pagination';

const API = 'http://localhost:5000/api';

interface SellerProfileData {
  name: string;
  bio: string;
  description: string;
  location: string;
  socialLinks: { instagram?: string; twitter?: string };
  verified: boolean;
  rating: number | null;
  totalReviews: number;
  totalSales: number;
  ratingVisible: boolean;
  memberSince: string;
}

type StatusFilter = 'all' | 'sold' | 'pending';

interface Listing {
  id: string;
  name: string;
  category: string;
  date: string;
  venue: string;
  city: string;
  price: number;
  available: number;
  status: 'active' | 'sold' | 'pending';
  views: number;
}

export default function SellerDashboardPage() {
  useEffect(() => { document.title = 'Seller Dashboard | MikTik'; }, []);

  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const { t } = useLanguage();

  // Profile state
  const [profile, setProfile] = useState<SellerProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editTwitter, setEditTwitter] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const PAGE_SIZE = 10;

  const STATUS_CFG = {
    active:  { label: t('status.active'),   icon: CheckCircle, classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
    sold:    { label: t('status.soldOut'),   icon: TrendingUp,  classes: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' },
    pending: { label: t('status.pending'),   icon: Clock,       classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
  };

  useEffect(() => {
    const token = localStorage.getItem('tt_token');
    fetch(`${API}/tickets/my`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data =>
        setListings(
          (data.tickets || []).map((t: any) => ({
            id: t.id ?? t._id,
            name: t.name,
            category: t.category,
            date: t.date,
            venue: t.venue,
            city: t.city,
            price: t.price,
            available: t.available,
            status: t.status,
            views: t.views ?? 0,
          }))
        )
      )
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('tt_token');
    if (!token) return;
    fetch(`${API}/sellers/me/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProfile(data); })
      .catch(() => {});
  }, []);

  const startEditing = () => {
    if (!profile) return;
    setEditBio(profile.bio);
    setEditDescription(profile.description);
    setEditLocation(profile.location);
    setEditInstagram(profile.socialLinks?.instagram ?? '');
    setEditTwitter(profile.socialLinks?.twitter ?? '');
    setSaveError('');
    setSaveSuccess(false);
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const token = localStorage.getItem('tt_token');
      const res = await fetch(`${API}/sellers/me/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          bio: editBio,
          description: editDescription,
          location: editLocation,
          instagram: editInstagram,
          twitter: editTwitter,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setProfile(prev => prev ? { ...prev, ...data } : prev);
      setSaveSuccess(true);
      setEditing(false);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('seller.deleteConfirm'))) return;
    setDeleting(id);
    const token = localStorage.getItem('tt_token');
    try {
      const res = await fetch(`${API}/tickets/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setListings(prev => prev.filter(l => l.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const totalEarned = listings
    .filter(l => l.status === 'sold')
    .reduce((s, l) => s + l.price, 0);

  const active = listings.filter(l => l.status === 'active').length;
  const sold = listings.filter(l => l.status === 'sold').length;
  const pending = listings.filter(l => l.status === 'pending').length;

  const TABS: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all',     label: 'All',     count: listings.length },
    { key: 'sold',    label: 'Sold',    count: sold },
    { key: 'pending', label: 'Pending', count: pending },
  ];

  const filteredListings = activeTab === 'all'
    ? listings
    : listings.filter(l => l.status === activeTab);

  const totalPages = Math.ceil(filteredListings.length / PAGE_SIZE) || 1;
  const pagedListings = filteredListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('seller.title')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('seller.subtitle')}</p>
          </div>
          <Link
            to="/sell"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> {t('seller.newListing')}
          </Link>
        </div>

        {/* Profile card */}
        {profile && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 mb-8">
            {!editing ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {(profile.name || 'S')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-slate-900 dark:text-white text-lg">{profile.name}</span>
                      {profile.verified && (
                        <span className="flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> ID Verified
                        </span>
                      )}
                    </div>
                    {profile.bio ? (
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{profile.bio}</p>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 italic">No bio added yet</p>
                    )}
                    {profile.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 leading-relaxed line-clamp-2">{profile.description}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600 dark:text-slate-400">
                      {profile.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>
                      )}
                      {profile.socialLinks?.instagram && (
                        <span className="flex items-center gap-1"><AtSign className="w-3 h-3" />@{profile.socialLinks.instagram.replace(/^@/, '')}</span>
                      )}
                      {profile.socialLinks?.twitter && (
                        <span className="flex items-center gap-1"><AtSign className="w-3 h-3" />@{profile.socialLinks.twitter.replace(/^@/, '')}</span>
                      )}
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Since {profile.memberSince}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={startEditing}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                    {user?.id && (
                      <Link
                        to={`/seller/${user.id}`}
                        target="_blank"
                        className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> View public profile
                      </Link>
                    )}
                  </div>
                </div>

                {/* Rating row */}
                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-slate-900 dark:text-white">{profile.totalSales}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Sales</div>
                  </div>
                  <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
                  {profile.ratingVisible ? (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(profile.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                        ))}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{(profile.rating ?? 0).toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({profile.totalReviews} review{profile.totalReviews !== 1 ? 's' : ''})</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Rating unlocks after 5 reviews ({profile.totalReviews}/5)
                    </div>
                  )}
                  {saveSuccess && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" /> Profile saved
                    </span>
                  )}
                </div>
              </>
            ) : (
              /* Edit form */
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Edit Profile</h3>
                  <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Short Bio <span className="font-normal normal-case text-slate-300 dark:text-slate-600">— tagline shown at the top of your profile ({editBio.length}/160)</span>
                    </label>
                    <input
                      type="text"
                      value={editBio}
                      onChange={e => setEditBio(e.target.value.slice(0, 160))}
                      placeholder="e.g. Passionate about live events · Selling since 2022"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Description <span className="font-normal normal-case text-slate-300 dark:text-slate-600">— tell buyers about yourself ({editDescription.length}/1000)</span>
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value.slice(0, 1000))}
                      rows={4}
                      placeholder="Describe your experience, why you sell tickets, what kinds of events you attend…"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Location</label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={e => setEditLocation(e.target.value.slice(0, 100))}
                        placeholder="Tel Aviv, Israel"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        <AtSign className="w-3 h-3" /> Instagram
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                        <input
                          type="text"
                          value={editInstagram.replace(/^@/, '')}
                          onChange={e => setEditInstagram(e.target.value.replace(/^@/, '').slice(0, 100))}
                          placeholder="username"
                          className="w-full pl-7 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        <AtSign className="w-3 h-3" /> X / Twitter
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                        <input
                          type="text"
                          value={editTwitter.replace(/^@/, '')}
                          onChange={e => setEditTwitter(e.target.value.replace(/^@/, '').slice(0, 100))}
                          placeholder="username"
                          className="w-full pl-7 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {saveError && <p className="text-xs text-red-600 dark:text-red-400 mt-3">{saveError}</p>}
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save Profile'}
                  </button>
                  <button onClick={() => setEditing(false)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('seller.totalListings'), value: listings.length },
            { label: t('seller.active'),        value: active },
            { label: t('seller.totalViews'),    value: listings.reduce((s, l) => s + l.views, 0) },
            { label: t('seller.totalEarned'),   value: `₪${totalEarned.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Verification notice */}
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {t('seller.escrowNotice')}
          </p>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl mb-6 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.key
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                    : 'bg-slate-200 dark:bg-zinc-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              {activeTab === 'all' ? t('seller.noListings') : `No ${TABS.find(tab => tab.key === activeTab)?.label.toLowerCase()} listings`}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('seller.noListingsSub')}</p>
            {activeTab === 'all' && (
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> {t('seller.listTicket')} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {pagedListings.map(l => {
              const cfg = STATUS_CFG[l.status] ?? STATUS_CFG.active;
              const StatusIcon = cfg.icon;
              const eventDate = l.date
                ? new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—';
              return (
                <div key={l.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{l.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.classes}`}>
                          <StatusIcon className="w-3 h-3" />{cfg.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400">
                          <Tag className="w-3 h-3" />{l.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />{eventDate}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <MapPin className="w-3 h-3" />{l.city} · {l.venue}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(l.id)}
                      disabled={deleting === l.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white">₪{l.price}</span>
                    <span>{l.available} {t('seller.remaining')}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views} {t('seller.views')}</span>
                    <Link
                      to={`/ticket/${l.id}`}
                      className="ml-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                    >
                      {t('seller.viewListing')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination page={page} pages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
