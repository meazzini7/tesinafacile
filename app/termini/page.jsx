export const metadata = {
  title: "Termini di servizio",
  description: "Condizioni d'uso di TesinaFacile.",
};

export default function TerminiPage() {
  return (
    <main>
      <section className="pagina-form">
        <div className="container container-stretto contenuto-legale">
          <h1>Termini di servizio</h1>
          <p className="sottotitolo">Ultimo aggiornamento: da inserire.</p>

          <p>
            Questo testo è un modello di partenza: fallo controllare da un professionista prima
            della pubblicazione definitiva del sito.
          </p>

          <h2 className="titolo-sezione">Cos'è il Servizio</h2>
          <p>
            TesinaFacile è uno strumento che aiuta studenti a generare e correggere tesi e tesine
            con il supporto dell'intelligenza artificiale. I contenuti generati sono un aiuto e uno
            spunto: resta responsabilità dello studente verificarne la correttezza, l'originalità e
            la conformità alle regole del proprio istituto prima di consegnarli.
          </p>

          <h2 className="titolo-sezione">Uso corretto</h2>
          <ul className="lista-risultato">
            <li>Non caricare file che non ti appartengono o che violano diritti d'autore altrui.</li>
            <li>Non usare il Servizio per generare contenuti offensivi, illegali o ingannevoli.</li>
            <li>Il Servizio è offerto "così com'è", senza garanzia di correttezza al 100% dei contenuti generati dall'AI.</li>
          </ul>

          <h2 className="titolo-sezione">Account</h2>
          <p>
            Sei responsabile della sicurezza delle tue credenziali di accesso. Puoi chiedere la
            cancellazione del tuo account in qualsiasi momento.
          </p>

          <h2 className="titolo-sezione">Modifiche</h2>
          <p>
            Questi termini possono cambiare nel tempo; la versione aggiornata sarà sempre disponibile
            su questa pagina.
          </p>
        </div>
      </section>
    </main>
  );
}
