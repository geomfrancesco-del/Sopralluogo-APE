export interface CadastralData {
  foglio: string;
  particella: string;
  subalterno: string;
  categoriaCatastale: string;
  piano: string;
  interno: string;
  annoCostruzione: string;
  annoRistrutturazione: string;
  destinazioneUso: string;
  zonaClimatica: string;
  orientamentoPrevalente: string;
}

export interface BuildingEnvelope {
  muratureTipo: string;
  muratureSpessoreCm?: number | string;
  isolamentoEsterno: string;
  isolamentoSpessoreCm?: number | string;
  solaiDisperdenti: string;
  solaiIsolamento: string;
  tettoTipo: string;
  tettoIsolamento?: string;
  tettoIsolamentoSpessoreCm?: number | string;
  infissiTelaio: string;
  infissiVetri: string;
  chiusureOscuranti?: string;
  cassonettiTapparelle?: string;
  schermatureSolari?: string;
  noteInvolucro?: string;
  pontiTermiciNote?: string;
}

export interface ClimatizzazioneEstivaUnita {
  id: string;
  sceltaUnitaEsterna: string;
  marcaModello?: string;
  unitaInterneCollegate: string;
}

export interface ThermalPlant {
  tipoImpianto: string;
  serviziForniti: string;
  generatoreTipo: string;
  marcaModello?: string;
  generatoreMarca?: string;
  generatoreModello?: string;
  matricola?: string;
  annoInstallazione: string;
  combustibile: string;
  potenzaNominaleKw: number | string;
  rendimentoNominale?: string;
  librettoImpiantoPresente: boolean;
  codiceCatastoImpianti: string;
  dataUltimoControlloFumi: string;
  terminaliEmissione: string;
  valvoleTermostatiche: string;
  sistemaRegolazione: string;
  produzioneAcs: string;
  // Climatizzazione Estiva
  climatizzazioneEstivaPresente: string;
  unitaEsterneEstive?: ClimatizzazioneEstivaUnita[];
  climatizzazioneEstivaTipo?: string;
  climatizzazioneEstivaMarcaModello?: string;
  climatizzazioneEstivaNumeroSplit?: string;
  climatizzazioneEstivaPotenzaKw?: number | string;
  climatizzazioneEstivaRefrigerante?: string;
  fontiRinnovabili: string;
  noteImpianto: string;
}

export interface RoomData {
  id: string;
  name: string;
  floor: string;
  lengthM: number;
  widthM: number;
  heightM: number;
  surfaceM2: number;
  windowsCount: number;
  notes: string;
}

export type PhotoCategory =
  | 'facciata'
  | 'generatore'
  | 'libretto'
  | 'infissi'
  | 'terminali'
  | 'altro';

export interface InspectionPhoto {
  id: string;
  category: PhotoCategory;
  categoryLabel: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
}

export interface ApeInspection {
  id: string;
  title: string;
  clientName: string;
  clientPhone?: string;
  technicianName: string;
  technicianOrder: string;
  inspectionDate: string;
  inspectionTime: string;
  address: string;
  city: string;
  province: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  cadastralData: CadastralData;
  buildingEnvelope: BuildingEnvelope;
  thermalPlant: ThermalPlant;
  rooms: RoomData[];
  photos: InspectionPhoto[];
  generalNotes: string;
  clientSignature?: string;
  updatedAt: string;
}

export const PHOTO_CATEGORIES: { id: PhotoCategory; label: string; requiredForApe: boolean; hint: string }[] = [
  { id: 'facciata', label: 'Facciata e Involucro Esterno', requiredForApe: true, hint: 'Foto dell’intero fabbricato e orientamento' },
  { id: 'generatore', label: 'Climatizzazione e Targhetta Tecnica', requiredForApe: true, hint: 'Primo piano nitido di modello, caratteristiche e potenza kW' },
  { id: 'libretto', label: 'Libretto Impianto e Fumi', requiredForApe: true, hint: 'Frontespizio con codice catasto e ultimo rapporto di efficienza' },
  { id: 'infissi', label: 'Serramenti e Vetrocamera', requiredForApe: true, hint: 'Dettaglio telaio, spessore vetrocamera e guarnizioni' },
  { id: 'terminali', label: 'Terminali ed Emissione', requiredForApe: true, hint: 'Radiatori, valvole termostatiche e cronotermostato' },
  { id: 'altro', label: 'Ponti Termici e Altri Rilievi', requiredForApe: false, hint: 'Cassonetti, solai, dettagli costruttivi o difetti' },
];
