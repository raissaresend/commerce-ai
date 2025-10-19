// backend/routes/webhooks.js

const express = require("express");
const router = express.Router();
// const db = require('../db'); // Vamos descomentar isso depois

// Rota POST para receber notificações do Calendly
router.post("/calendly", (req, res) => {
  console.log("=== Webhook do Calendly Recebido ===");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body.toString()); // Convertendo o buffer para string para ver o conteúdo

  // Responde ao Calendly que recebemos a notificação com sucesso
  res.status(200).send("Webhook recebido com sucesso");
});

module.exports = router;
