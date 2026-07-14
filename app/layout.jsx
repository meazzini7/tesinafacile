import "../styles/globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tesinafacile.vercel.app";
const TITOLO = "TesinaFacile — Scrivi e correggi la tua tesina con l'AI";
const DESCRIZIONE =
  "Genera e correggi tesi e tesine per medie, superiori e università. Guidato passo passo, gratuito, con intelligenza artificiale.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITOLO,
    template: "%s | TesinaFacile",
  },
  description: DESCRIZIONE,
  openGraph: {
    title: TITOLO,
    description: DESCRIZIONE,
    url: SITE_URL,
    siteName: "TesinaFacile",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITOLO,
    description: DESCRIZIONE,
  },
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
      <body>
        <AuthProvider>
          <NavBar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
