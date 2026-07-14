export default function HomePage() {
  const voci = [
    { titolo: "Scegli il tuo grado di studio", numero: "01" },
    { titolo: "Racconta l'argomento (o fatti suggerire uno)", numero: "02" },
    { titolo: "L'AI genera struttura, capitoli e bibliografia", numero: "03" },
    { titolo: "Correggi e scarica in PDF o Word", numero: "04" },
  ];

  const percorsi = [
    { nome: "Scuole medie", emoji: "🎒", desc: "Tesina multidisciplinare semplice, con collegamenti tra materie spiegati passo passo." },
    { nome: "Superiori", emoji: "📚", desc: "Tesina d'esame di maturità, con struttura coerente con il tuo indirizzo di studio." },
    { nome: "Università", emoji: "🎓", desc: "Tesi di laurea con apparato critico, citazioni e bibliografia in stile accademico." },
    { nome: "Master", emoji: "👨‍🎓", desc: "Elaborati avanzati, con supporto su metodologia e revisione approfondita." },
  ];

  return (
    <main>
      <section className="hero">
        <div className="container">
          <span className="etichetta-hero">🎓 Per scuole medie, superiori, università e master</span>
          <h1>Tesine e tesi scritte (e corrette) dall'AI, un bottone alla volta. 🚀</h1>
          <p className="sottotitolo">
            Zero pagine bianche, zero stress. Clicchi qualche bottone su grado di studio,
            indirizzo e argomento, e TesinaFacile genera struttura, capitoli e bibliografia
            della tua tesina o tesi in pochi minuti.
          </p>
          <a className="cta" href="/crea">Crea la mia tesina gratis ✨</a>

          <div className="indice-firma">
            {voci.map((v) => (
              <div className="voce-indice" key={v.numero}>
                <span>{v.titolo}</span>
                <span className="puntini" />
                <span className="numero">{v.numero}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="percorsi">
        <div className="container">
          <h2>Tesine e tesi per ogni grado di studio</h2>
          <div className="griglia-percorsi">
            {percorsi.map((p) => (
              <div className="card-percorso" key={p.nome}>
                <h3>{p.emoji} {p.nome}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Blocco pubblicitario AdSense: mai dentro al wizard, solo in pagine di contenuto */}
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
        </div>
      </section>
    </main>
  );
}
