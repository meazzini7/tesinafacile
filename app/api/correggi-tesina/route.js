// app/api/correggi-tesina/route.js
// Riceve un file caricato (PDF/DOCX/TXT), ne estrae il testo, e chiede a Gemini
// correzioni grammaticali, di struttura e suggerimenti, calibrati sul grado/indirizzo di studio.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FieldValue } from "firebase-admin/firestore";
import { verificaUtente, getAdminDb } from "@/lib/firebaseAdmin";
import { generaContenutoConRetry } from "@/lib/gemini";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  let utente;
  try {
    utente = await verificaUtente(request);
  } catch (err) {
    return Response.json(
      { errore: `Devi effettuare l'accesso (${err.motivo}: ${err.message}).` },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const gradoStudio = formData.get("gradoStudio") || "superiori";
  const indirizzoStudio = formData.get("indirizzoStudio") || "";

  if (!file) {
    return Response.json({ errore: "Nessun file caricato." }, { status: 400 });
  }

  // Limite dimensione ragionevole per non far esplodere i costi Gemini
  const DIMENSIONE_MASSIMA = 15 * 1024 * 1024; // 15 MB
  if (file.size > DIMENSIONE_MASSIMA) {
    return Response.json({ errore: "File troppo grande (max 15 MB)." }, { status: 400 });
  }

  try {
    const testo = await estraiTesto(file);
    if (!testo || testo.trim().length < 50) {
      return Response.json({ errore: "Non riesco a leggere testo utile da questo file." }, { status: 422 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Sei un correttore di tesine/tesi per studenti italiani.
Grado di studio: ${gradoStudio}. Indirizzo: ${indirizzoStudio || "non specificato"}.
Correggi il seguente testo: segnala errori grammaticali/ortografici, problemi di struttura e coerenza,
e dai suggerimenti concreti di miglioramento, capitolo per capitolo se individuabile.
Rispondi SOLO in JSON:
{
  "punteggioLeggibilita": 0-100,
  "erroriGrammaticali": [{"originale": "...", "correzione": "...", "spiegazione": "..."}],
  "osservazioniStruttura": ["..."],
  "suggerimentiGenerali": ["..."]
}

TESTO DA CORREGGERE:
"""${testo.slice(0, 30000)}"""`;

    const risultato = await generaContenutoConRetry(model, prompt);
    const correzione = JSON.parse(risultato.response.text());

    const riferimento = await getAdminDb()
      .collection("utenti")
      .doc(utente.uid)
      .collection("tesine")
      .add({
        tipo: "corretta",
        nomeFile: file.name || "documento",
        gradoStudio,
        indirizzoStudio,
        correzione,
        creatoIl: FieldValue.serverTimestamp(),
      });

    return Response.json({ ok: true, id: riferimento.id, correzione });
  } catch (err) {
    console.error("Errore correzione Gemini:", err);
    return Response.json(
      { errore: `Correzione non riuscita: ${err.message}` },
      { status: 500 }
    );
  }
}

async function estraiTesto(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const nome = (file.name || "").toLowerCase();

  if (nome.endsWith(".pdf")) {
    const dati = await pdfParse(buffer);
    return dati.text;
  }
  if (nome.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  // fallback: testo semplice (.txt e simili)
  return buffer.toString("utf-8");
}
