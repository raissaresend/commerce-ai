// backend/routes/products.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// --- Rota GET para buscar todos os produtos (já existente) ---
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM produtos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err.stack);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar produtos" });
  }
});

router.post("/", async (req, res) => {
  // 1. Extrai os dados do produto do corpo da requisição (enviado pelo front-end)
  const { nome, descricao, preco, quantidade_estoque, categoria, sku } =
    req.body;

  // 2. Validação básica (poderíamos adicionar mais validações aqui)
  if (!nome || !preco || quantidade_estoque === undefined) {
    return res
      .status(400)
      .json({ error: "Nome, preço e estoque são obrigatórios." });
  }

  try {
    // 3. Monta a query SQL para inserir o novo produto
    // Usamos $1, $2, etc. para prevenir SQL Injection (muito importante!)
    const insertQuery = `
      INSERT INTO produtos (nome, descricao, preco, quantidade_estoque, categoria, sku)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *; -- Retorna o produto que acabou de ser inserido
    `;
    const values = [nome, descricao, preco, quantidade_estoque, categoria, sku];

    // 4. Executa a query no banco de dados
    const result = await db.query(insertQuery, values);

    // 5. Envia o produto recém-criado de volta como resposta (status 201 Created)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // 6. Se der erro (ex: SKU duplicado, erro de banco), loga e envia erro
    console.error("Erro ao adicionar produto:", err.stack);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao adicionar produto" });
  }
});

// (Futuramente, adicionaremos as rotas PUT, DELETE aqui)

module.exports = router;
