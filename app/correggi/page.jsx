"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

const GRADI = [
  { valore: "medie", etichetta: "Scuole medie", emoji: "🎒" },
  { valore: "superiori", etichetta: "Superiori", emoji: "📚" },
  { valore: "universita", etichetta: "Università", emoji: "🎓" },
  { valore: "master", etichetta: "Master", emoji: "👨‍🎓" },
];

const INDIRIZZI = {
  superiori: [
    "Liceo Scientifico", "Liceo Classico", "Liceo Linguistico",
    "Liceo delle Scienze Umane", "Liceo Artistico",
    "Istituto Tecnico Economico", "Istituto Tecnico Tecnologico", "Istituto Professionale",
  ],
  universita: [
    "Ingegneria", "Economia", "Giurisprudenza", "Medicina",
    "Lettere e Filosofia", "Scienze", "Psicologia", "Architettura",
  ],
  master: [
    "Ingegneria", "Economia", "Giurisprudenza", "Medicina",
    "Lettere e Filosofia", "Scienze", "Psicologia", "Architettura",
  ],
};

export default function CorreggiTesinaPage() {
  const { utente, caricamento } = useAuth();
  const [file, setFile] = useState(null);
  const [gradoStudio, setGradoStudio] = useState("superiori");
  const [indirizzoStudio, setIndirizzoStudio] = useState("");
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");
  const [correzione, setCorrezione] = useState(null);

  const indirizziSuggeriti = INDIRIZZI[gradoStudio] || [];

  if (caricamento) return null;

  if (!utente) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>Devi accedere</h1>
            <p className="sottotitolo">
              Crea un account gratuito per far correggere la tua tesina dall'AI.
            </p>
            <Link className="cta" href="/login">Accedi o registrati</Link>
          </div>
        </section>
      </main>
    );
  }

  async function gestisciSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setErrore("");
    setInvio(true);
    setCorrezione(null);
    try {
      const token = await utente.getIdToken();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("gradoStudio", gradoStudio);
      formData.append("indirizzoStudio", indirizzoStudio);

      const risposta = await fetch("/api/correggi-tesina", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const dati = await risposta.json();
      if (!risposta.ok) throw new Error(dati.errore || "Correzione non riuscita.");
      setCorrezione(dati.correzione);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvio(false);
    }
  }

  if (correzione) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>Risultato della correzione</h1>
            <p className="sottotitolo">
              Punteggio di leggibilità: <strong>{correzione.punteggioLeggibilita}/100</strong>
            </p>

            {correzione.erroriGrammaticali?.length > 0 && (
              <>
                <h2 className="titolo-sezione">Errori grammaticali</h2>
                {correzione.erroriGrammaticali.map((err, i) => (
                  <article className="card-percorso capitolo-generato" key={i}>
                    <p>
                      <s>{err.originale}</s> → <strong>{err.correzione}</strong>
                    </p>
                    <p>{err.spiegazione}</p>
                  </article>
                ))}
              </>
            )}

            {correzione.osservazioniStruttura?.length > 0 && (
              <>
                <h2 className="titolo-sezione">Osservazioni sulla struttura</h2>
                <ul className="lista-risultato">
                  {correzione.osservazioniStruttura.map((voce, i) => (
                    <li key={i}>{voce}</li>
                  ))}
                </ul>
              </>
            )}

            {correzione.suggerimentiGenerali?.length > 0 && (
              <>
                <h2 className="titolo-sezione">Suggerimenti generali</h2>
                <ul className="lista-risultato">
                  {correzione.suggerimentiGenerali.map((voce, i) => (
                    <li key={i}>{voce}</li>
                  ))}
                </ul>
              </>
            )}

            <button className="bottone-secondario" onClick={() => setCorrezione(null)}>
              🔁 Correggi un altro file
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="pagina-form">
        <div className="container container-stretto">
          <h1>Correggi la mia tesina 🔍</h1>
          <p className="sottotitolo">
            Carica il file (PDF, DOCX o TXT, max 15MB) e l'AI ti darà correzioni e suggerimenti.
          </p>

          <form className="form-carta" onSubmit={gestisciSubmit}>
            <div className="passo-wizard">
              Grado di studio
              <div className="griglia-chip">
                {GRADI.map((g) => (
                  <button
                    type="button"
                    key={g.valore}
                    className={`chip ${gradoStudio === g.valore ? "selezionato" : ""}`}
                    onClick={() => {
                      setGradoStudio(g.valore);
                      setIndirizzoStudio("");
                    }}
                  >
                    {g.emoji} {g.etichetta}
                  </button>
                ))}
              </div>
            </div>

            {indirizziSuggeriti.length > 0 && (
              <div className="passo-wizard">
                Indirizzo di studio (opzionale)
                <div className="griglia-chip">
                  {indirizziSuggeriti.map((ind) => (
                    <button
                      type="button"
                      key={ind}
                      className={`chip ${indirizzoStudio === ind ? "selezionato" : ""}`}
                      onClick={() => setIndirizzoStudio(ind)}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label>
              File da correggere
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </label>

            {errore && <p className="messaggio-errore">{errore}</p>}

            <button className="cta" type="submit" disabled={invio || !file}>
              {invio ? "Correzione in corso... ⏳" : "🔍 Correggi la tesina"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
