"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

const GRADI = [
  { valore: "medie", etichetta: "Scuole medie" },
  { valore: "superiori", etichetta: "Superiori" },
  { valore: "universita", etichetta: "Università" },
  { valore: "master", etichetta: "Master" },
];

export default function CorreggiTesinaPage() {
  const { utente, caricamento } = useAuth();
  const [file, setFile] = useState(null);
  const [gradoStudio, setGradoStudio] = useState("superiori");
  const [indirizzoStudio, setIndirizzoStudio] = useState("");
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");
  const [correzione, setCorrezione] = useState(null);

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
              Correggi un altro file
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
          <h1>Correggi la mia tesina</h1>
          <p className="sottotitolo">
            Carica il file (PDF, DOCX o TXT, max 15MB) e l'AI ti darà correzioni e suggerimenti.
          </p>

          <form className="form-carta" onSubmit={gestisciSubmit}>
            <label>
              Grado di studio
              <select value={gradoStudio} onChange={(e) => setGradoStudio(e.target.value)}>
                {GRADI.map((g) => (
                  <option key={g.valore} value={g.valore}>{g.etichetta}</option>
                ))}
              </select>
            </label>

            <label>
              Indirizzo di studio (opzionale)
              <input
                type="text"
                placeholder="Es. Liceo Scientifico, Ingegneria..."
                value={indirizzoStudio}
                onChange={(e) => setIndirizzoStudio(e.target.value)}
              />
            </label>

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
              {invio ? "Correzione in corso..." : "Correggi la tesina"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
