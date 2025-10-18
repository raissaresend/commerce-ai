// backend/server.js

const express = require("express");
const db = require("./db");
const productRoutes = require("./routes/products");
const app = express();
const port = 3001;

app.use(express.json());

// Rota de teste inicial (pode manter ou remover depois)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend está funcionando!" });
});

// 👇 2. MONTE AS ROTAS DE PRODUTOS
// Dizendo ao Express: "Qualquer requisição que começar com /api/produtos,
// use as rotas definidas em productRoutes"
app.use("/api/produtos", productRoutes);

app.listen(port, async () => {
  console.log(`Backend rodando em http://localhost:${port}`);
  await db.testConnection();
});
