import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { translations, type Lang } from '../i18n/translations';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'he';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key: string): string =>
    translations[lang][key] ?? translations['en'][key] ?? key;

  return (
    <LanguageContext.Provider
      value={{ lang, toggleLang: () => setLang(l => (l === 'en' ? 'he' : 'en')), t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
