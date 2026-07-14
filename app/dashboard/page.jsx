"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardPage() {
  const { utente, caricamento } = useAuth();
  const [tesine, setTesine] = useState([]);
  const [caricamentoTesine, setCaricamentoTesine] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    if (!utente) return;
    let annullato = false;

    async function caricaTesine() {
      setCaricamentoTesine(true);
      try {
        const riferimento = collection(db, "utenti", utente.uid, "tesine");
        const istantanea = await getDocs(query(riferimento, orderBy("creatoIl", "desc")));
        if (!annullato) {
          setTesine(istantanea.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Errore caricamento tesine:", err);
        if (!annullato) {
          setErrore(`Non riesco a caricare la cronologia (${err.code || err.message}).`);
        }
      } finally {
        if (!annullato) setCaricamentoTesine(false);
      }
    }

    caricaTesine();
    return () => {
      annullato = true;
    };
  }, [utente]);

  if (caricamento) return null;

  if (!utente) {
    return (
      <main>
        <section className="pagina-form">
          <div className="container container-stretto">
            <h1>Devi accedere</h1>
            <p className="sottotitolo">Accedi per vedere la tua cronologia di tesine.</p>
            <Link className="cta" href="/login">Accedi o registrati</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="pagina-form">
        <div className="container container-stretto">
          <h1>La tua dashboard</h1>
          <p className="sottotitolo">Cronologia delle tesine generate e corrette.</p>

          {caricamentoTesine && <p className="messaggio-info">Caricamento...</p>}

          {!caricamentoTesine && errore && <p className="messaggio-errore">{errore}</p>}

          {!caricamentoTesine && !errore && tesine.length === 0 && (
            <p className="messaggio-info">
              Non hai ancora nessuna tesina. <Link href="/crea">Creane una</Link> o{" "}
              <Link href="/correggi">correggine una esistente</Link>.
            </p>
          )}

          <div className="lista-dashboard">
            {tesine.map((voce) => (
              <Link className="card-percorso" href={`/dashboard/${voce.id}`} key={voce.id}>
                <h3>
                  {voce.tipo === "generata"
                    ? voce.tesina?.titolo || "Tesina generata"
                    : voce.nomeFile || "Tesina corretta"}
                </h3>
                <p>
                  {voce.tipo === "generata" ? "Generata" : "Corretta"} · {voce.gradoStudio || "—"}
                  {voce.indirizzoStudio ? ` · ${voce.indirizzoStudio}` : ""}
                </p>
                {voce.creatoIl?.toDate && (
                  <p className="messaggio-info">
                    {voce.creatoIl.toDate().toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
