import React from 'react';
import { Plus, Printer, FileText, PanelLeftClose, PanelLeftOpen, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentView: 'edit' | 'print';
  onViewChange: (view: 'edit' | 'print') => void;
  onNewInspection: () => void;
  activeTitle: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onNewInspection,
  activeTitle,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 md:px-6 flex items-center justify-between gap-3 md:gap-8 shadow-xs">
      {/* Zone 1: Sidebar Toggle & Brand Wordmark */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? 'Mostra colonna archivio sopralluoghi' : 'Nascondi colonna archivio'}
          className={`min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
            isSidebarCollapsed
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {isSidebarCollapsed ? (
            <>
              <PanelLeftOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="hidden lg:inline text-xs font-semibold">Mostra Archivio</span>
            </>
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="hidden lg:inline text-xs text-slate-600">Nascondi</span>
            </>
          )}
        </button>

        <span className="text-base md:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
          Sopralluogo <span className="text-indigo-600 font-semibold">APE</span>
        </span>
        <span className="hidden xl:inline-block text-xs text-slate-400">·</span>
        <span className="hidden xl:inline-block text-xs font-medium text-slate-500 truncate max-w-[220px]">
          {activeTitle || 'Sopralluogo Energetico'}
        </span>
      </div>

      {/* Zone 2: Navigation Links / Views */}
      <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium text-slate-600">
        <button
          type="button"
          onClick={() => onViewChange('edit')}
          className={`min-h-[44px] px-3.5 py-2 flex items-center gap-2 transition-colors whitespace-nowrap text-xs md:text-sm ${
            currentView === 'edit'
              ? 'text-indigo-700 font-semibold border-b-2 border-indigo-600'
              : 'hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Compilazione Rilievo</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange('print')}
          className={`min-h-[44px] px-3.5 py-2 flex items-center gap-2 transition-colors whitespace-nowrap text-xs md:text-sm ${
            currentView === 'print'
              ? 'text-indigo-700 font-semibold border-b-2 border-indigo-600'
              : 'hover:text-slate-900'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Scheda Tecnica A4 (PDF)</span>
        </button>
      </nav>

      {/* Zone 3: Actions & Auto-save Status */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div
          title="Tutti i dati vengono salvati automaticamente ad ogni modifica"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg select-none"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium">Salvataggio automatico</span>
        </div>

        <button
          type="button"
          onClick={onNewInspection}
          className="min-h-[44px] px-4 py-2 text-xs md:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova APE</span>
        </button>
      </div>
    </header>
  );
};
