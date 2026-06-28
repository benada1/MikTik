import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Clock, XCircle, Upload, User, MapPin, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';
type AppStatus = 'none' | 'pending' | 'approved' | 'rejected';

interface FormState {
  fullName: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  street: string;
  city: string;
  country: string;
  bio: string;
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
        <Icon className="w-4 h-4 text-indigo-500" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        <span className="block mb-1.5">
          {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          {required && <span className="sr-only">(required)</span>}
        </span>
        {children}
      </label>
    </div>
  );
}

const INPUT = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600";
const INPUT_READONLY = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed";

export default function BecomeSellerPage() {
  useEffect(() => { document.title = 'Become a Seller | MikTik'; }, []);

  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const [appStatus, setAppStatus] = useState<AppStatus>('none');
  const [rejectionReason, setRejectionReason] = useState('');
  const [hasExistingIdImage, setHasExistingIdImage] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: user?.name || '',
    phone: '',
    idNumber: '',
    dateOfBirth: '',
    street: '',
    city: '',
    country: 'Israel',
    bio: '',
  });
  const [idImage, setIdImage] = useState<File | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.permissionLevel >= 2) {
      navigate('/sell', { replace: true });
      return;
    }
    const token = localStorage.getItem('tt_token');
    fetch(`${API}/seller-applications/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.application) {
          const app = data.application;
          setAppStatus(app.status);
          setRejectionReason(app.rejectionReason || '');
          setHasExistingIdImage(!!app.idImageUrl);
          if (app.status === 'rejected') {
            setForm({
              fullName: app.fullName || user?.name || '',
              phone: app.phone || '',
              idNumber: app.idNumber || '',
              dateOfBirth: app.dateOfBirth ? app.dateOfBirth.slice(0, 10) : '',
              street: app.address?.street || '',
              city: app.address?.city || '',
              country: app.address?.country || 'Israel',
              bio: app.bio || '',
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, [user, navigate]);

  const set = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdImage(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idImage && !hasExistingIdImage) {
      setError(t('becomeSeller.uploadIdError'));
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('tt_token');
      const fd = new FormData();
      fd.append('fullName', form.fullName);
      fd.append('phone', form.phone);
      fd.append('idNumber', form.idNumber);
      fd.append('dateOfBirth', form.dateOfBirth);
      fd.append('street', form.street);
      fd.append('city', form.city);
      fd.append('country', form.country);
      fd.append('bio', form.bio);
      if (idImage) fd.append('idImage', idImage);

      const res = await fetch(`${API}/seller-applications`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('becomeSeller.failed'));
      setAppStatus('pending');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (appStatus === 'pending') {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('becomeSeller.underReview')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('becomeSeller.underReviewDesc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('becomeSeller.title')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('becomeSeller.subtitle')}</p>
          </div>
        </div>

        {/* Rejection banner */}
        {appStatus === 'rejected' && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">{t('becomeSeller.previousRejected')}</p>
              {rejectionReason && <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{rejectionReason}</p>}
              <p className="text-xs text-red-500 mt-1">{t('becomeSeller.resubmitBelow')}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">

          {/* Personal information */}
          <Section icon={User} title={t('becomeSeller.personalInfo')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('becomeSeller.accountEmail')}>
                <input type="text" value={user?.email || ''} readOnly className={INPUT_READONLY} />
              </Field>
              <Field label={t('becomeSeller.fullLegalName')} required>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={set('fullName')}
                  placeholder={t('becomeSeller.asOnId')}
                  required
                  className={INPUT}
                />
              </Field>
              <Field label={t('becomeSeller.phoneNumber')} required>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+972 50 000 0000"
                  required
                  className={INPUT}
                />
              </Field>
              <Field label={t('becomeSeller.dateOfBirth')} required>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={set('dateOfBirth')}
                  required
                  className={INPUT}
                />
              </Field>
              <Field label={t('becomeSeller.nationalId')} required>
                <input
                  type="text"
                  value={form.idNumber}
                  onChange={set('idNumber')}
                  placeholder="123456789"
                  required
                  className={INPUT}
                />
              </Field>
            </div>
          </Section>

          {/* Address */}
          <Section icon={MapPin} title={t('becomeSeller.address')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('becomeSeller.streetAddress')}>
                <input
                  type="text"
                  value={form.street}
                  onChange={set('street')}
                  placeholder={t('becomeSeller.streetPlaceholder')}
                  className={INPUT}
                />
              </Field>
              <Field label={t('becomeSeller.city')} required>
                <input
                  type="text"
                  value={form.city}
                  onChange={set('city')}
                  placeholder="Tel Aviv"
                  required
                  className={INPUT}
                />
              </Field>
              <Field label={t('becomeSeller.country')}>
                <select value={form.country} onChange={set('country')} className={INPUT}>
                  <option>{t('becomeSeller.israel')}</option>
                  <option>{t('becomeSeller.unitedStates')}</option>
                  <option>{t('becomeSeller.unitedKingdom')}</option>
                  <option>{t('becomeSeller.other')}</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* Profile */}
          <Section icon={FileText} title={t('becomeSeller.aboutYou')}>
            <Field label={t('becomeSeller.bio')}>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                rows={3}
                placeholder={t('becomeSeller.bioPlaceholder')}
                className={`${INPUT} resize-none`}
              />
            </Field>
          </Section>

          {/* ID document upload */}
          <Section icon={Upload} title={t('becomeSeller.identityVerification')}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('becomeSeller.uploadIdDesc')}
            </p>

            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {idImage ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                </div>
                <p className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">{idImage.name}</p>
                <button
                  type="button"
                  aria-label={`Remove ${idImage.name}`}
                  onClick={() => { setIdImage(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : hasExistingIdImage ? (
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('becomeSeller.previousDocOnFile')}</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  {t('becomeSeller.replace')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-500 transition-colors"
              >
                <Upload className="w-6 h-6" aria-hidden="true" />
                <span className="text-sm font-medium">{t('becomeSeller.uploadIdClick')}</span>
                <span className="text-xs">{t('becomeSeller.uploadIdFormat')}</span>
              </button>
            )}
          </Section>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {submitting ? t('becomeSeller.submitting') : appStatus === 'rejected' ? t('becomeSeller.resubmit') : t('becomeSeller.submitApplication')}
          </button>
        </form>
      </div>
    </div>
  );
}
