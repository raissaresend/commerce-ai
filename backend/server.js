const express = require("express");
const db = require("./db");
const productRoutes = require("./routes/products");
const webhookRoutes = require("./routes/webhooks");
const chatRoutes = require("./routes/chat");
const appointmentRoutes = require("./routes/appointments");
const dashboardRoutes = require("./routes/dashboard");
const salesRoutes = require("./routes/sales");
const clientRoutes = require("./routes/clients");

const app = express();
const port = 3001;

// Este middleware especial é para o webhook do Calendly.
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
app.use("/api/dashboard-stats", dashboardRoutes);
app.use("/api/vendas", salesRoutes);
app.use("/api/clientes", clientRoutes);

// Inicia o servidor
app.listen(port, async () => {
  console.log(`Backend rodando em http://localhost:${port}`);
  await db.testConnection();
});
