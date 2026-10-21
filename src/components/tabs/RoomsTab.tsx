import React from 'react';
import { ApeInspection, RoomData } from '../../types/ape';
import { VoiceNoteButton } from '../VoiceNoteButton';
import { Plus, Trash2, Calculator, LayoutGrid } from 'lucide-react';

interface RoomsTabProps {
  inspection: ApeInspection;
  onChange: (updated: ApeInspection) => void;
}

const COMMON_ROOM_PRESETS = [
  'Soggiorno',
  'Cucina abitabile',
  'Angolo cottura',
  'Camera matrimoniale',
  'Camera singola',
  'Camera doppia',
  'Bagno padronale',
  'Bagno di servizio',
  'Disimpegno / Corridoio',
  'Ripostiglio',
  'Ingresso',
  'Studio',
  'Taverna / Locale hobby',
  'Mansarda',
];

export const RoomsTab: React.FC<RoomsTabProps> = ({ inspection, onChange }) => {
  const rooms = inspection.rooms;

  const totalSu = rooms.reduce((acc, r) => acc + (Number(r.surfaceM2) || 0), 0);
  const avgHeight = rooms.length > 0
    ? rooms.reduce((acc, r) => acc + (Number(r.heightM) || 0), 0) / rooms.length
    : 2.7;
  const netVolume = totalSu * avgHeight;
  const grossVolumeEst = netVolume * 1.25; // Standard technical estimate coefficient

  const updateRoom = (id: string, updates: Partial<RoomData>) => {
    const nextRooms = rooms.map((r) => {
      if (r.id !== id) return r;
      const merged = { ...r, ...updates };
      // If length or width changed and not manual override, recalculate surface
      if ('lengthM' in updates || 'widthM' in updates) {
        const l = Number(merged.lengthM) || 0;
        const w = Number(merged.widthM) || 0;
        if (l > 0 && w > 0) {
          merged.surfaceM2 = Number((l * w).toFixed(2));
        }
      }
      return merged;
    });

    onChange({
      ...inspection,
      rooms: nextRooms,
      updatedAt: new Date().toISOString(),
    });
  };

  const addRoom = (namePreset = 'Nuovo Vano') => {
    const defaultH = rooms.length > 0 ? rooms[0].heightM : 2.9;
    const newRoom: RoomData = {
      id: `room-${Date.now()}`,
      name: namePreset,
      floor: inspection.cadastralData.piano || '1°',
      lengthM: 4.0,
      widthM: 3.5,
      heightM: defaultH,
      surfaceM2: 14.0,
      windowsCount: 1,
      notes: '',
    };

    onChange({
      ...inspection,
      rooms: [...rooms, newRoom],
      updatedAt: new Date().toISOString(),
    });
  };

  const removeRoom = (id: string) => {
    onChange({
      ...inspection,
      rooms: rooms.filter((r) => r.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Riepilogo Geometrico APE - Big Numbers & Tabular Figure Discipline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
            <Calculator className="w-4 h-4" />
            <span>BILANCIO GEOMETRICO & SUPERFICI CLIMATIZZATE (UNI/TS 11300)</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {rooms.length} {rooms.length === 1 ? 'vano rilevato' : 'vani rilevati'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <span className="block text-[11px] font-medium text-slate-500">Superficie Utile Calpestabile (Su)</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalSu.toFixed(2)} <span className="text-xs font-normal text-slate-500">m²</span>
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-500">Altezza Media Utile Netta (H)</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {avgHeight.toFixed(2)} <span className="text-xs font-normal text-slate-500">m</span>
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-500">Volume Netto Riscaldato (Vn)</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {netVolume.toFixed(1)} <span className="text-xs font-normal text-slate-500">m³</span>
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-500">Volume Lordo Stimato (Vg)</span>
            <span className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
              ~{grossVolumeEst.toFixed(1)} <span className="text-xs font-normal text-indigo-500">m³</span>
            </span>
          </div>
        </div>

        {/* Quick add presets */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            Aggiungi vano rapido:
          </span>
          {COMMON_ROOM_PRESETS.slice(0, 7).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => addRoom(preset)}
              className="min-h-[36px] px-2.5 py-1 text-xs bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 rounded-lg transition-colors active:scale-95"
            >
              + {preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => addRoom('Altro Vano')}
            className="min-h-[36px] px-3 py-1 text-xs bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            + Altro
          </button>
        </div>
      </div>

      {/* Elenco e Tabella Dimensionale Vani per iPad */}
      <div className="space-y-4">
        {rooms.map((room, idx) => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                  placeholder="Nome del vano"
                  className="font-semibold text-sm text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded border border-transparent focus:border-indigo-600 focus:outline-none w-full sm:w-64"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <VoiceNoteButton
                  label="Detta nota vano"
                  onTranscript={(text) => {
                    const current = room.notes ? `${room.notes} ` : '';
                    updateRoom(room.id, { notes: `${current}${text}.` });
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  title="Elimina vano"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Misure: Lunghezza x Larghezza x Altezza -> Superficie */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Lunghezza (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={room.lengthM}
                  onChange={(e) => updateRoom(room.id, { lengthM: Number(e.target.value) || 0 })}
                  className="w-full h-11 px-3 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Larghezza (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={room.widthM}
                  onChange={(e) => updateRoom(room.id, { widthM: Number(e.target.value) || 0 })}
                  className="w-full h-11 px-3 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Altezza Netta (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={room.heightM}
                  onChange={(e) => updateRoom(room.id, { heightM: Number(e.target.value) || 0 })}
                  className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Superficie Calcolata (m²)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={room.surfaceM2}
                  onChange={(e) => updateRoom(room.id, { surfaceM2: Number(e.target.value) || 0 })}
                  className="w-full h-11 px-3 text-sm font-mono font-bold bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Finestre / Portefinestre
                </label>
                <input
                  type="number"
                  min="0"
                  value={room.windowsCount}
                  onChange={(e) => updateRoom(room.id, { windowsCount: Number(e.target.value) || 0 })}
                  className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Note specifiche sul vano */}
            <div className="mt-3">
              <input
                type="text"
                value={room.notes}
                onChange={(e) => updateRoom(room.id, { notes: e.target.value })}
                placeholder="Note rilievo: dimensioni infissi (LxH), radiatore (elementi/materiale), parete esterna disperdente..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
