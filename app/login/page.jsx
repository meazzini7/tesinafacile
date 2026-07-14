"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [modalita, setModalita] = useState("accedi"); // "accedi" | "registrati"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);

  async function gestisciSubmit(e) {
    e.preventDefault();
    setErrore("");
    setCaricamento(true);
    try {
      if (modalita === "accedi") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setErrore(traduciErrore(err.code));
    } finally {
      setCaricamento(false);
    }
  }

  async function gestisciGoogle() {
    setErrore("");
    setCaricamento(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      setErrore(traduciErrore(err.code));
    } finally {
      setCaricamento(false);
    }
  }

  return (
    <main>
      <section className="pagina-form">
        <div className="container container-stretto">
          <h1>{modalita === "accedi" ? "Accedi" : "Crea un account"}</h1>
          <p className="sottotitolo">
            Serve un account gratuito per generare e salvare le tue tesine.
          </p>

          <form className="form-carta" onSubmit={gestisciSubmit}>
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {errore && <p className="messaggio-errore">{errore}</p>}

            <button className="cta" type="submit" disabled={caricamento}>
              {caricamento ? "Attendere..." : modalita === "accedi" ? "Accedi" : "Registrati"}
            </button>
          </form>

          <button className="bottone-secondario" onClick={gestisciGoogle} disabled={caricamento}>
            Continua con Google
          </button>

          <p className="cambia-modalita">
            {modalita === "accedi" ? (
              <>
                Non hai un account?{" "}
                <button type="button" onClick={() => setModalita("registrati")}>
                  Registrati
                </button>
              </>
            ) : (
              <>
                Hai già un account?{" "}
                <button type="button" onClick={() => setModalita("accedi")}>
                  Accedi
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  );
}

function traduciErrore(codice) {
  const messaggi = {
    "auth/invalid-email": "Email non valida.",
    "auth/user-not-found": "Nessun account con questa email.",
    "auth/wrong-password": "Password errata.",
    "auth/invalid-credential": "Email o password errate.",
    "auth/email-already-in-use": "Esiste già un account con questa email.",
    "auth/weak-password": "La password deve avere almeno 6 caratteri.",
    "auth/popup-closed-by-user": "Accesso con Google annullato.",
  };
  return messaggi[codice] || "Si è verificato un errore, riprova.";
}
