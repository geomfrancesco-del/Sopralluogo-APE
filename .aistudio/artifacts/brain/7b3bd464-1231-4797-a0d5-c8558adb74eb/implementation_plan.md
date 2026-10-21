# CantiereNote — Scheda di Rilievo Sopralluogo per APE (iPad)

Applicazione touch-first ottimizzata per iPad e tablet per geometri, tecnici e certificatori energetici per la raccolta rapida e strutturata di tutti i dati tecnici durante il sopralluogo obbligatorio per la redazione dell'**Attestato di Prestazione Energetica (APE)**, con calcolo automatico superfici/volumi, checklist involucro ed impianti, galleria foto con marcatura dei componenti chiave e generazione della scheda tecnica stampabile pronta per il software di calcolo energetico (DOCET, Termolog, Edilclima, Blumatica, ecc.).

***

## Revisione Utente & Decisioni Chiave

> [!IMPORTANT]
> **Adattamento specifico per la redazione di APE (Attestato di Prestazione Energetica):**
> - **Obiettivo primario**: Raccogliere sul campo tutti i parametri indispensabili per il calcolo APE secondo le Linee Guida Nazionali (D.M. 26/06/2015 e UNI/TS 11300), senza dimenticare nessun dato critico durante la visita dell'immobile.
> - **Sezioni strutturate sul campo**:
>   1. **Dati Identificativi & Catastali**: Indirizzo, subalterno, piano, anno costruzione, classe catastale, esposizione e orientamento.
>   2. **Geometrie & Involucro Opaco/Trasparente**: Misure vani, superfici disperdenti, spessori pareti e tipologia muraria (presenza cappotto/isolante), tipologia infissi (legno/PVC/alluminio TT, vetrocamera standard o basso-emissivo, cassonetti).
>   3. **Impianti Termici (Riscaldamento & ACS)**: Generatore (caldaia, pompa di calore, biomassa), marca/modello/potenza nominale kW, anno installazione, combustibile, terminali (radiatori, valvole termostatiche, fancoil, radiante a pavimento), regolazione (cronotermostato), produzione acqua calda sanitaria (ACS) e fonti rinnovabili (fotovoltaico/solare termico).
>   4. **Galleria Fotografica Obbligatoria per Fascicolo APE**: Foto esterne/facciata, foto targhetta tecnica generatore, foto frontespizio e controllo fumi libretto di impianto (con codice catasto regionale tipo CIRCE/CURIT/CIT), foto infissi e radiatori con valvole.
>   5. **Output**: Scheda Tecnica di Rilievo APE stampabile (A4/PDF) impaginata per affiancare il software di calcolo in studio, con riepilogo dati sintetico e copia-incolla rapido + esportazione JSON.

***

## 1. Panoramica & Concetto Base

- **Cosa fa l'applicazione**:
  Trasforma l'iPad in un taccuino di rilievo energetico intelligente e a prova di dimenticanza:
  1. **Creazione/Selezione Rilievo APE**: Configurazione rapida immobile, committente, estremi catastali e data visita.
  2. **Checklist & Campi Dati Guidati APE**: Campi a tocco rapido con opzioni predefinite tipiche dell'edilizia italiana (es. muratura a cassa vuota con intercapedine, solaio laterocemento verso sottotetto non riscaldato, serramenti doppio vetro con telaio in legno da 68mm, caldaia murale stagna a condensazione).
  3. **Rilievo Vano per Vano & Dimensioni**: Inserimento rapido di dimensioni ($L \times P \times H$) con calcolo immediato di Superficie Utile Calpestabile ($S_u$) e Volume Netto/Lordo climatizzato ($V$).
  4. **Acquisizione Fotografica Contestuale con Scatto Diretto**: Sezione guidata con slot dedicati alle foto obbligatorie per il fascicolo probatorio APE (Targhetta generatore, Libretto impianto, Finestre, Termosifoni, Facciata).
  5. **Note e Dettatura Vocale**: Per annotare ponti termici, fessure, anomalie o dettagli costruttivi senza digitare sulla tastiera.
  6. **Scheda di Rilievo APE Stampabile ed Esportabile**: Report A4 ordinato e sintetico da stampare o esportare in PDF, e file JSON di backup con riepilogo tabellare.

- **Target / Persona di riferimento**:
  Geometra Francesco (e colleghi periti/ingegneri/architetti) durante i sopralluoghi residenziali e commerciali per la certificazione energetica degli edifici.

- **Valore primario**:
  Garantisce che durante la visita non venga trascurato nessun parametro richiesto dal software di calcolo APE (dalla potenza al focolare della caldaia al tipo di valvola termostatica) ed evita di dover richiamare il proprietario per informazioni mancanti.

***

## 2. Esperienza Utente & Design Visivo (Design System)

L'interfaccia rispetta rigorosamente i requisiti del design constitution:
- **Zero-Pill discipline**: Niente pillole statiche o badge colorati invasivi; metadati presentati con tipografia pulita e separatori discreti (`·` e `/`).
- **Target di tocco ampi per iPad**: Minimo $48\text{px}$ di altezza per ogni pulsante, selettore o campo input, agevole sia con dito che con Apple Pencil.
- **Palette cromatica tecnica ad alto contrasto**: Sfondo chiaro nitido `slate-50`, superfici `white` con bordi sottili `slate-200`, testo ad alta leggibilità `slate-900`, accenti tecnici blu cianotipo/ingegneria `indigo-700` e ambra caldo `amber-600` per parametri da verificare.
- **Tipografia**: `Plus Jakarta Sans` per interfaccia e titoli, `JetBrains Mono` con `tabular-nums` per misure dimensionali, potenze kW, superfici e date.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ CantiereNote · Rilievo APE                  [+ Nuovo Rilievo] [Stampa A4] [Esporta Dati]│
├─────────────────────────┬───────────────────────────────────────────────────────────────┤
│ ARCHIVIO CERTIFICAZIONI │ RILIEVO APE CORRENTE: Via Dante 22, Milano                    │
│                         │ Committente: Fam. Bianchi · Foglio 42 Part. 108 Sub 12        │
│ • Via Dante 22, Milano  ├───────────────────────────────────────────────────────────────┤
│   Sub 12 · 13/10/2026   │ SCHEDE: [1. Generale] [2. Involucro] [3. Impianti] [4. Foto]  │
│                         ├───────────────────────────────────────────────────────────────┤
│ • Corso Roma 45, Monza  │ DATI INVOLUCRO & INFISSI                                      │
│   Sub 4 · 02/10/2026    │ Murature: Doppio forato con intercapedine (cm 30)             │
│                         │ Serramenti: Legno doppio vetro (vetrocamera 4-12-4)           │
│ • Viale Brianza 8       │ Cassonetti: Non coibentati · Scuri in legno                   │
│   Sub 1 · 28/09/2026    ├───────────────────────────────────────────────────────────────┤
│                         │ IMPIANTO TERMICO & GENERATORE                                 │
│                         │ Caldaia a condensazione · Metano · Vaillant ecoTEC plus       │
│                         │ Potenza: 24.5 kW · Anno: 2021 · Termosifoni alluminio con VT  │
│                         │ Libretto presente: Sì · Codice catasto: CR-2021-99812         │
│                         ├───────────────────────────────────────────────────────────────┤
│                         │ GALLERIA FOTO APE (6 foto caricate)                           │
│                         │ [Targhetta Caldaia] [Libretto Impianto] [Infisso] [Facciata]  │
└─────────────────────────┴───────────────────────────────────────────────────────────────┘
```

### Navigazione a Schede Tematiche per il Sopralluogo
1. **Dati Generali & Fabbricato**:
   - Indirizzo, Piano, Subalterno/Foglio, Anno di costruzione, Anno eventuale ristrutturazione, Destinazione d'uso, Esposizione prevalente, Note generali.
2. **Geometrie & Vani**:
   - Tabella dinamica dei vani con calcolo automatico: Soggiorno, Cucina, Camere, Bagni, Disimpegno. Misure $L \times P \times H$, calcolo $S_u$ totale e $V$ climatizzato.
3. **Involucro & Pareti**:
   - Tipologia muratura esterna, spessore totale stimato, isolamento a cappotto, solai disperdenti (verso cantina o verso sottotetto).
   - Tipologia serramenti prevalenti: telaio (legno/PVC/alluminio TT), vetro (singolo/doppio/triplo), cassonetti avvolgibili (coibentati/non coibentati).
4. **Impianti & Generatori (Riscaldamento, ACS, Elettrico/FER)**:
   - Tipo generatore (caldaia condensazione/tradizionale, pompa di calore, biomassa, ecc.).
   - Dati di targa: marca, modello, matricola, potenza termica utile nominale (kW).
   - Combustibile, anno installazione, verifica presenza libretto di impianto e ultimo rapporto di efficienza fumi.
   - Terminali di emissione (radiatori con valvole termostatiche, fancoil, a pavimento).
   - Regolazione (cronotermostato settimanale o termostato ambiente semplice).
   - Acqua calda sanitaria (istantanea da caldaia, scaldabagno elettrico o accumulo dedicato).
   - Eventuale impianto fotovoltaico (potenza kWp) o solare termico.
5. **Galleria Foto APE & Dettagli**:
   - Guida fotografica con tag specifici del rilievo APE (Facciata, Targhetta Generatore, Libretto Impianto, Terminali/Valvole, Serramenti, Cassonetti).
   - Possibilità di scatto diretto da fotocamera iPad o selezione dal rullino fotografico con didascalia tecnica.
6. **Vista Stampa Scheda Tecnica (A4)**:
   - Scheda tecnica impaginata e formattata con rigore grafico per la stampa su foglio singolo o doppio A4 o esportazione in PDF tramite la funzione di stampa nativa di iPad/browser.

***

## 3. Decisioni di Prodotto & Dati Tecnici

- **Persistenza Locale Offline (Nessuna perdita dati in cantiere)**:
  - Tutti i rilievi vengono memorizzati in tempo reale in `localStorage` / store locale del browser, inclusi testi, note vocali trascritte e fotografie compresse. Nessuna dipendenza da segnale cellulare nei seminterrati o cantieri privi di rete.
- **Dettatura Vocale per Note Rapide**:
  - Supporto al microfono tramite `webkitSpeechRecognition` nativo su Safari iPad, per registrare osservazioni durante il cammino (es. "presenza ponte termico pilastro d'angolo non coibentato").
- **Dati di Esempio Realistici già Pronti**:
  - L'applicazione viene fornita pre-popolata con 2 casi tipici di rilievo APE completi:
    1. *Appartamento anni '70 parzialmente ristrutturato (Milano)* con caldaia a condensazione autonoma, serramenti in PVC doppio vetro e radiatori in alluminio con valvole termostatiche.
    2. *Villetta singola anni '90 (Monza/Brianza)* con cappotto esterno parziale, impianto solare termico e caldaia a metano con accumulo ACS.
- **Funzione Copia Dati & Esportazione JSON/CSV**:
  - Pulsante per copiare al volo i dati essenziali formattati in blocco note per un rapido inserimento nei vari software DOCET / Termolog / Edilclima, oltre al download del file `.json` di backup.

***

## 4. Architettura Tecnica & Componenti

```
┌─────────────────────────────────────────────────────────────┐
│                     Store Rilievi APE                       │
│  (Elenco Sopralluoghi, Rilievo Selezionato, Auto-Save)      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       ┌───────┴───────┐              ┌───────┴───────┐
       ▼               ▼              ▼               ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  Sidebar     ││ Form Sezioni ││ Vani & Misure││Foto Rilievo  │
│  Archivio    ││ APE (Tabs)   ││ Auto-Calc Su ││Targhette/Doc │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │    PrintTechnicalSheetAPE    │
               │   (Layout A4 Stampa & PDF)   │
               └──────────────────────────────┘
```

***

## 5. Prossimi Passi (dopo approvazione del piano revisionato)

1. **Configurazione Dati & Asset**:
   - Generazione di asset fotografici realistici per il rilievo APE (facciata condominio, caldaia con targhetta tecnica, libretto impianto, serramento e radiatore).
   - Aggiornamento di `metadata.json` e `index.html` con titolo e descrizione specifici: "CantiereNote — Rilievo APE per iPad".
2. **Sviluppo Interfaccia & Form APE Guidato**:
   - Navigazione Master-Detail ottimizzata per iPad.
   - Schede a tab: Dati Generali, Involucro Opaco & Trasparente, Impianto Riscaldamento/ACS/FER, Vani & Misure, Galleria Foto APE.
   - Dettatura vocale e calcolo automatico della superficie calpestabile e volume riscaldato.
3. **Scheda Tecnica Stampabile A4**:
   - Layout tipografico pulito per la stampa o PDF, con tabella delle caratteristiche termiche rilevate e fotografie impaginate.
   - Backup JSON e funzione "Copia per software APE".
4. **Verifica & Compilazione**:
   - Verifica di compilazione TypeScript con `compile_applet`.
