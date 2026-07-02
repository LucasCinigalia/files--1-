import React, { useEffect, useState } from 'react';
import { Header, Footer, AboutModal } from '../organisms';

export function MainTemplate({ 
  onNewReportClick,
  activeTab,
  onNavigate,
  children 
}) {
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const btn = document.getElementById('about-btn');
    if (!btn) return;
    const handler = () => setAboutOpen(true);
    btn.addEventListener('click', handler);
    return () => btn.removeEventListener('click', handler);
  }, []);

  return (
    <div className="app-shell flex flex-col">
      <Header 
        onNewReportClick={onNewReportClick} 
        activeTab={activeTab}
        onNavigate={onNavigate}
      />
      
      <main className="flex-1 pt-6">
        {children}
      </main>
      
      <Footer />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
