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
    "Liceo Scientifico",
    "Liceo Classico",
    "Liceo Linguistico",
    "Liceo delle Scienze Umane",
    "Liceo Artistico",
    "Istituto Tecnico Economico",
    "Istituto Tecnico Tecnologico",
    "Istituto Professionale",
  ],
  universita: [
    "Ingegneria",
    "Economia",
    "Giurisprudenza",
    "Medicina",
    "Lettere e Filosofia",
    "Scienze",
    "Psicologia",
    "Architettura",
  ],
  master: [
    "Ingegneria",
    "Economia",
    "Giurisprudenza",
    "Medicina",
    "Lettere e Filosofia",
    "Scienze",
    "Psicologia",
    "Architettura",
  ],
};

const MATERIE_COMUNI = [
  "Italiano", "Storia", "Matematica", "Inglese", "Scienze", "Arte",
  "Ed. Fisica", "Filosofia", "Latino", "Fisica", "Chimica", "Geografia",
  "Diritto", "Economia", "Informatica",
];

const ARGOMENTI_SUGGERITI = [
  { etichetta: "Il calcio", emoji: "⚽" },
  { etichetta: "L'intelligenza artificiale", emoji: "🤖" },
  { etichetta: "Lo spazio", emoji: "🚀" },
  { etichetta: "I social media", emoji: "📱" },
  { etichetta: "Il cambiamento climatico", emoji: "🌍" },
  { etichetta: "La musica", emoji: "🎵" },
];

const OPZIONI_PAGINE = [5, 10, 15, 20, 30];

export default function CreaTesinaPage() {
  const { utente, caricamento } = useAuth();

  const [gradoStudio, setGradoStudio] = useState("");
  const [indirizzoStudio, setIndirizzoStudio] = useState("");
  const [indirizzoPersonalizzato, setIndirizzoPersonalizzato] = useState(false);
  const [materie, setMaterie] = useState([]);
  const [argomento, setArgomento] = useState("");
  const [argomentoPersonalizzato, setArgomentoPersonalizzato] = useState(false);
  const [numeroPagine, setNumeroPagine] = useState(10);

  const [passo, setPasso] = useState(0);
  const [generazione, setGenerazione] = useState(false);
  const [errore, setErrore] = useState("");
  const [tesina, setTesina] = useState(null);

  const PASSI = gradoStudio === "medie"
    ? ["grado", "materie", "argomento", "pagine", "riepilogo"]
    : ["grado", "indirizzo", "materie", "argomento", "pagine", "riepilogo"];

  if (caricamento) return null;

  if (!utente) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>Devi accedere 🔒</h1>
            <p className="sottotitolo">
              Crea un account gratuito per generare la tua tesina con l'AI.
            </p>
            <Link className="cta" href="/login">Accedi o registrati</Link>
          </div>
        </section>
      </main>
    );
  }

  function selezionaGrado(valore) {
    setGradoStudio(valore);
    if (valore === "medie") setIndirizzoStudio("Scuola secondaria di primo grado");
    else setIndirizzoStudio("");
    setIndirizzoPersonalizzato(false);
  }

  function selezionaIndirizzo(valore) {
    setIndirizzoStudio(valore);
    setIndirizzoPersonalizzato(false);
  }

  function alternaMateria(materia) {
    setMaterie((attuali) =>
      attuali.includes(materia) ? attuali.filter((m) => m !== materia) : [...attuali, materia]
    );
  }

  function selezionaArgomento(valore) {
    setArgomento(valore);
    setArgomentoPersonalizzato(false);
  }

  const puoAndareAvanti = () => {
    const passoAttuale = PASSI[passo];
    if (passoAttuale === "grado") return !!gradoStudio;
    if (passoAttuale === "indirizzo") return indirizzoStudio.trim().length > 0;
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
          materie,
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
              🔁 Genera un'altra tesina
            </button>
          </div>
        </section>
      </main>
    );
  }

  const passoAttuale = PASSI[passo];
  const indirizziSuggeriti = INDIRIZZI[gradoStudio] || [];

  return (
    <main>
      <section className="pagina-form">
        <div className="container container-stretto">
          <h1>Crea la mia tesina ✨</h1>
          <p className="sottotitolo">Clicca, clicca, clicca: niente da scrivere (quasi)!</p>

          <div className="barra-progresso">
            <div
              className="barra-progresso-riempimento"
              style={{ width: `${((passo + 1) / PASSI.length) * 100}%` }}
            />
          </div>

          <div className="form-carta">
            {passoAttuale === "grado" && (
              <div className="passo-wizard">
                <span className="emoji-titolo">🎯</span>
                Qual è il tuo grado di studio?
                <div className="griglia-chip">
                  {GRADI.map((g) => (
                    <button
                      type="button"
                      key={g.valore}
                      className={`chip chip-grande ${gradoStudio === g.valore ? "selezionato" : ""}`}
                      onClick={() => selezionaGrado(g.valore)}
                    >
                      <span className="emoji-chip">{g.emoji}</span>
                      {g.etichetta}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {passoAttuale === "indirizzo" && (
              <div className="passo-wizard">
                <span className="emoji-titolo">🏫</span>
                Qual è il tuo indirizzo di studio?
                <div className="griglia-chip">
                  {indirizziSuggeriti.map((ind) => (
                    <button
                      type="button"
                      key={ind}
                      className={`chip ${!indirizzoPersonalizzato && indirizzoStudio === ind ? "selezionato" : ""}`}
                      onClick={() => selezionaIndirizzo(ind)}
                    >
                      {ind}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`chip ${indirizzoPersonalizzato ? "selezionato" : ""}`}
                    onClick={() => {
                      setIndirizzoPersonalizzato(true);
                      setIndirizzoStudio("");
                    }}
                  >
                    ✏️ Altro
                  </button>
                </div>
                {indirizzoPersonalizzato && (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Scrivi il tuo indirizzo di studio"
                    value={indirizzoStudio}
                    onChange={(e) => setIndirizzoStudio(e.target.value)}
                  />
                )}
              </div>
            )}

            {passoAttuale === "materie" && (
              <div className="passo-wizard">
                <span className="emoji-titolo">📎</span>
                Materie da collegare (opzionale, scegline quante vuoi)
                <div className="griglia-chip">
                  {MATERIE_COMUNI.map((m) => (
                    <button
                      type="button"
                      key={m}
                      className={`chip ${materie.includes(m) ? "selezionato" : ""}`}
                      onClick={() => alternaMateria(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {passoAttuale === "argomento" && (
              <div className="passo-wizard">
                <span className="emoji-titolo">💡</span>
                Su cosa vuoi fare la tesina?
                <div className="griglia-chip">
                  {ARGOMENTI_SUGGERITI.map((a) => (
                    <button
                      type="button"
                      key={a.etichetta}
                      className={`chip ${!argomentoPersonalizzato && argomento === a.etichetta ? "selezionato" : ""}`}
                      onClick={() => selezionaArgomento(a.etichetta)}
                    >
                      {a.emoji} {a.etichetta}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`chip ${!argomentoPersonalizzato && argomento === "" ? "selezionato" : ""}`}
                    onClick={() => {
                      setArgomentoPersonalizzato(false);
                      setArgomento("");
                    }}
                  >
                    🎲 Lascia scegliere all'AI
                  </button>
                  <button
                    type="button"
                    className={`chip ${argomentoPersonalizzato ? "selezionato" : ""}`}
                    onClick={() => setArgomentoPersonalizzato(true)}
                  >
                    ✏️ Altro
                  </button>
                </div>
                {argomentoPersonalizzato && (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Scrivi il tuo argomento"
                    value={argomento}
                    onChange={(e) => setArgomento(e.target.value)}
                  />
                )}
              </div>
            )}

            {passoAttuale === "pagine" && (
              <div className="passo-wizard">
                <span className="emoji-titolo">📏</span>
                Quante pagine vuoi che sia?
                <div className="griglia-chip">
                  {OPZIONI_PAGINE.map((p) => (
                    <button
                      type="button"
                      key={p}
                      className={`chip ${Number(numeroPagine) === p ? "selezionato" : ""}`}
                      onClick={() => setNumeroPagine(p)}
                    >
                      {p} pagine
                    </button>
                  ))}
                </div>
              </div>
            )}

            {passoAttuale === "riepilogo" && (
              <div>
                <p className="messaggio-info">
                  <strong>Grado:</strong> {GRADI.find((g) => g.valore === gradoStudio)?.etichetta}<br />
                  <strong>Indirizzo:</strong> {indirizzoStudio}<br />
                  <strong>Materie:</strong> {materie.join(", ") || "a scelta dell'AI"}<br />
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
                  ← Indietro
                </button>
              )}
              {passoAttuale !== "riepilogo" ? (
                <button
                  type="button"
                  className="cta"
                  onClick={() => setPasso((p) => p + 1)}
                  disabled={!puoAndareAvanti()}
                >
                  Avanti →
                </button>
              ) : (
                <button type="button" className="cta" onClick={generaTesina} disabled={generazione}>
                  {generazione ? "Generazione in corso... ⏳" : "✨ Genera la tesina"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
