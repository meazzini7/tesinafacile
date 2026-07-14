import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-interno">
        <span>© {new Date().getFullYear()} TesinaFacile</span>
        <nav className="footer-links">
          <Link href="/guide">Guide</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/termini">Termini di servizio</Link>
        </nav>
      </div>
    </footer>
  );
}
