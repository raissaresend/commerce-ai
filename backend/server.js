// backend/server.js

const express = require("express");
const db = require("./db");
const productRoutes = require("./routes/products");
const webhookRoutes = require("./routes/webhooks");
const chatRoutes = require("./routes/chat");
const appointmentRoutes = require("./routes/appointments");

const app = express();
const port = 3001;

// Este middleware especial é para o webhook do Calendly.
// Ele precisa vir ANTES do app.use(express.json()) para funcionar corretamente.
app.use("/api/webhooks/calendly", express.raw({ type: "application/json" }));

// Middleware JSON normal para todas as outras rotas.
app.use(express.json());

// Rotas
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend está funcionando!" });
});
app.use("/api/produtos", productRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/agendamentos", appointmentRoutes);

// Inicia o servidor
app.listen(port, async () => {
  console.log(`Backend rodando em http://localhost:${port}`);
  await db.testConnection();
});
