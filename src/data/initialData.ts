import { ApeInspection } from '../types/ape';

export function createEmptyInspection(): ApeInspection {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().slice(0, 5);
  const id = `ape-${Date.now()}`;

  return {
    id,
    title: 'Nuovo Sopralluogo',
    clientName: '',
    clientPhone: '',
    technicianName: '',
    technicianOrder: '',
    inspectionDate: dateStr,
    inspectionTime: timeStr,
    address: '',
    city: '',
    province: '',
    cadastralData: {
      foglio: '',
      particella: '',
      subalterno: '',
      categoriaCatastale: '',
      piano: '',
      interno: '',
      annoCostruzione: '',
      annoRistrutturazione: '',
      destinazioneUso: '',
      zonaClimatica: '',
      orientamentoPrevalente: '',
    },
    buildingEnvelope: {
      muratureTipo: '',
      isolamentoEsterno: '',
      isolamentoSpessoreCm: '',
      solaiDisperdenti: '',
      solaiIsolamento: '',
      tettoTipo: '',
      tettoIsolamento: '',
      infissiTelaio: '',
      infissiVetri: '',
      chiusureOscuranti: '',
      noteInvolucro: '',
      pontiTermiciNote: '',
    },
    thermalPlant: {
      tipoImpianto: '',
      serviziForniti: '',
      generatoreTipo: '',
      marcaModello: '',
      annoInstallazione: '',
      combustibile: '',
      potenzaNominaleKw: '',
      librettoImpiantoPresente: false,
      codiceCatastoImpianti: '',
      dataUltimoControlloFumi: '',
      terminaliEmissione: '',
      valvoleTermostatiche: '',
      sistemaRegolazione: '',
      produzioneAcs: '',
      climatizzazioneEstivaPresente: '',
      unitaEsterneEstive: [],
      fontiRinnovabili: '',
      noteImpianto: '',
    },
    rooms: [],
    photos: [],
    generalNotes: '',
    clientSignature: '',
    updatedAt: now.toISOString(),
  };
}

export const INITIAL_INSPECTIONS: ApeInspection[] = [
  createEmptyInspection(),
];
