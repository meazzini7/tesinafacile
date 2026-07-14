import Link from "next/link";

export const metadata = {
  title: "Guide: come scrivere tesi e tesine — TesinaFacile",
  description:
    "Guide pratiche su come scrivere una tesina di terza media, la tesina di maturità o la tesi di laurea, passo dopo passo.",
};

const GUIDE = [
  {
    slug: "tesina-terza-media",
    titolo: "Come si fa una tesina di terza media",
    descrizione: "Scaletta, collegamenti tra materie ed esempi per l'esame di terza media.",
  },
  {
    slug: "tesina-maturita",
    titolo: "Come strutturare la tesina di maturità",
    descrizione: "Come scegliere il percorso, collegare le materie e presentarlo all'orale.",
  },
  {
    slug: "tesi-di-laurea",
    titolo: "Come strutturare la tesi di laurea",
    descrizione: "Indice, capitoli, apparato critico e bibliografia in stile accademico.",
  },
];

export default function GuidePage() {
  return (
    <main>
      <section className="percorsi">
        <div className="container">
          <h1>Guide per scrivere la tua tesina o tesi</h1>
          <p className="sottotitolo">
            Contenuti gratuiti passo passo. Se vuoi, l'AI di TesinaFacile può generare la tua
            scaletta e i capitoli in pochi minuti.
          </p>

          <div className="griglia-percorsi">
            {GUIDE.map((g) => (
              <Link className="card-percorso" href={`/guide/${g.slug}`} key={g.slug}>
                <h3>{g.titolo}</h3>
                <p>{g.descrizione}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
