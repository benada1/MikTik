import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function AccessibilityStatementPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = lang === 'he' ? 'הצהרת נגישות | MikTik' : 'Accessibility Statement | MikTik';
  }, [lang]);

  if (lang === 'he') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-zinc-950 min-h-screen">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" dir="rtl">הצהרת נגישות</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10" dir="rtl">עודכן לאחרונה: יוני 2026</p>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed" dir="rtl">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">מחויבותנו לנגישות</h2>
            <p>
              MikTik מחויבת לאפשר לכל אדם, כולל אנשים עם מוגבלויות, לגשת ולהשתמש באתר שלנו בצורה שווה ועצמאית.
              אנו שואפים לעמוד בדרישות התקן WCAG 2.1 ברמה AA (הנחיות נגישות לתוכן אינטרנט) ובחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, ותקנות הנגישות לשירות.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">רמת הנגישות</h2>
            <p>
              אנו עובדים להשגת רמת נגישות AA לפי תקן WCAG 2.1. הפעולות שבוצעו כוללות:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>תמיכה בניווט מלא במקלדת בכל רכיבי האתר</li>
              <li>תמיכה בקוראי מסך (NVDA, JAWS, VoiceOver)</li>
              <li>יחסי ניגודיות צבעים העומדים בדרישות WCAG AA</li>
              <li>תגיות ARIA לשיפור הנגישות עבור טכנולוגיות מסייעות</li>
              <li>כותרות עמוד ברורות לניווט קל</li>
              <li>תמיכה בעברית ובאנגלית, כולל כיווניות RTL/LTR</li>
              <li>קישור "דלג לתוכן הראשי" לניווט מהיר</li>
              <li>טפסים עם תוויות ברורות לכל שדה</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">מגבלות ידועות</h2>
            <p>
              אנו ממשיכים לשפר את נגישות האתר ועובדים על תיקון מגבלות שזוהו. אם נתקלתם בבעיית נגישות, אנא צרו איתנו קשר.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">פנייה בנושאי נגישות</h2>
            <p>
              אם נתקלתם בבעיית נגישות, או אם יש לכם הצעות לשיפור, אנא פנו אלינו:
            </p>
            <div className="mt-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl space-y-1 text-sm">
              <p><span className="font-semibold">דוא"ל: </span>
                <a href="mailto:benadziashvili@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  benadziashvili@gmail.com
                </a>
              </p>
              <p className="text-slate-500 dark:text-slate-400">נשתדל להגיב תוך 7 ימי עסקים.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">תקן וציות</h2>
            <p>
              הצהרה זו מתייחסת לאתר <strong>miktik.co.il</strong> ונועדה לעמוד בדרישות תקנות הנגישות לשירות לפי חוק שוויון זכויות לאנשים עם מוגבלות.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-zinc-950 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Accessibility Statement</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: June 2026</p>

      <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Our Commitment</h2>
          <p>
            MikTik is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.
            We aim to conform to <strong>WCAG 2.1 Level AA</strong> (Web Content Accessibility Guidelines) and comply with the Israeli Equal Rights for Persons with Disabilities Law (1998) and its accessibility regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Accessibility Features</h2>
          <p>We have taken the following steps to make this website accessible:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
            <li>Full keyboard navigation support throughout the site</li>
            <li>Screen reader support (NVDA, JAWS, VoiceOver)</li>
            <li>Color contrast ratios meeting WCAG AA requirements</li>
            <li>ARIA attributes for assistive technology compatibility</li>
            <li>Descriptive page titles for easy navigation</li>
            <li>Hebrew and English support with proper RTL/LTR direction</li>
            <li>Skip-to-main-content link for keyboard users</li>
            <li>Properly labeled form fields and error messages</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Known Limitations</h2>
          <p>
            We are continuously working to improve the accessibility of this website and address any known issues. If you encounter an accessibility barrier, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Feedback & Contact</h2>
          <p>
            If you experience any accessibility issues, or if you have suggestions for improvement, please reach out to us:
          </p>
          <div className="mt-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl space-y-1 text-sm">
            <p><span className="font-semibold">Email: </span>
              <a href="mailto:benadziashvili@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                benadziashvili@gmail.com
              </a>
            </p>
            <p className="text-slate-500 dark:text-slate-400">We aim to respond within 7 business days.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Technical Specification</h2>
          <p>
            This statement applies to the website <strong>miktik.co.il</strong>. Accessibility is assessed against the WCAG 2.1 Level AA standard and Israeli accessibility law requirements.
          </p>
        </section>
      </div>
    </div>
  );
}
