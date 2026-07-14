export const metadata = {
  title: "Privacy Policy — TesinaFacile",
  description: "Informativa sulla privacy di TesinaFacile: quali dati raccogliamo, come li usiamo e i tuoi diritti.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="pagina-form">
        <div className="container container-stretto contenuto-legale">
          <h1>Privacy Policy</h1>
          <p className="sottotitolo">Ultimo aggiornamento: da inserire.</p>

          <p>
            Questa informativa descrive come TesinaFacile ("il Servizio") raccoglie e utilizza i dati
            degli utenti. Questo testo è un modello di partenza: prima di pubblicare il sito, fallo
            controllare da un professionista, soprattutto perché il Servizio è pensato anche per
            studenti minorenni (scuole medie e superiori).
          </p>

          <h2 className="titolo-sezione">Dati raccolti</h2>
          <ul className="lista-risultato">
            <li>Email e password (o account Google) per la creazione dell'account, tramite Firebase Authentication.</li>
            <li>I testi e i file (PDF/DOCX/TXT) che carichi per la correzione, e i contenuti generati dal wizard.</li>
            <li>Dati tecnici di navigazione raccolti da Google AdSense/Analytics tramite cookie (vedi sezione dedicata).</li>
          </ul>

          <h2 className="titolo-sezione">Come usiamo i dati</h2>
          <ul className="lista-risultato">
            <li>Per farti accedere e ritrovare la cronologia delle tue tesine (Firebase Firestore/Storage, fornito da Google).</li>
            <li>Per generare o correggere le tesine, il testo viene inviato all'API Google Gemini, che lo elabora per restituirti un risultato. Consulta l'informativa di Google sull'uso dei dati per l'AI.</li>
            <li>Non vendiamo i tuoi dati a terzi.</li>
          </ul>

          <h2 className="titolo-sezione">Cookie e pubblicità</h2>
          <p>
            Il sito mostra annunci tramite Google AdSense, che può utilizzare cookie per mostrare
            pubblicità personalizzata. Puoi gestire le preferenze pubblicitarie da{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
              adssettings.google.com
            </a>. Per maggiori informazioni consulta la{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              Privacy Policy di Google
            </a>.
          </p>

          <h2 className="titolo-sezione">I tuoi diritti</h2>
          <p>
            Puoi chiedere in qualsiasi momento l'accesso, la modifica o la cancellazione dei tuoi
            dati e delle tue tesine, scrivendo a: <strong>[inserisci qui la tua email di contatto]</strong>.
          </p>

          <h2 className="titolo-sezione">Minori</h2>
          <p>
            Se hai meno di 14 anni, l'uso del Servizio richiede il consenso di un genitore o tutore.
          </p>
        </div>
      </section>
    </main>
  );
}
