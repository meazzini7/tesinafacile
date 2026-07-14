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

const PASSI = ["grado", "indirizzo", "materie", "argomento", "pagine", "riepilogo"];

export default function CreaTesinaPage() {
  const { utente, caricamento } = useAuth();
  const [passo, setPasso] = useState(0);
  const [gradoStudio, setGradoStudio] = useState("");
  const [indirizzoStudio, setIndirizzoStudio] = useState("");
  const [materie, setMaterie] = useState("");
  const [argomento, setArgomento] = useState("");
  const [numeroPagine, setNumeroPagine] = useState(10);

  const [generazione, setGenerazione] = useState(false);
  const [errore, setErrore] = useState("");
  const [tesina, setTesina] = useState(null);

  if (caricamento) return null;

  if (!utente) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>Devi accedere</h1>
            <p className="sottotitolo">
              Crea un account gratuito per generare la tua tesina con l'AI.
            </p>
            <Link className="cta" href="/login">Accedi o registrati</Link>
          </div>
        </section>
      </main>
    );
  }

  const puoAndareAvanti = () => {
    if (PASSI[passo] === "grado") return !!gradoStudio;
    if (PASSI[passo] === "indirizzo") return indirizzoStudio.trim().length > 0;
    return true;
  };

  async function generaTesina() {
    setErrore("");
    setGenerazione(true);
    setTesina(null);
    try {
      const token = await utente.getIdToken();
      const risposta = await fetch("/api/genera-tesina", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gradoStudio,
          indirizzoStudio,
          materie: materie.split(",").map((m) => m.trim()).filter(Boolean),
          argomento,
          numeroPagine: Number(numeroPagine) || 10,
        }),
      });
      const dati = await risposta.json();
      if (!risposta.ok) throw new Error(dati.errore || "Generazione non riuscita.");
      setTesina(dati.tesina);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setGenerazione(false);
    }
  }

  if (tesina) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>{tesina.titolo}</h1>

            <h2 className="titolo-sezione">Indice</h2>
            <ol className="lista-risultato">
              {(tesina.indice || []).map((voce, i) => (
                <li key={i}>{voce}</li>
              ))}
            </ol>

            <h2 className="titolo-sezione">Capitoli</h2>
            {(tesina.capitoli || []).map((cap, i) => (
              <article className="card-percorso capitolo-generato" key={i}>
                <h3>{cap.titolo}</h3>
                <p>{cap.contenuto}</p>
              </article>
            ))}

            {tesina.bibliografia?.length > 0 && (
              <>
                <h2 className="titolo-sezione">Bibliografia suggerita</h2>
                <ul className="lista-risultato">
                  {tesina.bibliografia.map((voce, i) => (
                    <li key={i}>{voce}</li>
                  ))}
                </ul>
              </>
            )}

            {tesina.collegamentiInterdisciplinari?.length > 0 && (
              <>
                <h2 className="titolo-sezione">Collegamenti interdisciplinari</h2>
                <ul className="lista-risultato">
                  {tesina.collegamentiInterdisciplinari.map((voce, i) => (
                    <li key={i}>{voce}</li>
                  ))}
                </ul>
              </>
            )}

            <button className="bottone-secondario" onClick={() => setTesina(null)}>
              Genera un'altra tesina
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
          <h1>Crea la mia tesina</h1>
          <p className="sottotitolo">Rispondi a poche domande, un passo alla volta.</p>

          <div className="form-carta">
            {PASSI[passo] === "grado" && (
              <label>
                Qual è il tuo grado di studio?
                <select value={gradoStudio} onChange={(e) => setGradoStudio(e.target.value)}>
                  <option value="">Seleziona...</option>
                  {GRADI.map((g) => (
                    <option key={g.valore} value={g.valore}>{g.etichetta}</option>
                  ))}
                </select>
              </label>
            )}

            {PASSI[passo] === "indirizzo" && (
              <label>
                Qual è il tuo indirizzo di studio?
                <input
                  type="text"
                  placeholder="Es. Liceo Scientifico, Ragioneria, Ingegneria..."
                  value={indirizzoStudio}
                  onChange={(e) => setIndirizzoStudio(e.target.value)}
                />
              </label>
            )}

            {PASSI[passo] === "materie" && (
              <label>
                Materie da collegare (opzionale)
                <input
                  type="text"
                  placeholder="Es. Storia, Italiano, Scienze (separate da virgola)"
                  value={materie}
                  onChange={(e) => setMaterie(e.target.value)}
                />
              </label>
            )}

            {PASSI[passo] === "argomento" && (
              <label>
                Argomento (lascia vuoto per farti suggerire un'idea dall'AI)
                <textarea
                  placeholder="Es. L'energia nucleare, la Rivoluzione francese..."
                  value={argomento}
                  onChange={(e) => setArgomento(e.target.value)}
                />
              </label>
            )}

            {PASSI[passo] === "pagine" && (
              <label>
                Lunghezza indicativa (numero di pagine)
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={numeroPagine}
                  onChange={(e) => setNumeroPagine(e.target.value)}
                />
              </label>
            )}

            {PASSI[passo] === "riepilogo" && (
              <div>
                <p className="messaggio-info">
                  <strong>Grado:</strong> {GRADI.find((g) => g.valore === gradoStudio)?.etichetta}<br />
                  <strong>Indirizzo:</strong> {indirizzoStudio}<br />
                  <strong>Materie:</strong> {materie || "a scelta dell'AI"}<br />
                  <strong>Argomento:</strong> {argomento || "suggerito dall'AI"}<br />
                  <strong>Pagine:</strong> {numeroPagine}
                </p>
                {errore && <p className="messaggio-errore">{errore}</p>}
              </div>
            )}

            <div className="wizard-nav">
              {passo > 0 && (
                <button
                  type="button"
                  className="bottone-secondario"
                  onClick={() => setPasso((p) => p - 1)}
                  disabled={generazione}
                >
                  Indietro
                </button>
              )}
              {PASSI[passo] !== "riepilogo" ? (
                <button
                  type="button"
                  className="cta"
                  onClick={() => setPasso((p) => p + 1)}
                  disabled={!puoAndareAvanti()}
                >
                  Avanti
                </button>
              ) : (
                <button type="button" className="cta" onClick={generaTesina} disabled={generazione}>
                  {generazione ? "Generazione in corso..." : "Genera la tesina"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
