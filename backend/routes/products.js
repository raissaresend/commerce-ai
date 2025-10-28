const express = require("express");
const router = express.Router();
const db = require("../db");

// --- Rota GET para buscar todos os produtos ---
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
  // 1. Extrai os dados do produto do corpo da requisição 
  const { nome, descricao, preco, quantidade_estoque, categoria, sku } =
    req.body;

  // 2. Validação básica
  if (!nome || !preco || quantidade_estoque === undefined) {
    return res
      .status(400)
      .json({ error: "Nome, preço e estoque são obrigatórios." });
  }

  try {
    // 3. Monta a query SQL para inserir o novo produto
    // Usa $1, $2, etc. para prevenir SQL Injection
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

// O ':id' na URL indica um parâmetro dinâmico
router.get("/:id", async (req, res) => {
  // 1. Pega o ID da URL (vem como string, convertemos para inteiro)
  const productId = parseInt(req.params.id);

  // 2. Validação básica do ID
  if (isNaN(productId)) {
    return res.status(400).json({ error: "ID do produto inválido." });
  }

  try {
    // 3. Monta a query SQL para buscar o produto com o ID específico
    const selectQuery = "SELECT * FROM produtos WHERE id = $1";
    const values = [productId];

    // 4. Executa a query
    const result = await db.query(selectQuery, values);

    // 5. Verifica se o produto foi encontrado
    if (result.rows.length === 0) {
      // Se não encontrou, retorna erro 404 Not Found
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // 6. Se encontrou, retorna o produto encontrado (o primeiro item do array rows)
    res.json(result.rows[0]);
  } catch (err) {
    // 7. Se der erro na consulta, loga e envia erro 500
    console.error(`Erro ao buscar produto com ID ${productId}:`, err.stack);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar produto" });
  }
});

router.put("/:id", async (req, res) => {
  // 1. Pega o ID da URL
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ error: "ID do produto inválido." });
  }

  // 2. Pega os novos dados do corpo da requisição
  const { nome, descricao, preco, quantidade_estoque, categoria, sku } =
    req.body;

  // 3. Validação básica (garantir que pelo menos algo foi enviado para atualizar)
  if (
    !nome &&
    !descricao &&
    preco === undefined &&
    quantidade_estoque === undefined &&
    !categoria &&
    !sku
  ) {
    return res
      .status(400)
      .json({ error: "Nenhum dado fornecido para atualização." });
  }

  try {
    // 4. Monta a query SQL UPDATE
    // Usamos COALESCE($X, coluna_existente) para atualizar apenas os campos
    // que foram enviados na requisição. Se um campo não veio, ele mantém o valor antigo.
    const updateQuery = `
        UPDATE produtos
        SET
          nome = COALESCE($1, nome),
          descricao = COALESCE($2, descricao),
          preco = COALESCE($3, preco),
          quantidade_estoque = COALESCE($4, quantidade_estoque),
          categoria = COALESCE($5, categoria),
          sku = COALESCE($6, sku)
        WHERE id = $7
        RETURNING *; -- Retorna o produto atualizado
      `;

    const values = [
      nome,
      descricao,
      preco,
      quantidade_estoque,
      categoria,
      sku,
      productId,
    ];

    // 5. Executa a query
    const result = await db.query(updateQuery, values);

    // 6. Verifica se algum produto foi realmente atualizado
    if (result.rows.length === 0) {
      // Se não atualizou (provavelmente porque o ID não existe), retorna 404
      return res
        .status(404)
        .json({ error: "Produto não encontrado para atualização." });
    }

    // 7. Se atualizou, retorna o produto com os dados atualizados
    res.json(result.rows[0]);
  } catch (err) {
    // 8. Se der erro (ex: SKU duplicado ao tentar atualizar), loga e envia erro 500
    console.error(`Erro ao atualizar produto com ID ${productId}:`, err.stack);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao atualizar produto" });
  }
});

router.delete("/:id", async (req, res) => {
  // 1. Pega o ID da URL
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ error: "ID do produto inválido." });
  }

  try {
    // 2. Monta a query SQL DELETE
    const deleteQuery = "DELETE FROM produtos WHERE id = $1 RETURNING id"; // RETURNING id ajuda a saber se algo foi deletado
    const values = [productId];

    // 3. Executa a query
    const result = await db.query(deleteQuery, values);

    // 4. Verifica se alguma linha foi realmente deletada
    if (result.rowCount === 0) {
      // Se nenhuma linha foi afetada (rowCount é 0), o ID não existia
      return res
        .status(404)
        .json({ error: "Produto não encontrado para exclusão." });
    }

    // 5. Se deletou com sucesso, retorna status 204 No Content
    res.status(204).send();
  } catch (err) {
    // 6. Se der erro (ex: erro de banco), loga e envia erro 500
    console.error(`Erro ao deletar produto com ID ${productId}:`, err.stack);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao deletar produto" });
  }
});

module.exports = router;
