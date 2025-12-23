import type { ReactNode } from 'react';

interface LayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function Layout({ left, right }: LayoutProps) {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>탄소 배출량 계산기 (LCA Calculator)</h1>
        <p className="subtitle">GWG 펠릿 vs HDPE/LDPE/PP 비교 분석</p>
      </header>
      <main className="main-content">
        <div className="column left-column">{left}</div>
        <div className="column right-column">{right}</div>
      </main>
      <footer className="app-footer">
        <p>© 2024 LCA Calculator - 탄소 배출량 분석 도구</p>
      </footer>
    </div>
  );
}

