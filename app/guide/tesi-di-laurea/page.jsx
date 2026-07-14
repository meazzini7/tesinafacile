import Link from "next/link";

export const metadata = {
  title: "Come strutturare la tesi di laurea — Guida completa | TesinaFacile",
  description:
    "Indice, capitoli, apparato critico e bibliografia: come strutturare una tesi di laurea in stile accademico, passo dopo passo.",
};

export default function TesiDiLaureaPage() {
  return (
    <main>
      <section className="pagina-form">
        <article className="container container-stretto contenuto-legale">
          <h1>Come strutturare la tesi di laurea</h1>
          <p className="sottotitolo">
            Dalla scelta del relatore alla bibliografia: la struttura di base di una tesi accademica.
          </p>

          <h2 className="titolo-sezione">1. Definisci una domanda di ricerca, non solo un tema</h2>
          <p>
            A differenza della tesina delle superiori, la tesi di laurea non è un insieme di
            collegamenti tra materie: parte da una domanda di ricerca specifica (o da un problema
            pratico, se è una tesi applicativa/di tirocinio). Prima di scrivere qualsiasi capitolo,
            chiarisci con il relatore qual è la domanda a cui vuoi rispondere.
          </p>

          <h2 className="titolo-sezione">2. Struttura tipica</h2>
          <ul className="lista-risultato">
            <li>Introduzione: contesto, domanda di ricerca, struttura della tesi.</li>
            <li>Stato dell'arte / rassegna della letteratura esistente sul tema.</li>
            <li>Metodologia (se prevista dal tuo corso di laurea).</li>
            <li>Capitoli centrali con l'analisi o lo sviluppo del progetto.</li>
            <li>Conclusioni: risposta alla domanda di ricerca e possibili sviluppi futuri.</li>
            <li>Bibliografia in uno stile citazionale coerente (es. APA, Chicago) dall'inizio alla fine.</li>
          </ul>

          <h2 className="titolo-sezione">3. Cura l'apparato critico</h2>
          <p>
            Ogni affermazione non ovvia va supportata da una fonte citata correttamente. Tieni un
            file separato con tutte le fonti man mano che le usi: recuperarle tutte alla fine è il
            modo più veloce per perdere tempo e fare errori nella bibliografia.
          </p>

          <h2 className="titolo-sezione">4. Rileggi con distacco</h2>
          <p>
            Lascia passare almeno un giorno prima di rileggere un capitolo appena scritto: è il modo
            più semplice per accorgersi di ripetizioni, frasi poco chiare o argomentazioni deboli.
            Una correzione automatica può aiutarti a individuare velocemente refusi e problemi di
            struttura, ma il controllo finale del contenuto resta tuo e del relatore.
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
            TesinaFacile può generarti una prima struttura di indice e capitoli in stile accademico,
            oppure correggere un capitolo che hai già scritto segnalando errori e osservazioni sulla
            struttura.
          </p>
          <Link className="cta" href="/crea">Genera la mia struttura gratis</Link>
        </article>
      </section>
    </main>
  );
}
