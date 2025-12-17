'use client';

import { useLanguage } from '@/lib/language-context';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        onClick={() => setLanguage('en')}
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`lang-btn ${language === 'es' ? 'active' : ''}`}
      >
        ES
      </button>
    </div>
  );
}
