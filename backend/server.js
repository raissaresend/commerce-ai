const express = require("express");
const db = require("./db"); // 👈 1. Importe a configuração do banco

const app = express();
const port = 3001;

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend está funcionando!" });
});

// Inicia o servidor e testa a conexão com o banco
app.listen(port, async () => {
  // 👈 2. Adicione 'async' aqui
  console.log(`Backend rodando em http://localhost:${port}`);
  await db.testConnection(); // 👈 3. Chame a função de teste da conexão
});
