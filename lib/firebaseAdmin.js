// lib/firebaseAdmin.js
// SOLO lato server (API routes). Serve a verificare il token dell'utente loggato
// prima di consumare crediti Gemini, per evitare abusi da parte di utenti anonimi.
//
// Richiede una Service Account (Firebase Console → Impostazioni progetto →
// Account di servizio → Genera nuova chiave privata). NON committare il JSON:
// mettine i 3 valori come variabili d'ambiente su Vercel:
//   FIREBASE_ADMIN_PROJECT_ID
//   FIREBASE_ADMIN_CLIENT_EMAIL
//   FIREBASE_ADMIN_PRIVATE_KEY   (con i \n mantenuti)

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Inizializzazione lazy: se venisse eseguita al caricamento del modulo,
// il build di Next.js fallirebbe ogni volta che le variabili d'ambiente
// FIREBASE_ADMIN_* non sono ancora impostate (es. build senza .env.local).
function getAdminApp() {
  return getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        }),
      });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export async function verificaUtente(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    return await getAuth(getAdminApp()).verifyIdToken(token);
  } catch {
    return null;
  }
}
