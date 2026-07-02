import React from 'react';
import { Button } from '../atoms';
import { Logo } from '../molecules';
import { Plus, LogOut } from 'lucide-react';

const tabs = [
  { key: 'home', label: 'Página inicial' },
  { key: 'myReports', label: 'Meus reportes' },
  { key: 'works', label: 'Conheça nossos trabalhos' },
  { key: 'myData', label: 'Perfil' },
];

export function Header({ onNewReportClick, activeTab, onNavigate, user, onLogout }) {
  const handleNavigate = (tab) => {
    if (onNavigate) onNavigate(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Logo size="md" />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleNavigate(tab.key)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                activeTab === tab.key
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-center gap-3">
          {user && (
            <span className="text-sm text-slate-600 hidden md:inline">
              Olá, <span className="font-semibold">{user.name}</span>
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600"
          >
            <LogOut size={16} />
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onNewReportClick}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Reportar
          </Button>
        </div>
      </div>
    </header>
  );
}
