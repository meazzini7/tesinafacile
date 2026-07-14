import "../styles/globals.css";

export const metadata = {
  title: "TesinaFacile — Scrivi e correggi la tua tesina con l'AI",
  description:
    "Genera e correggi tesi e tesine per medie, superiori e università. Guidato passo passo, gratuito, con intelligenza artificiale.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        {/* Google AdSense — sostituisci ca-pub-XXXX con il tuo ID reale dopo l'approvazione */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
