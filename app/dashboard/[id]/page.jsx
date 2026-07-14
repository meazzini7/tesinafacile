"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export default function DettaglioTesinaPage() {
  const { id } = useParams();
  const { utente, caricamento } = useAuth();
  const [voce, setVoce] = useState(null);
  const [caricamentoVoce, setCaricamentoVoce] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    if (!utente) return;
    let annullato = false;

    async function caricaVoce() {
      setCaricamentoVoce(true);
      try {
        const riferimento = doc(db, "utenti", utente.uid, "tesine", id);
        const istantanea = await getDoc(riferimento);
        if (annullato) return;
        if (!istantanea.exists()) {
          setErrore("Tesina non trovata.");
        } else {
          setVoce({ id: istantanea.id, ...istantanea.data() });
        }
      } catch (err) {
        if (!annullato) setErrore("Non riesco a caricare questa tesina.");
      } finally {
        if (!annullato) setCaricamentoVoce(false);
      }
    }

    caricaVoce();
    return () => {
      annullato = true;
    };
  }, [utente, id]);

  if (caricamento) return null;

  if (!utente) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>Devi accedere</h1>
            <p className="sottotitolo">Accedi per vedere questa tesina.</p>
            <Link className="cta" href="/login">Accedi o registrati</Link>
          </div>
        </section>
      </main>
    );
  }

  if (caricamentoVoce) return null;

  if (errore || !voce) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>Non trovata</h1>
            <p className="messaggio-errore">{errore || "Tesina non trovata."}</p>
            <Link className="bottone-secondario" href="/dashboard">Torna alla dashboard</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="pagina-form">
        <div className="container container-stretto">
          <Link className="bottone-secondario" href="/dashboard">← Torna alla dashboard</Link>

          {voce.tipo === "generata" ? (
            <DettaglioGenerata voce={voce} />
          ) : (
            <DettaglioCorretta voce={voce} />
          )}
        </div>
      </section>
    </main>
  );
}

function DettaglioGenerata({ voce }) {
  const tesina = voce.tesina || {};
  return (
    <>
      <h1>{tesina.titolo}</h1>

      <h2 className="titolo-sezione">Indice</h2>
      <ol className="lista-risultato">
        {(tesina.indice || []).map((v, i) => (
          <li key={i}>{v}</li>
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
            {tesina.bibliografia.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </>
      )}

      {tesina.collegamentiInterdisciplinari?.length > 0 && (
        <>
          <h2 className="titolo-sezione">Collegamenti interdisciplinari</h2>
          <ul className="lista-risultato">
            {tesina.collegamentiInterdisciplinari.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function DettaglioCorretta({ voce }) {
  const correzione = voce.correzione || {};
  return (
    <>
      <h1>{voce.nomeFile || "Tesina corretta"}</h1>
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
            {correzione.osservazioniStruttura.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </>
      )}

      {correzione.suggerimentiGenerali?.length > 0 && (
        <>
          <h2 className="titolo-sezione">Suggerimenti generali</h2>
          <ul className="lista-risultato">
            {correzione.suggerimentiGenerali.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
