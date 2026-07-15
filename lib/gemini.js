// lib/gemini.js
// L'API Gemini a volte risponde con 503 "alta demanda, riprova più tardi":
// e' un sovraccarico temporaneo lato Google (tipico nei mesi dopo il
// lancio di un modello popolare), non un errore di configurazione.
// Prova il modello principale un paio di volte, poi passa a modelli di
// riserva meno richiesti prima di arrendersi.
const MODELLI_DI_RISERVA = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash-lite"];

function eSovraccaricoTemporaneo(err) {
  return (
    err.message?.includes("503") ||
    err.message?.includes("overloaded") ||
    err.message?.includes("high demand")
  );
}

export async function generaContenutoConRetry(genAI, prompt, generationConfig) {
  let ultimoErrore;
  for (const nomeModello of MODELLI_DI_RISERVA) {
    const model = genAI.getGenerativeModel({ model: nomeModello, generationConfig });
    for (let tentativo = 1; tentativo <= 2; tentativo++) {
      try {
        return await model.generateContent(prompt);
      } catch (err) {
        ultimoErrore = err;
        if (!eSovraccaricoTemporaneo(err)) throw err;
        console.error(`Gemini (${nomeModello}) sovraccarico, tentativo ${tentativo}/2.`);
        if (tentativo < 2) await new Promise((resolve) => setTimeout(resolve, tentativo * 1500));
      }
    }
  }
  throw ultimoErrore;
}
