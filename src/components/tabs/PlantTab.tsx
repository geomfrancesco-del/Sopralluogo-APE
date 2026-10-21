import React from 'react';
import { ApeInspection, ThermalPlant, ClimatizzazioneEstivaUnita } from '../../types/ape';
import { VoiceNoteButton } from '../VoiceNoteButton';
import { Flame, Thermometer, Sun, FileText, Snowflake, Plus, Trash2, Lock } from 'lucide-react';

interface PlantTabProps {
  inspection: ApeInspection;
  onChange: (updated: ApeInspection) => void;
}

export const PlantTab: React.FC<PlantTabProps> = ({ inspection, onChange }) => {
  const plant = inspection.thermalPlant;

  const updatePlant = (field: keyof ThermalPlant, val: string | number | boolean) => {
    onChange({
      ...inspection,
      thermalPlant: {
        ...inspection.thermalPlant,
        [field]: val,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const isEstivaAssente = plant.climatizzazioneEstivaPresente === 'Assente';
  const isEstivaPresente = plant.climatizzazioneEstivaPresente === 'Presente';
  const units: ClimatizzazioneEstivaUnita[] = plant.unitaEsterneEstive || [];

  const handlePresenzaEstivaChange = (newVal: string) => {
    if (newVal === 'Assente') {
      onChange({
        ...inspection,
        thermalPlant: {
          ...inspection.thermalPlant,
          climatizzazioneEstivaPresente: 'Assente',
          unitaEsterneEstive: [],
          climatizzazioneEstivaTipo: '',
          climatizzazioneEstivaMarcaModello: '',
          climatizzazioneEstivaNumeroSplit: '',
          climatizzazioneEstivaPotenzaKw: '',
          climatizzazioneEstivaRefrigerante: '',
        },
        updatedAt: new Date().toISOString(),
      });
    } else if (newVal === 'Presente') {
      const initialUnits = units.length > 0 ? units : [
        {
          id: `ue_${Date.now()}`,
          sceltaUnitaEsterna: '',
          marcaModello: '',
          unitaInterneCollegate: '',
        }
      ];
      onChange({
        ...inspection,
        thermalPlant: {
          ...inspection.thermalPlant,
          climatizzazioneEstivaPresente: 'Presente',
          unitaEsterneEstive: initialUnits,
        },
        updatedAt: new Date().toISOString(),
      });
    } else {
      onChange({
        ...inspection,
        thermalPlant: {
          ...inspection.thermalPlant,
          climatizzazioneEstivaPresente: '',
          unitaEsterneEstive: [],
        },
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleAddUnit = () => {
    const newUnit: ClimatizzazioneEstivaUnita = {
      id: `ue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sceltaUnitaEsterna: '',
      marcaModello: '',
      unitaInterneCollegate: '',
    };
    onChange({
      ...inspection,
      thermalPlant: {
        ...inspection.thermalPlant,
        unitaEsterneEstive: [...units, newUnit],
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateUnit = (id: string, field: keyof ClimatizzazioneEstivaUnita, value: string) => {
    const updated = units.map((u) => (u.id === id ? { ...u, [field]: value } : u));
    onChange({
      ...inspection,
      thermalPlant: {
        ...inspection.thermalPlant,
        unitaEsterneEstive: updated,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRemoveUnit = (id: string) => {
    const updated = units.filter((u) => u.id !== id);
    onChange({
      ...inspection,
      thermalPlant: {
        ...inspection.thermalPlant,
        unitaEsterneEstive: updated,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Climatizzazione Invernale */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <Flame className="w-4 h-4" />
          <span>CLIMATIZZAZIONE INVERNALE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Riga 1 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipologia Impianto *
            </label>
            <select
              value={plant.tipoImpianto || ''}
              onChange={(e) => updatePlant('tipoImpianto', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Tipologia Impianto --</option>
              <option value="Autonomo">Autonomo</option>
              <option value="Centralizzato">Centralizzato</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Servizi Energetici Forniti *
            </label>
            <select
              value={plant.serviziForniti || ''}
              onChange={(e) => updatePlant('serviziForniti', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Servizi Forniti --</option>
              <option value="Riscaldamento + Acqua Calda Sanitaria (ACS)">Riscaldamento + ACS</option>
              <option value="Solo Riscaldamento">Solo Riscaldamento</option>
              <option value="Riscaldamento + ACS + Climatizzazione Estiva">Riscaldamento + ACS + Raffrescamento</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vettore Energetico / Combustibile *
            </label>
            <select
              value={plant.combustibile || ''}
              onChange={(e) => updatePlant('combustibile', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Combustibile --</option>
              <option value="Metano (Gas Naturale)">Metano (Gas Naturale)</option>
              <option value="Energia Elettrica Da Rete">Energia Elettrica (PdC / Boiler)</option>
              <option value="GPL">GPL</option>
              <option value="Biomassa Solida (Pellet / Legna)">Pellet / Legna Da Ardere</option>
              <option value="Gasolio Da Riscaldamento">Gasolio</option>
            </select>
          </div>

          {/* Riga 2 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipo di Generatore *
            </label>
            <select
              value={plant.generatoreTipo || ''}
              onChange={(e) => updatePlant('generatoreTipo', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Tipo Generatore --</option>
              <option value="Caldaia Murale A Condensazione A Gas Metano">Caldaia Murale A Condensazione (Recente)</option>
              <option value="Caldaia Convenzionale Camera Stagna (Tipo C)">Caldaia Tradizionale Camera Stagna (Tipo C)</option>
              <option value="Caldaia Convenzionale Camera Aperta (Tipo B)">Caldaia Camera Aperta Tiraggio Naturale (Tipo B)</option>
              <option value="Pompa Di Calore Elettrica Aria-Acqua (Inverter)">Pompa Di Calore Aria-Acqua Ad Alta Efficienza</option>
              <option value="Sistema Ibrido (Caldaia + Pompa Di Calore)">Sistema Ibrido Factory-Made</option>
              <option value="Pompe Di Calore Ad Aria Tipo Multisplit">Pompe Di Calore Split Aria-Aria</option>
              <option value="Stufa / Termocamino A Pellet">Termocamino / Stufa A Pellet</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Potenza Termica Nominale (kW) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={plant.potenzaNominaleKw}
                onChange={(e) => updatePlant('potenzaNominaleKw', Number(e.target.value) || '')}
                placeholder="es. 24.1"
                className="w-full h-11 px-3 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              />
              <span className="text-xs text-slate-500 font-mono shrink-0">kW</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Marca e Modello
            </label>
            <input
              type="text"
              value={plant.marcaModello ?? ([plant.generatoreMarca, plant.generatoreModello].filter(Boolean).join(' '))}
              onChange={(e) => updatePlant('marcaModello', e.target.value)}
              placeholder="es. Vaillant ecoTEC plus VMW 246"
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Riga 3 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Anno Installazione
            </label>
            <input
              type="text"
              value={plant.annoInstallazione}
              onChange={(e) => updatePlant('annoInstallazione', e.target.value)}
              placeholder="es. 2021"
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Codice Catasto Impianti
            </label>
            <input
              type="text"
              value={plant.codiceCatastoImpianti}
              onChange={(e) => updatePlant('codiceCatastoImpianti', e.target.value)}
              placeholder="000..."
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Data Ultimo Controllo Fumi
            </label>
            <input
              type="date"
              value={plant.dataUltimoControlloFumi}
              onChange={(e) => updatePlant('dataUltimoControlloFumi', e.target.value)}
              className="w-full h-11 px-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Distribuzione, Emissione, Valvole e Regolazione, ACS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <Thermometer className="w-4 h-4" />
          <span>TERMINALI DI EMISSIONE, VALVOLE & TERMOREGOLAZIONE, ACS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Terminali di Emissione Prevalenti *
            </label>
            <select
              value={plant.terminaliEmissione || ''}
              onChange={(e) => updatePlant('terminaliEmissione', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Terminali di Emissione --</option>
              <option value="Radiatori In Alluminio Pressofuso">Radiatori In Alluminio Pressofuso</option>
              <option value="Radiatori In Ghisa A Colonne">Radiatori In Ghisa A Colonne</option>
              <option value="Radiatori Tubolari / Lamellari In Acciaio">Radiatori Tubolari / Lamellari In Acciaio</option>
              <option value="Pannelli Radianti A Pavimento">Pannelli Radianti A Pavimento (Bassa Temp.)</option>
              <option value="Ventilconvettori (Fancoil)">Ventilconvettori (Fancoil)</option>
              <option value="Split Aria-Aria A Pompa Di Calore">Split Aria-Aria A Pompa Di Calore</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Valvole Termostatiche sui Terminali *
            </label>
            <select
              value={plant.valvoleTermostatiche || ''}
              onChange={(e) => updatePlant('valvoleTermostatiche', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Valvole Termostatiche --</option>
              <option value="Presenti Su Tutti I Radiatori">Presenti Su Tutti I Radiatori</option>
              <option value="Parziali (Solo Alcune Stanze)">Parziali (Solo Alcune Stanze)</option>
              <option value="Assenti (Solo Manopole Manuali)">Assenti (Solo Manopole Manuali)</option>
              <option value="Valvole Termostatiche Smart Wi-Fi">Valvole Termostatiche Smart Wi-Fi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sistema di Regolazione e Termostato *
            </label>
            <select
              value={plant.sistemaRegolazione || ''}
              onChange={(e) => updatePlant('sistemaRegolazione', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Sistema di Regolazione --</option>
              <option value="Cronotermostato Settimanale Digitale">Cronotermostato Settimanale Digitale</option>
              <option value="Termostato Ambiente Semplice ON/OFF">Termostato Ambiente Semplice ON/OFF</option>
              <option value="Sonda Climatica Esterna Modulante">Sonda Climatica Esterna Modulante</option>
              <option value="Cronotermostato Smart Connesso">Cronotermostato Smart Connesso</option>
              <option value="Regolazione Multizona Indipendente">Regolazione Multizona Indipendente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Produzione Acqua Calda Sanitaria (ACS) *
            </label>
            <select
              value={plant.produzioneAcs || ''}
              onChange={(e) => updatePlant('produzioneAcs', e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="">-- Seleziona Produzione ACS --</option>
              <option value="Istantanea Da Caldaia Combinata">Istantanea Da Caldaia Combinata</option>
              <option value="Accumulo Interno In Caldaia (40-60L)">Accumulo Interno In Caldaia (40-60L)</option>
              <option value="Bollitore Separato Dedicato (100-200L)">Bollitore Separato Dedicato (100-200L)</option>
              <option value="Scaldabagno Elettrico Separato">Scaldabagno Elettrico Separato</option>
              <option value="Pompa Di Calore Per Sola ACS">Pompa Di Calore Per Sola ACS</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Climatizzazione Estiva */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700">
            <Snowflake className="w-4 h-4" />
            <span>CLIMATIZZAZIONE ESTIVA</span>
          </div>

          {isEstivaPresente && (
            <button
              type="button"
              onClick={handleAddUnit}
              className="min-h-[38px] px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Unità Esterna</span>
            </button>
          )}
        </div>

        {/* Campo Presenza Climatizzazione Estiva */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Presenza Climatizzazione Estiva *
          </label>
          <select
            value={plant.climatizzazioneEstivaPresente || ''}
            onChange={(e) => handlePresenzaEstivaChange(e.target.value)}
            className="w-full md:w-64 h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
          >
            <option value="">-- Seleziona Presenza --</option>
            <option value="Assente">Assente</option>
            <option value="Presente">Presente</option>
          </select>
        </div>

        {/* Se Assente: campi cancellati e non compilabili */}
        {isEstivaAssente ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Campi non compilabili (Impianto Assente)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 pointer-events-none select-none">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Scelta Unità Esterna
                </label>
                <input
                  type="text"
                  disabled
                  value=""
                  placeholder="Non presente"
                  className="w-full h-11 px-3 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Unità Interne Collegate
                </label>
                <input
                  type="text"
                  disabled
                  value=""
                  placeholder="Non presente"
                  className="w-full h-11 px-3 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        ) : isEstivaPresente ? (
          /* Se Presente: ripetuto per ogni unità esterna */
          <div className="space-y-4">
            {units.map((unit, index) => (
              <div
                key={unit.id}
                className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Unità Esterna #{index + 1}
                    </span>
                  </div>

                  {units.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUnit(unit.id)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Rimuovi</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Scelta Unità Esterna */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Scelta Unità Esterna *
                    </label>
                    <select
                      value={unit.sceltaUnitaEsterna || ''}
                      onChange={(e) => handleUpdateUnit(unit.id, 'sceltaUnitaEsterna', e.target.value)}
                      className="w-full h-11 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer mb-2"
                    >
                      <option value="">-- Seleziona Unità Esterna --</option>
                      <option value="Monosplit">Monosplit</option>
                      <option value="Dual Split">Dual Split</option>
                      <option value="Trial Split">Trial Split</option>
                      <option value="Quadri Split">Quadri Split</option>
                      <option value="Penta Split">Penta Split</option>
                      <option value="Canalizzato">Canalizzato</option>
                      <option value="Pompa Di Calore Idronica">Pompa Di Calore Idronica</option>
                      <option value="Altro">Altro</option>
                    </select>
                    <input
                      type="text"
                      value={unit.marcaModello || ''}
                      onChange={(e) => handleUpdateUnit(unit.id, 'marcaModello', e.target.value)}
                      placeholder="Marca e Modello UE (es. Daikin 2MXM40A, Mitsubishi...)"
                      className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                    />
                  </div>

                  {/* Unità Interne Collegate */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Unità Interne Collegate *
                    </label>
                    <input
                      type="text"
                      value={unit.unitaInterneCollegate || ''}
                      onChange={(e) => handleUpdateUnit(unit.id, 'unitaInterneCollegate', e.target.value)}
                      placeholder="es. 2 Split A Parete (Soggiorno + Letto)"
                      className="w-full h-11 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-600">
                      {['1 Split A Parete', '2 Split A Parete', '3 Split A Parete', 'Canalizzato'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleUpdateUnit(unit.id, 'unitaInterneCollegate', opt)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-700 font-medium transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddUnit}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-indigo-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Un&apos;altra Unità Esterna</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
            Seleziona se la climatizzazione estiva è presente o assente nell&apos;immobile.
          </div>
        )}
      </div>

      {/* 4. Fonti Rinnovabili (FER) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-indigo-700 mb-3">
          <Sun className="w-4 h-4" />
          <span>FONTI ENERGETICHE RINNOVABILI (FER)</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Presenza Fonti Rinnovabili (Fotovoltaico / Solare Termico) *
          </label>
          <input
            type="text"
            value={plant.fontiRinnovabili}
            onChange={(e) => updatePlant('fontiRinnovabili', e.target.value)}
            placeholder="es. Nessuna oppure Fotovoltaico 3.3 kWp con inverter Zucchetti"
            className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
          />
          <div className="mt-2.5 flex flex-wrap gap-2 text-xs text-slate-600">
            {['Nessuna', 'Fotovoltaico 3 kWp', 'Fotovoltaico 6 kWp + Accumulo', 'Solare Termico 2 Collettori'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => updatePlant('fontiRinnovabili', f)}
                className="h-8 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Note Impianto (Collocata sotto come nelle altre schede) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-700" />
            <span>NOTE IMPIANTO</span>
          </label>
          <VoiceNoteButton
            label="Detta nota"
            onTranscript={(text) => {
              const current = plant.noteImpianto ? `${plant.noteImpianto} ` : '';
              updatePlant('noteImpianto', `${current}${text}.`);
            }}
          />
        </div>

        <textarea
          rows={3}
          value={plant.noteImpianto}
          onChange={(e) => updatePlant('noteImpianto', e.target.value)}
          placeholder="Posizione generatore, canna fumaria, stato conservazione tubazioni, pressione idraulica..."
          className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed transition-colors"
        />
      </div>
    </div>
  );
};
