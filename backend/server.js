// backend/server.js

const express = require("express");
const db = require("./db");
const productRoutes = require("./routes/products");
const webhookRoutes = require("./routes/webhooks");

const app = express();
const port = 3001;

// Este middleware especial é para o webhook do Calendly.
// Ele precisa vir ANTES do app.use(express.json()) para funcionar corretamente.
app.use("/api/webhooks/calendly", express.raw({ type: "application/json" }));

// Middleware JSON normal para todas as outras rotas.
app.use(express.json());

// Rota de teste inicial
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend está funcionando!" });
});

// Rotas de Produtos
app.use("/api/produtos", productRoutes);

// ROTAS DE WEBHOOK
app.use("/api/webhooks", webhookRoutes);

// Inicia o servidor
app.listen(port, async () => {
  console.log(`Backend rodando em http://localhost:${port}`);
  await db.testConnection();
});
