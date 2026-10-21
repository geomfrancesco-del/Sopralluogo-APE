import React from 'react';
import { ApeInspection, BuildingEnvelope } from '../../types/ape';
import { VoiceNoteButton } from '../VoiceNoteButton';
import { Layers, Square, Eye, FileText } from 'lucide-react';

interface EnvelopeTabProps {
  inspection: ApeInspection;
  onChange: (updated: ApeInspection) => void;
}

const SPESSORI_ISOLANTE = [
  { value: '', label: '-- Seleziona Spessore --' },
  { value: '0', label: 'Nessuno / Assente' },
  { value: '2', label: '2 cm' },
  { value: '3', label: '3 cm' },
  { value: '4', label: '4 cm' },
  { value: '5', label: '5 cm' },
  { value: '6', label: '6 cm' },
  { value: '7', label: '7 cm' },
  { value: '8', label: '8 cm' },
  { value: '9', label: '9 cm' },
  { value: '10', label: '10 cm' },
  { value: '11', label: '11 cm' },
  { value: '12', label: '12 cm' },
];

export const EnvelopeTab: React.FC<EnvelopeTabProps> = ({ inspection, onChange }) => {
  const envelope = inspection.buildingEnvelope;

  const updateEnvelope = (field: keyof BuildingEnvelope, val: string | number) => {
    onChange({
      ...inspection,
      buildingEnvelope: {
        ...inspection.buildingEnvelope,
        [field]: val,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleNoteChange = (text: string) => {
    onChange({
      ...inspection,
      buildingEnvelope: {
        ...inspection.buildingEnvelope,
        noteInvolucro: text,
        pontiTermiciNote: text,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Strutture Opache Verticali (Pareti Esterne) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <Layers className="w-4 h-4" />
          <span>PARETI PERIMETRALI & STRUTTURE OPACHE VERTICALI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipologia Costruttiva Muratura Esterna *
            </label>
            <select
              value={envelope.muratureTipo || ''}
              onChange={(e) => updateEnvelope('muratureTipo', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Tipologia Muratura --</option>
              <option value="Muratura In Mattoni Pieni">Muratura In Mattoni Pieni</option>
              <option value="Muratura In Pietra">Muratura In Pietra</option>
              <option value="Blocchi Forati">Blocchi Forati</option>
              <option value="Pannelli Prefabbricati C.A.">Pannelli Prefabbricati C.A.</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Isolamento Termico a Cappotto / Esterno *
            </label>
            <select
              value={envelope.isolamentoEsterno || ''}
              onChange={(e) => updateEnvelope('isolamentoEsterno', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Isolamento Termico --</option>
              <option value="Assente (Nessun Isolamento)">Assente (Nessun Isolamento)</option>
              <option value="Cappotto Termico EPS / Grafite">Cappotto Termico EPS / Grafite</option>
              <option value="Cappotto In Lana Di Roccia / Fibra Minerale">Cappotto In Lana Di Roccia / Fibra Minerale</option>
              <option value="Isolamento Interno Controparete">Isolamento Interno Controparete</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Spessore Isolante Muratura *
            </label>
            <select
              value={envelope.isolamentoSpessoreCm !== undefined && envelope.isolamentoSpessoreCm !== null ? String(envelope.isolamentoSpessoreCm) : ''}
              onChange={(e) => updateEnvelope('isolamentoSpessoreCm', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              {SPESSORI_ISOLANTE.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Solai Disperdenti e Copertura */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <Square className="w-4 h-4" />
          <span>SOLAI ORIZZONTALI DISPERDENTI & COPERTURA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dispersione Verso Basso / Solaio Inferiore *
            </label>
            <select
              value={envelope.solaiDisperdenti || ''}
              onChange={(e) => updateEnvelope('solaiDisperdenti', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Dispersione Verso Basso --</option>
              <option value="Solaio Inferiore Verso Piano Riscaldato (Interpiano)">Verso Piano Sottostante Riscaldato (Interpiano, No Dispersione)</option>
              <option value="Verso Cantina O Corsello Box Non Riscaldato">Verso Cantina / Garage Non Riscaldato</option>
              <option value="Verso Terreno Con Vespaio Areato">Verso Terreno Con Vespaio Areato</option>
              <option value="Verso Terreno Controterra (Diretto)">Verso Terreno Controterra (Diretto)</option>
              <option value="Verso Esterno / Pilotis Aperto">Verso Esterno / Pilotis Aperto</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Stato Isolamento Solaio Inferiore
            </label>
            <input
              type="text"
              value={envelope.solaiIsolamento}
              onChange={(e) => updateEnvelope('solaiIsolamento', e.target.value)}
              placeholder="es. Privo Di Isolamento oppure Pannelli XPS 6 cm"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dispersione verso alto / Solaio Superiore *
            </label>
            <select
              value={envelope.tettoTipo || ''}
              onChange={(e) => updateEnvelope('tettoTipo', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Dispersione Verso Alto --</option>
              <option value="Appartamento Superiore Riscaldato">Appartamento Superiore Riscaldato</option>
              <option value="Sottotetto Non Riscaldato">Sottotetto Non Riscaldato</option>
              <option value="Copertura Piana Verso Esterno">Copertura Piana Verso Esterno</option>
              <option value="Copertura A Falde Verso Esterno">Copertura A Falde Verso Esterno</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Stato Isolamento Solaio Superiore
            </label>
            <input
              type="text"
              value={envelope.tettoIsolamento || ''}
              onChange={(e) => updateEnvelope('tettoIsolamento', e.target.value)}
              placeholder="es. Privo Di Isolamento oppure Lana Di Roccia 8 cm"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Serramenti, Vetri e Chiusure Oscuranti */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <Eye className="w-4 h-4" />
          <span>SERRAMENTI, VETRI & CHIUSURE OSCURANTI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Materiale Telaio Prevalente *
            </label>
            <select
              value={envelope.infissiTelaio || ''}
              onChange={(e) => updateEnvelope('infissiTelaio', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Materiale Telaio --</option>
              <option value="PVC Multicamera Con Doppia Guarnizione">PVC Multicamera Con Doppia Guarnizione</option>
              <option value="Legno Standard (Spessore ~68 mm)">Legno Standard (Spessore ~68 mm)</option>
              <option value="Legno Vetusto Non A Tenuta">Legno Vetusto Non A Tenuta (Anni 60-70)</option>
              <option value="Alluminio Con Taglio Termico">Alluminio Con Taglio Termico</option>
              <option value="Alluminio A Taglio Freddo">Alluminio A Taglio Freddo (Senza Taglio Termico)</option>
              <option value="Legno-Alluminio Ad Alte Prestazioni">Legno-Alluminio Ad Alte Prestazioni</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipologia Vetrocamera *
            </label>
            <select
              value={envelope.infissiVetri || ''}
              onChange={(e) => updateEnvelope('infissiVetri', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Tipologia Vetrocamera --</option>
              <option value="Doppio Basso-Emissivo 4-16-4 Con Argon (Ug ~1.1)">Doppio Basso-Emissivo 4-16-4 Con Argon (Ug ~1.1)</option>
              <option value="Doppio Vetro Standard 4-12-4 Aria (Ug ~2.8)">Doppio Vetro Standard 4-12-4 Aria (Ug ~2.8)</option>
              <option value="Vetro Singolo 4 mm (Ug ~5.7)">Vetro Singolo 4 mm (Ug ~5.7)</option>
              <option value="Triplo Vetro Ad Alta Efficienza (Ug ~0.7)">Triplo Vetro Ad Alta Efficienza (Ug ~0.7)</option>
              <option value="Stratificato Di Sicurezza Antisfondamento">Stratificato Di Sicurezza Antisfondamento</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chiusure Oscuranti *
            </label>
            <select
              value={envelope.chiusureOscuranti || ''}
              onChange={(e) => updateEnvelope('chiusureOscuranti', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Chiusure Oscuranti --</option>
              <option value="Persiane In Legno">Persiane In Legno</option>
              <option value="Persiane In Alluminio">Persiane In Alluminio</option>
              <option value="Avvolgibili In PVC / Legno">Avvolgibili In PVC / Legno</option>
              <option value="Assenti">Assenti</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Note */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-700" />
            <span>NOTE</span>
          </label>
          <VoiceNoteButton
            label="Detta nota"
            onTranscript={(text) => {
              const current = envelope.noteInvolucro || envelope.pontiTermiciNote || '';
              const updated = current ? `${current} ${text}.` : `${text}.`;
              handleNoteChange(updated);
            }}
          />
        </div>

        <textarea
          rows={3}
          value={envelope.noteInvolucro || envelope.pontiTermiciNote || ''}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Note aggiuntive su involucro, finiture, ponti termici o rilievi particolari..."
          className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed transition-colors"
        />
      </div>
    </div>
  );
};
