import { useNavigate } from 'react-router-dom';
import {
  X, ShoppingBag, Tag, Calendar, Clock, CheckCircle2, XCircle, FileText, Bell,
} from 'lucide-react';
import { useNotifications, type Notification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  ticket_purchased: <ShoppingBag className="w-4 h-4 text-indigo-500" />,
  ticket_sold: <Tag className="w-4 h-4 text-green-500" />,
  event_reminder_week: <Calendar className="w-4 h-4 text-amber-500" />,
  event_reminder_day: <Clock className="w-4 h-4 text-orange-500" />,
  ticket_expired: <XCircle className="w-4 h-4 text-red-500" />,
  seller_approved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  seller_rejected: <XCircle className="w-4 h-4 text-red-500" />,
  report_updated: <FileText className="w-4 h-4 text-blue-500" />,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface Props {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: Props) {
  const { notifications, unreadCount, markRead, markAllRead, deleteNotification } = useNotifications();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClick = async (n: Notification) => {
    if (!n.read) await markRead(n._id);
    if (n.link) {
      navigate(n.link);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/8">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="font-semibold text-sm text-slate-900 dark:text-white">
            {t('notif.title')}
          </span>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline px-1"
            >
              {t('notif.markAllRead')}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400 dark:text-slate-500">
            <Bell className="w-8 h-8 opacity-30" />
            <span className="text-sm">{t('notif.empty')}</span>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n._id}
              onClick={() => handleClick(n)}
              className={`group flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                !n.read ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {TYPE_ICONS[n.type] ?? <Bell className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <span className={`text-sm font-medium leading-snug ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                    {n.title}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotification(n._id); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/15 transition-all"
                    aria-label="Dismiss"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                  {n.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{timeAgo(n.createdAt)}</span>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
