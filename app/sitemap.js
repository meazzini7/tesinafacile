const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tesinafacile.vercel.app";

const PAGINE = [
  "",
  "/crea",
  "/correggi",
  "/login",
  "/guide",
  "/guide/tesina-terza-media",
  "/guide/tesina-maturita",
  "/guide/tesi-di-laurea",
  "/privacy",
  "/termini",
];

export default function sitemap() {
  return PAGINE.map((percorso) => ({
    url: `${SITE_URL}${percorso}`,
    lastModified: new Date(),
  }));
}
