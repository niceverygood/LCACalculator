import type { ReactNode } from 'react';
import { useLanguage, Language } from '../i18n';

interface LayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function Layout({ left, right }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{t('title')}</h1>
            <p className="subtitle">{t('subtitle')}</p>
          </div>
          <div className="language-selector">
            <select value={language} onChange={handleLanguageChange}>
              <option value="ko">🇰🇷 한국어</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="column left-column">{left}</div>
        <div className="column right-column">{right}</div>
      </main>
      <footer className="app-footer">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}
