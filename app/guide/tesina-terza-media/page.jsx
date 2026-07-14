import Link from "next/link";

export const metadata = {
  title: "Come si fa una tesina di terza media — Guida completa",
  description:
    "Guida passo passo alla tesina di terza media: come scegliere l'argomento, collegare le materie e strutturare l'esposizione per l'esame.",
};

export default function TesinaTerzaMediaPage() {
  return (
    <main>
      <section className="pagina-form">
        <article className="container container-stretto contenuto-legale">
          <h1>Come si fa una tesina di terza media</h1>
          <p className="sottotitolo">
            Una guida semplice per arrivare preparati all'esame, senza stress.
          </p>

          <h2 className="titolo-sezione">1. Scegli un argomento che ti piace davvero</h2>
          <p>
            La tesina di terza media parte quasi sempre da un argomento a scelta: uno sport, un
            hobby, un evento storico, un personaggio famoso, un paese. La regola più importante è
            scegliere qualcosa che ti interessa per davvero: sarà molto più facile collegarlo alle
            materie e, soprattutto, presentarlo con sicurezza durante il colloquio orale.
          </p>

          <h2 className="titolo-sezione">2. Trova i collegamenti tra le materie</h2>
          <p>
            Il cuore della tesina di terza media sono i collegamenti interdisciplinari: dal tuo
            argomento centrale devi arrivare, con un filo logico, a toccare più materie possibili
            (italiano, storia, geografia, scienze, tecnologia, lingua straniera, educazione
            civica...). Ad esempio, partendo da "le Olimpiadi" puoi collegarti alla Grecia antica
            (storia/geografia), al corpo umano e lo sport (scienze), a un atleta straniero (lingua),
            fino all'articolo della Costituzione sullo sport (educazione civica).
          </p>

          <h2 className="titolo-sezione">3. Costruisci la scaletta prima di scrivere</h2>
          <p>
            Prima di scrivere il testo definitivo, fai uno schema con: argomento centrale, elenco
            delle materie collegate, e per ognuna una frase che riassume il collegamento. Solo dopo
            aver visto lo schema completo, scrivi i singoli capitoli: sarà molto più semplice e non
            rischierai di ripeterti o di perdere il filo.
          </p>

          <h2 className="titolo-sezione">4. Scrivi capitoli brevi e chiari</h2>
          <p>
            Per la terza media non servono capitoli lunghissimi: meglio 8-10 collegamenti spiegati
            bene in poche righe ciascuno, piuttosto che 3 capitoli infiniti. Usa un linguaggio
            semplice e diretto, evita di copiare frasi intere da internet: il professore se ne
            accorge subito, e in più all'orale potresti non saperle spiegare a parole tue.
          </p>

          <h2 className="titolo-sezione">5. Prepara la presentazione orale</h2>
          <p>
            Ripassa la tesina a voce, non solo leggendola. Prova a raccontarla come se la spiegassi
            a un amico: se riesci a farlo senza guardare i fogli, sei pronto per l'esame.
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
            Se vuoi, TesinaFacile può generarti in pochi minuti una scaletta completa con i
            collegamenti tra le materie, partendo dal tuo argomento (o suggerendotene uno se non
            hai ancora deciso).
          </p>
          <Link className="cta" href="/crea">Crea la mia tesina gratis</Link>
        </article>
      </section>
    </main>
  );
}
