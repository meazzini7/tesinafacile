// app/api/genera-tesina/route.js
// Endpoint server-side: riceve i parametri del wizard e genera la tesina con Gemini.
// La GEMINI_API_KEY non lascia mai il server.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FieldValue } from "firebase-admin/firestore";
import { verificaUtente, getAdminDb } from "@/lib/firebaseAdmin";

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

  const {
    gradoStudio,      // "medie" | "superiori" | "universita" | "master"
    indirizzoStudio,  // es. "Liceo Scientifico", "Ingegneria Informatica"
    materie,          // es. ["Storia", "Italiano", "Scienze"]
    argomento,        // testo libero, può essere vuoto
    numeroPagine,
  } = await request.json();

  if (!gradoStudio || !indirizzoStudio) {
    return Response.json({ errore: "Grado e indirizzo di studio sono obbligatori." }, { status: 400 });
  }

  const prompt = costruisciPrompt({ gradoStudio, indirizzoStudio, materie, argomento, numeroPagine });

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const risultato = await model.generateContent(prompt);
    const testoJson = risultato.response.text();
    const tesina = JSON.parse(testoJson);

    const riferimento = await getAdminDb()
      .collection("utenti")
      .doc(utente.uid)
      .collection("tesine")
      .add({
        tipo: "generata",
        gradoStudio,
        indirizzoStudio,
        materie: materie || [],
        argomento: argomento || "",
        numeroPagine: numeroPagine || 10,
        tesina,
        creatoIl: FieldValue.serverTimestamp(),
      });

    return Response.json({ ok: true, id: riferimento.id, tesina });
  } catch (err) {
    console.error("Errore generazione Gemini:", err);
    return Response.json(
      { errore: `Generazione non riuscita: ${err.message}` },
      { status: 500 }
    );
  }
}

function costruisciPrompt({ gradoStudio, indirizzoStudio, materie, argomento, numeroPagine }) {
  return `Sei un tutor didattico che aiuta uno studente italiano a scrivere una tesina.
Grado di studio: ${gradoStudio}.
Indirizzo di studio: ${indirizzoStudio}.
Materie da collegare: ${(materie || []).join(", ") || "a tua scelta, coerenti con l'indirizzo"}.
Argomento indicato dallo studente: ${argomento || "nessuno, proponine tu uno adatto"}.
Lunghezza indicativa: ${numeroPagine || 10} pagine.

Adatta linguaggio e complessità al grado di studio indicato (più semplice per le medie, più rigoroso e con apparato critico/bibliografico per università).

Rispondi SOLO con un JSON valido con questa struttura:
{
  "titolo": "...",
  "indice": ["capitolo 1", "capitolo 2", "..."],
  "capitoli": [{"titolo": "...", "contenuto": "..."}],
  "bibliografia": ["..."],
  "collegamentiInterdisciplinari": ["materia: spunto di collegamento"]
}`;
}
