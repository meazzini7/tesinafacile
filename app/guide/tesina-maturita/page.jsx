import Link from "next/link";

export const metadata = {
  title: "Come strutturare la tesina di maturità — Guida completa",
  description:
    "Come scegliere il percorso della tesina di maturità, collegare le materie del tuo indirizzo e presentarla al meglio all'orale.",
};

export default function TesinaMaturitaPage() {
  return (
    <main>
      <section className="pagina-form">
        <article className="container container-stretto contenuto-legale">
          <h1>Come strutturare la tesina di maturità</h1>
          <p className="sottotitolo">
            La guida per costruire un percorso solido per l'esame di Stato.
          </p>

          <h2 className="titolo-sezione">1. Capisci cosa cambia rispetto alla terza media</h2>
          <p>
            Alla maturità il "percorso" (così si chiama ufficialmente, non più "tesina" in senso
            stretto) deve essere coerente con il tuo indirizzo di studio: un liceo scientifico, un
            istituto tecnico o un liceo classico avranno collegamenti diversi anche partendo dallo
            stesso argomento. Il livello di approfondimento richiesto è più alto, e i professori si
            aspettano un ragionamento personale, non solo un elenco di nozioni.
          </p>

          <h2 className="titolo-sezione">2. Scegli un tema con un vero filo conduttore</h2>
          <p>
            Evita i collegamenti forzati ("parlo di X in ogni materia solo perché me lo hanno
            chiesto"): meglio un tema con un filo conduttore chiaro, che si sviluppa in modo
            naturale attraverso le materie del tuo indirizzo. Alla commissione piace vedere che hai
            capito il perché dei collegamenti, non solo il cosa.
          </p>

          <h2 className="titolo-sezione">3. Struttura consigliata</h2>
          <ul className="lista-risultato">
            <li>Introduzione: perché hai scelto questo percorso e qual è il filo conduttore.</li>
            <li>Un capitolo per ogni materia collegata, con una parte di analisi personale.</li>
            <li>Una conclusione che ricollega tutto al tema di partenza.</li>
            <li>Bibliografia/sitografia con le fonti usate.</li>
          </ul>

          <h2 className="titolo-sezione">4. Prepara una mappa concettuale per l'orale</h2>
          <p>
            Molte commissioni chiedono di partire da una mappa concettuale che riassume i
            collegamenti. Preparala per iscritto, ma soprattutto esercitati a spiegarla a voce senza
            leggerla: il colloquio valuta anche quanto padroneggi l'argomento, non solo quanto è
            ben scritto sulla carta.
          </p>

          <div className="blocco-annuncio">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="0000000000"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          <h2 className="titolo-sezione">Fatti aiutare dall'AI</h2>
          <p>
            TesinaFacile può generarti una struttura completa adatta al tuo indirizzo di studio,
            con capitoli e collegamenti tra le materie già impostati, che poi puoi personalizzare.
          </p>
          <Link className="cta" href="/crea">Crea il mio percorso gratis</Link>
        </article>
      </section>
    </main>
  );
}
