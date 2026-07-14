# TesinaFacile — Documento di progetto

Portale web che aiuta studenti (medie, superiori, università) a scrivere, correggere e migliorare tesi e tesine, con generazione/correzione assistita da AI, pensato per essere semplice anche per chi non è "esperto di computer". Monetizzazione tramite Google AdSense.

⚠️ **AZIONE URGENTE PRIMA DI TUTTO — SICUREZZA CHIAVI**

Se hai già condiviso chiavi API in chiaro (es. in una chat con un assistente AI), considerale "bruciate" (potenzialmente visibili/loggate) e **rigenerale subito**:
1. Vai su [Google AI Studio](https://aistudio.google.com/app/apikey) → elimina la vecchia chiave Gemini → creane una nuova.
2. La chiave Gemini **non deve mai** finire nel codice frontend, in GitHub, o in variabili `NEXT_PUBLIC_*`. Va usata **solo lato server** (API route Next.js / Vercel Function), letta da `process.env.GEMINI_API_KEY`, impostata nelle *Environment Variables* di Vercel (non nel repo).
3. La `firebaseConfig` (apiKey compresa) è invece pensata per stare nel frontend — Google la considera pubblica di natura — ma va **protetta con le Firebase Security Rules** (Firestore/Storage) e, idealmente, con **App Check**, altrimenti chiunque può leggere/scrivere sul tuo database.
4. `.env.local` è già escluso in `.gitignore`, così le chiavi reali non finiscono mai su GitHub. Compila `.env.example` → copialo in `.env.local` con i tuoi valori reali.

---

## 1. Stack tecnico

| Livello | Scelta | Perché |
|---|---|---|
| Frontend + Backend | **Next.js 14 (App Router)** | SSR/SSG per SEO (fondamentale per traffico organico → più AdSense), API routes per tenere le chiavi segrete lato server |
| Hosting | **Vercel** (repo `tesinafacile`) | Deploy automatico da GitHub, funzioni serverless per le API route |
| Auth | **Firebase Authentication** | Login email/password + Google, gratuito su piano Spark fino a volumi alti |
| Database | **Firebase Firestore** | Metadati utenti, tesine, crediti, cronologia |
| Storage file | **Firebase Storage** | PDF/DOCX caricati dagli studenti e generati dall'AI |
| AI | **Google Gemini API** (`gemini-1.5-flash` o `gemini-2.0-flash`) | Generazione struttura/testo tesina, correzione, feedback |
| Estrazione testo da PDF/DOCX | `pdf-parse`, `mammoth` (server-side) | Per leggere i file caricati prima di darli a Gemini |
| Monetizzazione | **Google AdSense** | Banner responsive + eventuale "Ad-free" a pagamento come upsell futuro |
| Repo | `github.com/<tuo-utente>/tesinafacile` | Collegato a Vercel per CI/CD automatico |

---

## 2. Struttura del sito (semplice per utenti non esperti)

1. **Home** — spiega in 3 passaggi cosa fa il sito, CTA "Inizia gratis"
2. **Wizard "Crea la mia tesina"** (percorso guidato, 1 domanda alla volta):
   - Grado di studio (Medie / Superiori / Università / Master)
   - Indirizzo (es. Liceo Scientifico, Ragioneria, Ingegneria, Lettere...)
   - Materia/e collegate (per la tesina multidisciplinare delle medie/superiori)
   - Argomento (libero, o suggerito dall'AI se lo studente non sa cosa scegliere)
   - Lunghezza richiesta / numero pagine
   - L'AI genera: scaletta → indice → capitoli → bibliografia suggerita
3. **Correggi la mia tesina** — upload PDF/DOCX/TXT → l'AI restituisce:
   - Correzioni grammaticali/ortografiche
   - Commenti sulla struttura e coerenza
   - Suggerimenti di miglioramento capitolo per capitolo
   - Punteggio di leggibilità
4. **Dashboard personale** — cronologia tesine, crediti residui, download
5. **Pagine SEO** (fondamentali per traffico/AdSense): "Come si fa una tesina di terza media", "Come strutturare la tesi di laurea", ecc. — contenuti evergreen che portano traffico organico da Google.

## 3. Modello di monetizzazione

- **Google AdSense**: banner in home, tra i risultati della correzione, nelle pagine SEO/blog. Mai dentro al wizard di generazione (rovinerebbe l'esperienza e Google penalizza ad density troppo alta).
- Layout "generoso" di contenuto reale rispetto alla pubblicità (AdSense richiede contenuto sostanziale per approvare il sito).
- Possibile evoluzione futura (non richiesta ora): piano "senza pubblicità" o crediti AI extra a pagamento (Stripe), ma il documento si concentra su AdSense come richiesto.

## 4. Flusso AI (lato server, sicuro)

```
Utente (browser)
   │  1. compila wizard / carica file
   ▼
Next.js API Route (/app/api/genera-tesina, /app/api/correggi-tesina)
   │  2. estrae testo da PDF/DOCX se necessario (pdf-parse / mammoth)
   │  3. costruisce il prompt in base a grado + indirizzo di studio
   │  4. chiama Gemini API con GEMINI_API_KEY (variabile server-side)
   ▼
Google Gemini API
   │  5. ritorna testo strutturato (JSON: indice, capitoli, correzioni)
   ▼
Next.js API Route
   │  6. salva risultato su Firestore/Storage (associato all'utente loggato)
   ▼
Frontend → mostra risultato, permette export in DOCX/PDF
```

## 5. Regole Firestore/Storage

Solo l'utente autenticato può leggere/scrivere i propri documenti; nessun accesso anonimo in scrittura per evitare abusi della quota Gemini. Vedi `firestore.rules` e `storage.rules`.

## 6. Struttura del progetto

```
tesinafacile/
├── package.json
├── next.config.js
├── jsconfig.json
├── .env.example
├── .gitignore
├── firestore.rules
├── storage.rules
├── lib/
│   ├── firebase.js          # init client Firebase (auth, firestore, storage)
│   └── firebaseAdmin.js     # init Firebase Admin lato server (verifica token utente)
├── app/
│   ├── layout.jsx
│   ├── page.jsx             # landing page
│   └── api/
│       ├── genera-tesina/route.js    # Gemini: genera tesina da zero
│       └── correggi-tesina/route.js  # Gemini: corregge file caricato
└── styles/
    └── globals.css
```

## 7. Setup locale

```bash
npm install
cp .env.example .env.local   # poi compila .env.local con le tue chiavi reali
npm run dev
```

## 8. Prossimi passi consigliati

1. Impostare `GEMINI_API_KEY` (mai `NEXT_PUBLIC_*`) come variabile d'ambiente su Vercel.
2. Collegare il repo a Vercel per il deploy automatico.
3. Attivare Firebase Auth (Email/Password + Google), Firestore e Storage nella console Firebase, e pubblicare le regole di sicurezza incluse.
4. Registrare il sito su Google AdSense **dopo** aver pubblicato contenuti reali (AdSense rifiuta siti vuoti o solo-tool).
5. Aggiungere Google Analytics/Search Console per monitorare traffico SEO.
