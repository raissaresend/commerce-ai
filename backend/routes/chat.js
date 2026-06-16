require("dotenv").config();
const db = require('../db');
const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

// Verifica a chave da API
if (!process.env.GEMINI_API_KEY) {
  console.error("ERRO FATAL: GEMINI_API_KEY não encontrada no .env");
  process.exit(1);
}
const apiKey = process.env.GEMINI_API_KEY;
console.log("Chave API Carregada:", apiKey ? "Sim" : "NÃO!!!");

// Inicializa o cliente
const ai = new GoogleGenAI({ apiKey: apiKey });

// Escolhe o modelo 
const modelName = "gemini-2.5-flash";
console.log(`Usando modelo Gemini: ${modelName}`);

// Rota POST /api/chat/message
router.post("/message", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Nenhuma mensagem fornecida." });
  }

  console.log(`Mensagem recebida: "${userMessage}"`);

  //Início
  let dbContext = ''; // Variável para guardar informações do banco
  let isSchedulingQuery = false; // Flag para perguntas sobre agendamento

  // --- Lógica Simples de Detecção e Consulta ao DB ---
  const lowerCaseMessage = userMessage.toLowerCase();
  let searchTerm = null;
  const words = lowerCaseMessage.split(' ').filter(word => word.length > 2); // Divide em palavras > 2 letras

  const itemKeywords = ['ração', 'brinquedo', 'coleira', 'sachê', 'arranhador', 'tapete', 'banho', 'tosa', 'consulta', 'vacina', 'unhas'];
  const scheduleKeywords = ['agendar', 'marcar', 'horário', 'disponível', 'disponibilidade'];

  if (scheduleKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
    isSchedulingQuery = true;
  }

  // Tenta encontrar uma keyword e pegar a palavra seguinte como possível nome
  for (let i = 0; i < words.length; i++) {
    if (itemKeywords.includes(words[i])) {
      searchTerm = words[i];
      if (i + 1 < words.length && !itemKeywords.includes(words[i + 1]) && !['de', 'do', 'da', 'para', 'com'].includes(words[i + 1])) {
        searchTerm += ' ' + words[i + 1];
      }
      if (['preço', 'valor', 'estoque', 'tem'].includes(words[i])) {
        if (i + 1 < words.length && !itemKeywords.includes(words[i + 1])) searchTerm = words[i + 1];
        else if (i > 0 && !itemKeywords.includes(words[i - 1])) searchTerm = words[i - 1];
        else searchTerm = null;
      }
      break;
    }
  }

  if (searchTerm) {
    console.log(`Termo de busca simplificado: "${searchTerm}"`);
    try {
      const searchQuery = `
      SELECT nome, preco, quantidade_estoque, 'produto' as tipo FROM produtos WHERE nome ILIKE $1
      UNION ALL
      SELECT nome, preco, null as quantidade_estoque, 'serviço' as tipo FROM servicos WHERE nome ILIKE $1
      ORDER BY length(nome) ASC
      LIMIT 3;
    `;
      const queryParams = [`%${searchTerm}%`];
      console.log('Executando Query:', searchQuery.replace('$1', `'${queryParams[0]}'`)); // Log da query
      const result = await db.query(searchQuery, queryParams);

      if (result.rows.length > 0) {
        dbContext = 'Contexto do Banco de Dados: ';
        result.rows.forEach((item, index) => {
          dbContext += `${index > 0 ? '; ' : ''}O item "${item.nome}" `;
          if (item.tipo === 'produto') {
            dbContext += `custa R$ ${item.preco} e ${item.quantidade_estoque > 0 ? `temos ${item.quantidade_estoque} em estoque` : 'está sem estoque'}.`;
          } else {
            dbContext += `é um serviço e custa R$ ${item.preco}.`;
          }
        });
        console.log('Contexto encontrado no DB:', dbContext);
      } else {
        dbContext = `Contexto do Banco de Dados: Não encontrei itens parecidos com "${searchTerm}" no catálogo.`;
        console.log('Item não encontrado no DB.');
      }
    } catch (dbError) {
      console.error('Erro ao consultar banco de dados:', dbError);
      dbContext = 'Contexto do Banco de Dados: Tive um problema ao consultar o catálogo.';
    }
  }
  // --- Fim da Lógica de Consulta ao DB ---

  try {
    // Define a instrução do sistema
    const systemInstruction = `Você é um atendente virtual de um Pet Shop chamado Commerce.AI. ${dbContext} Responda a pergunta do cliente de forma útil, amigável e concisa. Se ele fizer uma pergunta genérica, pergunte o contexto/específicações. Depois do cliente responder, diga que logo um atendente irá atender. Use o contexto do banco de dados para responder sobre preços e estoque se relevante. Caso não consiga o acesso ao estoque; Evite ser redundante e fazer perguntas que já fez anteriormente. ${isSchedulingQuery ? 'Se o cliente quiser agendar, ofereça o link apenas uma vez: https://calendly.com/raissa-resende-estudante/banho-e-tosa?month=2025-10' : ''}`;

    console.log(`Enviando para Gemini (Modelo: ${modelName})...`);

    //  Chama a API 
    const response = await ai.models.generateContent({
      model: modelName,
      // Passa a mensagem do usuário dentro de 'contents'
      contents: userMessage,
      // Passa a instrução do sistema e outras configurações em 'config'
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // Acesso ao texto da resposta 
    const botText = response.text; 

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
