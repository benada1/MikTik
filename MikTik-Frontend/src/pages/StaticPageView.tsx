import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Pencil, Save, X, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';

const SLUG_TITLES: Record<string, { en: string; he: string }> = {
  'privacy-policy': { en: 'Privacy Policy', he: 'מדיניות פרטיות' },
  'terms-of-service': { en: 'Terms of Service', he: 'תנאי שימוש' },
};

export default function StaticPageView() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, ''); // "/privacy-policy" → "privacy-policy"
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const isAdmin = user?.permissionLevel === 3;

  const [content, setContent] = useState('');
  const [draft, setDraft] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const pageTitle = slug ? (SLUG_TITLES[slug]?.[lang] ?? slug) : '';

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | MikTik` : 'MikTik';
  }, [pageTitle]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setEditing(false);
    fetch(`${API}/static-pages/${slug}`)
      .then(r => r.json())
      .then(data => {
        setContent(data.content ?? '');
        setUpdatedAt(data.updatedAt ?? null);
      })
      .catch(() => setError(t('staticPage.loadError')))
      .finally(() => setLoading(false));
  }, [slug]);

  const startEdit = () => {
    setDraft(content);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft('');
  };

  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('tt_token');
      const res = await fetch(`${API}/static-pages/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setContent(data.content);
      setUpdatedAt(data.updatedAt);
      setEditing(false);
      setDraft('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
            {updatedAt && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {t('staticPage.lastUpdated')}: {new Date(updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {isAdmin && !editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            {t('staticPage.edit')}
          </button>
        )}

        {isAdmin && editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {t('staticPage.cancel')}
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? t('staticPage.saving') : t('staticPage.save')}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
        {editing ? (
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full min-h-[60vh] p-6 text-sm text-slate-700 dark:text-slate-300 bg-transparent resize-y font-mono leading-relaxed focus:outline-none"
            dir="auto"
          />
        ) : (
          <div className="p-6 sm:p-8">
            <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans" dir="auto">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
