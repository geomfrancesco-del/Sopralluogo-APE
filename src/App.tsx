import React, { useState, useEffect } from 'react';
import { ApeInspection } from './types/ape';
import {
  loadInspectionsFromStorage,
  saveInspectionsToStorage,
  loadActiveInspectionId,
  saveActiveInspectionId,
} from './utils/storage';
import { createEmptyInspection } from './data/initialData';
import { Header } from './components/Header';
import { InspectionSidebar } from './components/InspectionSidebar';
import { GeneralTab } from './components/tabs/GeneralTab';
import { EnvelopeTab } from './components/tabs/EnvelopeTab';
import { PlantTab } from './components/tabs/PlantTab';
import { PhotosTab } from './components/tabs/PhotosTab';
import { PrintTechnicalSheet } from './components/PrintTechnicalSheet';
import {
  Building2,
  Layers,
  Flame,
  Camera,
  Menu,
  Calendar,
} from 'lucide-react';

export default function App() {
  const [inspections, setInspections] = useState<ApeInspection[]>(() =>
    loadInspectionsFromStorage()
  );

  const [activeId, setActiveId] = useState<string>(() => {
    const savedId = loadActiveInspectionId();
    if (savedId && inspections.some((i) => i.id === savedId)) {
      return savedId;
    }
    return inspections[0]?.id || '';
  });

  const [currentView, setCurrentView] = useState<'edit' | 'print'>('edit');
  const [activeTab, setActiveTab] = useState<'general' | 'envelope' | 'plant' | 'photos'>('general');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cantierenote_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Listen to Google Maps quota exceeded event
  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const handleToggleSidebar = () => {
    // If mobile, toggle the mobile drawer
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('cantierenote_sidebar_collapsed', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  // Sync to storage on inspections state change
  useEffect(() => {
    saveInspectionsToStorage(inspections);
  }, [inspections]);

  // Sync active ID to storage
  useEffect(() => {
    if (activeId) {
      saveActiveInspectionId(activeId);
    }
  }, [activeId]);

  const activeInspection =
    inspections.find((i) => i.id === activeId) || inspections[0];

  const handleUpdateActiveInspection = (updated: ApeInspection) => {
    setInspections((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleCreateNewInspection = () => {
    const newInspection = createEmptyInspection();
    setInspections((prev) => [newInspection, ...prev]);
    setActiveId(newInspection.id);
    setCurrentView('edit');
    setActiveTab('general');
    setMobileSidebarOpen(false);
  };

  const handleDuplicateInspection = (id: string) => {
    const target = inspections.find((i) => i.id === id);
    if (!target) return;
    const duplicated: ApeInspection = {
      ...JSON.parse(JSON.stringify(target)),
      id: `ape-${Date.now()}`,
      title: `${target.title} (Copia)`,
      updatedAt: new Date().toISOString(),
    };
    setInspections((prev) => [duplicated, ...prev]);
    setActiveId(duplicated.id);
  };

  const handleDeleteInspection = (id: string) => {
    const remaining = inspections.filter((i) => i.id !== id);
    if (remaining.length > 0) {
      setInspections(remaining);
      if (activeId === id) {
        setActiveId(remaining[0].id);
      }
    }
  };

  // Sync document title so when saving to PDF the browser suggests the inspection name
  useEffect(() => {
    if (activeInspection?.title) {
      document.title = `${activeInspection.title} - Sopralluogo APE`;
    }
  }, [activeInspection?.title]);

  // Calculations for KPI bar
  const photoCount = activeInspection?.photos.length || 0;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Google Maps Quota Warning Banner (if triggered) */}
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewInspection={handleCreateNewInspection}
        activeTitle={activeInspection?.title || ''}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Body: Print View or Editing View */}
      {currentView === 'print' && activeInspection ? (
        <PrintTechnicalSheet
          inspection={activeInspection}
          onBackToEdit={() => setCurrentView('edit')}
          onUpdateInspection={handleUpdateActiveInspection}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Drawer on iPad / Desktop */}
          {activeInspection && (
            <InspectionSidebar
              inspections={inspections}
              activeId={activeId}
              onSelect={setActiveId}
              onNew={handleCreateNewInspection}
              onDelete={handleDeleteInspection}
              onDuplicate={handleDuplicateInspection}
              isOpenOnMobile={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={handleToggleSidebar}
            />
          )}

          {/* Main Editing Workspace */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 flex flex-col transition-all">
            <div className={`w-full mx-auto space-y-5 flex-1 transition-all ${isSidebarCollapsed ? 'max-w-6xl' : 'max-w-5xl'}`}>
              {/* Mobile Drawer Trigger Bar */}
              <div className="md:hidden flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-800 min-h-[44px] px-2 py-1 rounded-lg hover:bg-slate-100"
                >
                  <Menu className="w-5 h-5 text-indigo-700" />
                  <span>Elenco Sopralluoghi ({inspections.length})</span>
                </button>
                <span className="text-xs font-mono font-medium text-slate-500 truncate max-w-[160px]">
                  {activeInspection?.title}
                </span>
              </div>

              {activeInspection ? (
                <>
                  {/* Contextual Inspection Header Banner */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>Attestato di Prestazione Energetica</span>
                        {activeInspection.cadastralData.subalterno && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-indigo-700 font-semibold">
                              Sub {activeInspection.cadastralData.subalterno}
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                        {activeInspection.title}
                      </h2>
                      <div className="text-xs text-slate-600 mt-0.5 truncate">
                        {activeInspection.address ? `${activeInspection.address}, ${activeInspection.city}` : 'Indirizzo non specificato'}
                        {activeInspection.clientName && ` · Committente: ${activeInspection.clientName}`}
                      </div>
                    </div>

                    {/* Quick Metrics & Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-center">
                      <div className="text-right px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 hidden sm:block">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Foto Rilievo</span>
                        <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                          {photoCount} foto
                        </span>
                      </div>

                      {/* Campo Data Sopralluogo */}
                      <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors shadow-2xs">
                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <label htmlFor="header-inspection-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">
                            Data Sopralluogo
                          </label>
                          <input
                            id="header-inspection-date"
                            type="date"
                            value={activeInspection.inspectionDate}
                            onChange={(e) =>
                              handleUpdateActiveInspection({
                                ...activeInspection,
                                inspectionDate: e.target.value,
                                updatedAt: new Date().toISOString(),
                              })
                            }
                            className="text-xs sm:text-sm font-mono font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Tab Bar for iPad (Touch-friendly Hitboxes >= 44px) */}
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-xl overflow-x-auto">
                    {[
                      { id: 'general', label: '1. Dati Generali', icon: Building2 },
                      { id: 'envelope', label: '2. Involucro e Serramenti', icon: Layers },
                      { id: 'plant', label: '3. Impianti', icon: Flame },
                      { id: 'photos', label: `4. Foto (${photoCount})`, icon: Camera },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id as typeof activeTab)}
                          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all active:scale-98 ${
                            isActive
                              ? 'bg-white text-indigo-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Tab Panel */}
                  <div className="pb-12">
                    {activeTab === 'general' && (
                      <GeneralTab
                        inspection={activeInspection}
                        onChange={handleUpdateActiveInspection}
                      />
                    )}

                    {activeTab === 'envelope' && (
                      <EnvelopeTab
                        inspection={activeInspection}
                        onChange={handleUpdateActiveInspection}
                      />
                    )}

                    {activeTab === 'plant' && (
                      <PlantTab
                        inspection={activeInspection}
                        onChange={handleUpdateActiveInspection}
                      />
                    )}

                    {activeTab === 'photos' && (
                      <PhotosTab
                        inspection={activeInspection}
                        onChange={handleUpdateActiveInspection}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-600">Nessun sopralluogo selezionato.</p>
                  <button
                    type="button"
                    onClick={handleCreateNewInspection}
                    className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
                  >
                    Crea primo sopralluogo APE
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
