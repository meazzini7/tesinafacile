// lib/gemini.js
// L'API Gemini a volte risponde con 503 "alta domanda, riprova più tardi":
// e' un sovraccarico temporaneo lato Google, non un errore di configurazione.
// Riprova automaticamente un paio di volte prima di arrendersi.
export async function generaContenutoConRetry(model, prompt, tentativiMassimi = 3) {
  let ultimoErrore;
  for (let tentativo = 1; tentativo <= tentativiMassimi; tentativo++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      ultimoErrore = err;
      const sovraccaricoTemporaneo =
        err.message?.includes("503") ||
        err.message?.includes("overloaded") ||
        err.message?.includes("high demand");
      if (!sovraccaricoTemporaneo || tentativo === tentativiMassimi) throw err;
      await new Promise((resolve) => setTimeout(resolve, tentativo * 1500));
    }
  }
  throw ultimoErrore;
}
