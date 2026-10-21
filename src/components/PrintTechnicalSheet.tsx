import React from 'react';
import { ApeInspection } from '../types/ape';
import { Printer, ArrowLeft, FolderDown } from 'lucide-react';
import { ApplePencilSignaturePad } from './ApplePencilSignaturePad';

interface PrintTechnicalSheetProps {
  inspection: ApeInspection;
  onBackToEdit: () => void;
  onUpdateInspection?: (updated: ApeInspection) => void;
}

export const PrintTechnicalSheet: React.FC<PrintTechnicalSheetProps> = ({
  inspection,
  onBackToEdit,
  onUpdateInspection,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = (() => {
    if (!inspection.inspectionDate) return '_________________';
    try {
      const parts = inspection.inspectionDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return inspection.inspectionDate;
    } catch {
      return inspection.inspectionDate;
    }
  })();

  const committente = (inspection.clientName || '').trim() || '_________________';

  const ubicazione = [
    inspection.city ? `${inspection.city}${inspection.province ? ` (${inspection.province})` : ''}` : '',
    inspection.address ? inspection.address.trim() : '',
  ].filter(Boolean).join(', ') || '_________________';

  const handleSaveSignature = (dataUrl: string) => {
    if (onUpdateInspection) {
      onUpdateInspection({
        ...inspection,
        clientSignature: dataUrl,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleClearSignature = () => {
    if (onUpdateInspection) {
      onUpdateInspection({
        ...inspection,
        clientSignature: '',
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 py-6 px-3 sm:px-6 md:px-8">
      {/* Top action bar (Screen only, hidden on print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToEdit}
            className="min-h-[44px] px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-2 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna alla Compilazione</span>
          </button>
          <div className="text-xs text-slate-500 hidden sm:block">
            <span className="font-medium text-slate-700">{inspection.title || 'Nuovo Sopralluogo'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 mr-1">
            <FolderDown className="w-4 h-4 text-slate-400" />
            <span>Destinazione: <strong>Salva come PDF</strong></span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs md:text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Stampa Scheda A4 / Salva in PDF</span>
          </button>
        </div>
      </div>

      {/* FOGLIO A4 STAMPABILE */}
      <div className="print-container max-w-4xl mx-auto bg-white p-8 md:p-12 border border-slate-200 shadow-lg text-slate-900 font-sans print:shadow-none print:p-0 print:border-none">
        
        {/* Intestazione Ufficiale APE */}
        <div className="border-b-2 border-slate-900 pb-3 mb-6 text-center">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
            VERBALE DI RILIEVO E SOPRALLUOGO PER A.P.E.
          </h1>
        </div>

        {/* 1. Dati Generali, Catastali e Soggetti */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border border-slate-200 mb-2">
            1. DATI GENERALI & LOCALIZZAZIONE CATASTALE
          </h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="font-semibold text-slate-600">Indirizzo: </span>
              <span className="text-slate-900 font-medium">
                {inspection.address ? `${inspection.address}${inspection.city ? `, ${inspection.city}` : ''} ${inspection.province ? `(${inspection.province})` : ''}` : 'Da compilare'}
                {inspection.coordinates && (
                  <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                    Coordinate GPS: Lat {inspection.coordinates.lat}, Lng {inspection.coordinates.lng}
                  </span>
                )}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Committente / Proprietà: </span>
              <span className="text-slate-900 font-medium">{inspection.clientName || 'Da compilare'} {inspection.clientPhone && `(${inspection.clientPhone})`}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Dati Catastali: </span>
              <span className="text-slate-900 font-mono font-bold">
                Foglio {inspection.cadastralData?.foglio || '-'}, Part. {inspection.cadastralData?.particella || '-'}, Sub. {inspection.cadastralData?.subalterno || '-'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Tecnico Certificatore: </span>
              <span className="text-slate-900 font-medium">{inspection.technicianName || '-'}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Categoria Catastale: </span>
              <span className="text-slate-900">{inspection.cadastralData?.categoriaCatastale || '-'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Piano & Interno: </span>
              <span className="text-slate-900">{inspection.cadastralData?.piano ? `Piano ${inspection.cadastralData.piano}` : '-'} {inspection.cadastralData?.interno && `· ${inspection.cadastralData.interno}`}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Anno Costruzione / Ristr.: </span>
              <span className="text-slate-900">{inspection.cadastralData?.annoCostruzione || '-'} {inspection.cadastralData?.annoRistrutturazione && `/ ${inspection.cadastralData.annoRistrutturazione}`}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Destinazione d'Uso: </span>
              <span className="text-slate-900">{inspection.cadastralData?.destinazioneUso || '-'}</span>
            </div>
          </div>
        </div>

        {/* 2. Involucro Edilizio Opaco & Trasparente */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border border-slate-200 mb-2">
            2. INVOLUCRO E SERRAMENTI
          </h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="font-semibold text-slate-600">Murature Perimetrali: </span>
              <span className="text-slate-900">{inspection.buildingEnvelope?.muratureTipo || '-'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Isolamento Muratura: </span>
              <span className="text-slate-900 font-medium">
                {inspection.buildingEnvelope?.isolamentoEsterno || '-'}
                {inspection.buildingEnvelope?.isolamentoSpessoreCm ? ` (${inspection.buildingEnvelope.isolamentoSpessoreCm} cm)` : ''}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Dispersione Verso Basso: </span>
              <span className="text-slate-900">{inspection.buildingEnvelope?.solaiDisperdenti || '-'} {inspection.buildingEnvelope?.solaiIsolamento && `(${inspection.buildingEnvelope.solaiIsolamento})`}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Dispersione Verso Alto / Solaio Superiore: </span>
              <span className="text-slate-900">
                {inspection.buildingEnvelope?.tettoTipo || '-'} {inspection.buildingEnvelope?.tettoIsolamento && `(${inspection.buildingEnvelope.tettoIsolamento})`}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Telaio Serramenti: </span>
              <span className="text-slate-900">{inspection.buildingEnvelope?.infissiTelaio || '-'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Vetrocamera: </span>
              <span className="text-slate-900">{inspection.buildingEnvelope?.infissiVetri || '-'}</span>
            </div>

            <div className="col-span-2">
              <span className="font-semibold text-slate-600">Chiusure Oscuranti: </span>
              <span className="text-slate-900">{inspection.buildingEnvelope?.chiusureOscuranti || inspection.buildingEnvelope?.schermatureSolari || '-'}</span>
            </div>

            {(inspection.buildingEnvelope?.noteInvolucro || inspection.buildingEnvelope?.pontiTermiciNote) && (
              <div className="col-span-2 pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-600">Note: </span>
                <span className="text-slate-900 italic">{inspection.buildingEnvelope.noteInvolucro || inspection.buildingEnvelope.pontiTermiciNote}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Impianti & Climatizzazione */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border border-slate-200 mb-2">
            3. IMPIANTI & CLIMATIZZAZIONE
          </h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="font-semibold text-slate-600">Tipologia Impianto: </span>
              <span className="text-slate-900 font-bold">{inspection.thermalPlant?.tipoImpianto || '-'}</span> {inspection.thermalPlant?.serviziForniti ? `(${inspection.thermalPlant.serviziForniti})` : ''}
            </div>
            <div>
              <span className="font-semibold text-slate-600">Generatore: </span>
              <span className="text-slate-900">{inspection.thermalPlant?.generatoreTipo || '-'}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Marca e Modello: </span>
              <span className="text-slate-900 font-bold">{inspection.thermalPlant?.marcaModello || [inspection.thermalPlant?.generatoreMarca, inspection.thermalPlant?.generatoreModello].filter(Boolean).join(' ') || '-'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Combustibile & Potenza: </span>
              <span className="text-slate-900">
                {inspection.thermalPlant?.combustibile || '-'} · <span className="font-mono font-bold">{inspection.thermalPlant?.potenzaNominaleKw ? `${inspection.thermalPlant.potenzaNominaleKw} kW` : 'N.D.'}</span> {inspection.thermalPlant?.annoInstallazione ? `(Anno: ${inspection.thermalPlant.annoInstallazione})` : ''}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Codice Catasto Impianti: </span>
              <span className="text-slate-900 font-mono">
                {inspection.thermalPlant?.codiceCatastoImpianti || 'N.D.'} {inspection.thermalPlant?.dataUltimoControlloFumi ? `(Controllo: ${inspection.thermalPlant.dataUltimoControlloFumi})` : ''}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Terminali & Valvole: </span>
              <span className="text-slate-900">{inspection.thermalPlant?.terminaliEmissione || '-'} · {inspection.thermalPlant?.valvoleTermostatiche || '-'}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Sistema Regolazione: </span>
              <span className="text-slate-900">{inspection.thermalPlant?.sistemaRegolazione || '-'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Produzione ACS: </span>
              <span className="text-slate-900">{inspection.thermalPlant?.produzioneAcs || '-'}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Fonti Rinnovabili (FER): </span>
              <span className="text-slate-900 font-medium">{inspection.thermalPlant?.fontiRinnovabili || '-'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Climatizzazione Estiva: </span>
              <span className="text-slate-900 font-medium">
                {inspection.thermalPlant?.climatizzazioneEstivaPresente || '-'}
                {inspection.thermalPlant?.climatizzazioneEstivaPresente === 'Presente' && inspection.thermalPlant?.unitaEsterneEstive && inspection.thermalPlant.unitaEsterneEstive.length > 0 && (
                  <span className="text-slate-700 block mt-0.5 text-[11px]">
                    {inspection.thermalPlant.unitaEsterneEstive.map((ue, idx) => (
                      <span key={ue.id || idx} className="block">
                        • UE {idx + 1}: {ue.sceltaUnitaEsterna}{ue.marcaModello ? ` (${ue.marcaModello})` : ''} → UI: {ue.unitaInterneCollegate || 'N.D.'}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-slate-600">Note Impianto: </span>
              <span className="text-slate-900">{inspection.thermalPlant?.noteImpianto || '-'}</span>
            </div>
          </div>
        </div>

        {/* 4. Fascicolo Fotografico Allegato */}
        <div className="mb-6 page-break-after">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border border-slate-200 mb-3">
            4. ESTRATTO FASCICOLO FOTOGRAFICO OBBLIGATORIO ({inspection.photos?.length || 0} fotografie)
          </h2>

          {inspection.photos && inspection.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {inspection.photos.slice(0, 4).map((photo, i) => (
                <div key={photo.id} className="border border-slate-200 p-2 rounded bg-slate-50/50">
                  <div className="aspect-4/3 bg-slate-100 overflow-hidden mb-1.5 border border-slate-200">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] text-slate-800 leading-snug">
                    <span className="font-bold text-slate-900">[{i + 1}] {photo.categoryLabel}: </span>
                    <span>{photo.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-400 bg-slate-50">
              Nessuna fotografia allegata al momento. Utilizza la scheda "4. Foto Rilievo" per scattare o allegare le fotografie dell'immobile.
            </div>
          )}
        </div>

        {/* 5. Note Conclusive e Blocco Firma */}
        <div className="pt-4 border-t-2 border-slate-900 mt-6 text-xs">
          <div className="mb-4">
            <span className="font-bold block text-slate-900 uppercase tracking-wide mb-1 text-[11px]">
              Dichiarazione di Sopralluogo ed Attestazione di Presenza
            </span>
            <p className="text-[11px] text-slate-800 leading-relaxed text-justify bg-slate-50/70 p-3 rounded border border-slate-200">
              Il sottoscritto tecnico certificatore attesta di aver eseguito personalmente il sopralluogo, in data <strong className="text-slate-900 underline font-mono">{formattedDate}</strong>, in conformità alle disposizioni di legge vigenti ed alla presenza del Sig. <strong className="text-slate-900 underline">{committente}</strong> in qualità di proprietario\delegato dal proprietario, all&apos;unità immobiliare oggetto di Attestato di Prestazione Energetica sita in <strong className="text-slate-900 underline">{ubicazione}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-1">
            {/* Box 1: Tecnico Certificatore */}
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-700 uppercase block mb-1.5 tracking-wider">
                IL TECNICO CERTIFICATORE
              </span>
              <div className="h-28 border border-slate-300 rounded-lg bg-slate-50/30 flex flex-col items-center justify-center p-2 text-center">
                <span className="font-bold text-slate-800 text-xs">{inspection.technicianName || 'Tecnico Certificatore'}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{inspection.technicianOrder || 'Tecnico Abilitato'}</span>
                <span className="text-[9px] text-slate-400 mt-2 italic">(Firma e timbro professionale)</span>
              </div>
            </div>

            {/* Box 2: Committente / Proprietà con Apple Pencil */}
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-700 uppercase block mb-1.5 tracking-wider">
                FIRMA DEL COMMITTENTE / PROPRIETÀ
              </span>
              <ApplePencilSignaturePad
                signatureUrl={inspection.clientSignature}
                onSaveSignature={handleSaveSignature}
                onClearSignature={handleClearSignature}
                clientName={committente !== '_________________' ? committente : undefined}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
