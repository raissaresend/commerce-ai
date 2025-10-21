// backend/routes/chat.js - USANDO A NOVA SINTAXE @google/genai

require("dotenv").config();
const express = require("express");
const router = express.Router();
// 👇 Importa da biblioteca correta
const { GoogleGenAI } = require("@google/genai");

// Verifica a chave da API
if (!process.env.GEMINI_API_KEY) {
  console.error("ERRO FATAL: GEMINI_API_KEY não encontrada no .env");
  process.exit(1);
}
const apiKey = process.env.GEMINI_API_KEY;
console.log("Chave API Carregada:", apiKey ? "Sim" : "NÃO!!!");

// 👇 Inicializa o cliente central como na documentação "Depois"
const ai = new GoogleGenAI({ apiKey: apiKey });

// Escolhe o modelo - Use o que está disponível para você
const modelName = "gemini-2.5-flash"; // <<< CONFIRME AQUI ou use "gemini-2.5-flash-latest"
console.log(`Usando modelo Gemini: ${modelName}`);

// Rota POST /api/chat/message
router.post("/message", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Nenhuma mensagem fornecida." });
  }

  console.log(`Mensagem recebida: "${userMessage}"`);

  try {
    // Define a instrução do sistema (opcional, mas bom)
    const systemInstruction =
      "Você é um atendente virtual de um Pet Shop chamado Commerce.AI. Responda de forma útil, amigável e concisa.";

    console.log(`Enviando para Gemini (Modelo: ${modelName})...`);

    // 👇 Chama a API usando a sintaxe "Depois" da documentação
    // A chamada é feita diretamente em ai.models.generateContent
    const response = await ai.models.generateContent({
      model: modelName,
      // Passa a mensagem do usuário dentro de 'contents'
      contents: userMessage,
      // Passa a instrução do sistema e outras configurações em 'config'
      config: {
        systemInstruction: systemInstruction,
        // temperature: 0.1, // Exemplo de outra config, se necessário
      },
    });

    // Acesso ao texto da resposta também mudou ligeiramente
    const botText = response.text; // Acessa diretamente .text

    console.log("Resposta do Gemini:", botText);
    res.json({ reply: botText });
  } catch (error) {
    // Tratamento de erro
    console.error("Erro detalhado ao chamar a API do Gemini:", error);
    let errorMessage = "Erro desconhecido ao processar com IA.";
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.statusText) errorMessage += ` (Status: ${error.statusText})`; // Adiciona status se houver
    } else {
      errorMessage = String(error);
    }
    res.status(500).json({
      error: `Erro ao processar a mensagem com a IA. Detalhes: ${errorMessage}`,
    });
  }
});

module.exports = router;
