import React, { useState, useEffect } from 'react';
import { ApeInspection } from '../../types/ape';
import { VoiceNoteButton } from '../VoiceNoteButton';
import { MapLocationModal } from '../MapLocationModal';
import { User, MapPin, Navigation, Globe, UserCheck } from 'lucide-react';

interface GeneralTabProps {
  inspection: ApeInspection;
  onChange: (updated: ApeInspection) => void;
}

export function buildAutoTitle(
  clientName?: string,
  address?: string,
  city?: string,
  province?: string
): string {
  const client = (clientName || '').trim();
  const addr = (address || '').trim();
  const cty = (city || '').trim();
  const prov = (province || '').trim();

  const locationParts = [addr, cty, prov].filter(Boolean).join(' ');

  if (client && locationParts) {
    return `${client} - ${locationParts}`;
  }
  if (client) {
    return client;
  }
  if (locationParts) {
    return locationParts;
  }
  return 'Nuovo Sopralluogo';
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ inspection, onChange }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Keep title synchronized if client, address, city, or province change
  useEffect(() => {
    const autoTitle = buildAutoTitle(
      inspection.clientName,
      inspection.address,
      inspection.city,
      inspection.province
    );
    if (
      (inspection.clientName || inspection.address || inspection.city || inspection.province) &&
      inspection.title !== autoTitle
    ) {
      onChange({
        ...inspection,
        title: autoTitle,
      });
    }
  }, [inspection.clientName, inspection.address, inspection.city, inspection.province]);

  const updateCadastral = (field: keyof ApeInspection['cadastralData'], val: string) => {
    onChange({
      ...inspection,
      cadastralData: {
        ...inspection.cadastralData,
        [field]: val,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateRoot = (field: keyof ApeInspection, val: string | unknown) => {
    let nextTitle = inspection.title;
    if (field === 'clientName' || field === 'address' || field === 'city' || field === 'province') {
      const nextClient = field === 'clientName' ? (val as string) : inspection.clientName;
      const nextAddress = field === 'address' ? (val as string) : inspection.address;
      const nextCity = field === 'city' ? (val as string) : inspection.city;
      const nextProvince = field === 'province' ? (val as string) : inspection.province;
      nextTitle = buildAutoTitle(nextClient, nextAddress, nextCity, nextProvince);
    }

    onChange({
      ...inspection,
      [field]: val,
      title: nextTitle,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleApplyLocation = (data: {
    address: string;
    streetNumber: string;
    city: string;
    province: string;
    coordinates: { lat: number; lng: number };
  }) => {
    const autoTitle = buildAutoTitle(
      inspection.clientName,
      data.address,
      data.city,
      data.province
    );

    onChange({
      ...inspection,
      address: data.address,
      city: data.city,
      province: data.province,
      coordinates: data.coordinates,
      title: autoTitle,
      updatedAt: new Date().toISOString(),
    });
  };
  return (
    <div className="space-y-6">
      {/* Map Location Modal */}
      <MapLocationModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        initialAddress={inspection.address}
        initialCity={inspection.city}
        initialProvince={inspection.province}
        initialCoordinates={inspection.coordinates}
        onApplyLocation={handleApplyLocation}
      />

      {/* Dati Immobile e Catasto */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700">
            <MapPin className="w-4 h-4" />
            <span>LOCALIZZAZIONE & DATI CATASTALI</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="min-h-[42px] px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold rounded-lg text-xs flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-indigo-600" />
            <span>Localizzami su Google Maps</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Indirizzo (Via / Piazza e Civico) *
              </label>
              {inspection.coordinates && (
                <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Globe className="w-3 h-3 text-emerald-600" />
                  GPS: {inspection.coordinates.lat.toFixed(4)}, {inspection.coordinates.lng.toFixed(4)}
                </span>
              )}
            </div>
            <input
              type="text"
              value={inspection.address}
              onChange={(e) => updateRoot('address', e.target.value)}
              placeholder="es. Via Dante Alighieri 22"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Comune *
            </label>
            <input
              type="text"
              value={inspection.city}
              onChange={(e) => updateRoot('city', e.target.value)}
              placeholder="es. Milano"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Provincia
            </label>
            <input
              type="text"
              value={inspection.province}
              onChange={(e) => updateRoot('province', e.target.value.toUpperCase())}
              maxLength={2}
              placeholder="MI"
              className="w-full h-11 px-3 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Dati Catastali specifici */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Foglio Catastale
            </label>
            <input
              type="text"
              value={inspection.cadastralData.foglio}
              onChange={(e) => updateCadastral('foglio', e.target.value)}
              placeholder="es. 42"
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Particella / Mappale
            </label>
            <input
              type="text"
              value={inspection.cadastralData.particella}
              onChange={(e) => updateCadastral('particella', e.target.value)}
              placeholder="es. 108"
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subalterno *
            </label>
            <input
              type="text"
              value={inspection.cadastralData.subalterno}
              onChange={(e) => updateCadastral('subalterno', e.target.value)}
              placeholder="es. 12"
              className="w-full h-11 px-3 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Categoria Catastale
            </label>
            <select
              value={inspection.cadastralData.categoriaCatastale || ''}
              onChange={(e) => updateCadastral('categoriaCatastale', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Categoria Catastale --</option>
              <option value="A/2 (Abitazione Tipo Civile)">A/2 (Civile)</option>
              <option value="A/3 (Abitazione Tipo Economico)">A/3 (Economico)</option>
              <option value="A/4 (Abitazione Tipo Popolare)">A/4 (Popolare)</option>
              <option value="A/7 (Abitazioni In Villini)">A/7 (Villini)</option>
              <option value="A/8 (Abitazioni In Ville)">A/8 (Ville)</option>
              <option value="A/10 (Uffici E Studi Privati)">A/10 (Uffici)</option>
              <option value="C/1 (Negozi E Botteghe)">C/1 (Negozi)</option>
              <option value="C/2 (Magazzini E Locali Di Deposito)">C/2 (Depositi)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Piano
            </label>
            <input
              type="text"
              value={inspection.cadastralData.piano}
              onChange={(e) => updateCadastral('piano', e.target.value)}
              placeholder="es. 3° piano"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Interno
            </label>
            <input
              type="text"
              value={inspection.cadastralData.interno}
              onChange={(e) => updateCadastral('interno', e.target.value)}
              placeholder="es. Int. 6"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Anno Costruzione
            </label>
            <input
              type="text"
              value={inspection.cadastralData.annoCostruzione}
              onChange={(e) => updateCadastral('annoCostruzione', e.target.value)}
              placeholder="es. 1974"
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Anno Ristrutturazione
            </label>
            <input
              type="text"
              value={inspection.cadastralData.annoRistrutturazione}
              onChange={(e) => updateCadastral('annoRistrutturazione', e.target.value)}
              placeholder="es. 2021 (parziale)"
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Dati Committente / Proprietà */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <User className="w-4 h-4" />
          <span>COMMITTENTE / PROPRIETÀ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nome Committente / Proprietario
            </label>
            <input
              type="text"
              value={inspection.clientName}
              onChange={(e) => updateRoot('clientName', e.target.value)}
              placeholder="es. Luigi Bianchi"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Recapito Telefonico / Email Committente
            </label>
            <input
              type="text"
              value={inspection.clientPhone || ''}
              onChange={(e) => updateRoot('clientPhone', e.target.value)}
              placeholder="es. +39 335 1234567"
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Tecnico Certificatore */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <UserCheck className="w-4 h-4" />
          <span>TECNICO CERTIFICATORE</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nome e Cognome Tecnico Certificatore *
          </label>
          <input
            type="text"
            value={inspection.technicianName}
            onChange={(e) => updateRoot('technicianName', e.target.value)}
            placeholder="es. Geom. Francesco Rossi"
            className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
          />
        </div>
      </div>

      {/* Note Generali con Dettatura Vocale */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold tracking-wider uppercase text-slate-800">
            NOTE GENERALI DI SOPRALLUOGO
          </label>
          <VoiceNoteButton
            label="Detta nota generale"
            onTranscript={(text) => {
              const current = inspection.generalNotes ? `${inspection.generalNotes} ` : '';
              updateRoot('generalNotes', `${current}${text}.`);
            }}
          />
        </div>

        <textarea
          rows={3}
          value={inspection.generalNotes}
          onChange={(e) => updateRoot('generalNotes', e.target.value)}
          placeholder="Annota dettagli di contesto: presenza del proprietario, verifica conformità stato di fatto rispetto alle planimetrie catastali, anomalie di accesso..."
          className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed transition-colors"
        />
      </div>
    </div>
  );
};
