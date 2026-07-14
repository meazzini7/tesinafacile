"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export default function NavBar() {
  const { utente, caricamento } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-interno">
        <Link href="/" className="navbar-logo">TesinaFacile</Link>
        <nav className="navbar-links">
          <Link href="/crea">Crea la mia tesina</Link>
          <Link href="/correggi">Correggi la mia tesina</Link>
          {!caricamento && utente && <Link href="/dashboard">Dashboard</Link>}
          {!caricamento && !utente && <Link href="/login">Accedi</Link>}
          {!caricamento && utente && (
            <button className="navbar-logout" onClick={() => signOut(auth)}>
              Esci
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
