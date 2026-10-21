import React, { useState } from 'react';
import { ApeInspection } from '../types/ape';
import { Search, Plus, Trash2, Copy, Calendar, MapPin, Building, ChevronRight, PanelLeftClose } from 'lucide-react';

interface InspectionSidebarProps {
  inspections: ApeInspection[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const InspectionSidebar: React.FC<InspectionSidebarProps> = ({
  inspections,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onDuplicate,
  isOpenOnMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectionToDelete, setInspectionToDelete] = useState<ApeInspection | null>(null);

  const filtered = inspections.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.clientName.toLowerCase().includes(q) ||
      item.cadastralData.subalterno.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ease-in-out shrink-0 ${
          isCollapsed ? 'hidden md:hidden' : 'md:flex'
        } ${
          isOpenOnMobile ? 'translate-x-0 shadow-2xl flex' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header with Search & Quick Collapse */}
        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Archivio Sopralluoghi</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onNew}
                className="text-xs font-medium text-indigo-700 hover:text-indigo-900 flex items-center gap-1 min-h-[36px] px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuovo</span>
              </button>
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Nascondi colonna archivio"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca via, cliente o sub..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* List of Inspections */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Nessun sopralluogo trovato.
            </div>
          ) : (
            filtered.map((item) => {
              const isActive = item.id === activeId;
              const totalRooms = item.rooms.length;
              const totalM2 = item.rooms.reduce((acc, r) => acc + (Number(r.surfaceM2) || 0), 0);
              const photoCount = item.photos.length;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    onCloseMobile();
                  }}
                  className={`group relative rounded-xl p-3.5 transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-indigo-50/70 border border-indigo-200/80 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {item.title || 'Senza Titolo'}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {item.address ? `${item.address}${item.city ? `, ${item.city}` : ''}` : 'Indirizzo da inserire'}
                        </span>
                      </div>

                      {/* Clean Unboxed Metadata with · separator */}
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="tabular-nums flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.inspectionDate}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{photoCount} foto</span>
                      </div>

                      {item.cadastralData.subalterno && (
                        <div className="mt-1 text-[11px] text-indigo-700/80 font-mono">
                          Foglio {item.cadastralData.foglio || '-'} / Sub {item.cadastralData.subalterno}
                        </div>
                      )}
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 mt-1 transition-transform ${
                        isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                      }`}
                    />
                  </div>

                  {/* Actions row on hover / active */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      title="Duplica rilievo"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(item.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-md transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {inspections.length > 1 && (
                      <button
                        type="button"
                        title="Elimina rilievo"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectionToDelete(item);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          {inspections.length} {inspections.length === 1 ? 'rilievo archiviato' : 'rilievi archiviati'} in locale
        </div>
      </aside>

      {/* Confirmation Modal for deleting inspection */}
      {inspectionToDelete && (
        <div
          onClick={() => setInspectionToDelete(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Eliminare sopralluogo?</h4>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">{inspectionToDelete.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tutti i dati tecnici e le foto associate a questo rilievo verranno rimossi definitivamente dall'archivio locale.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectionToDelete(null)}
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(inspectionToDelete.id);
                  setInspectionToDelete(null);
                }}
                className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Elimina Rilievo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
