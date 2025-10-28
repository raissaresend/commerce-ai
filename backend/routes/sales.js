const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota POST para criar uma nova venda (para 1 produto, simplificado)
router.post('/', async (req, res) => {
  const { clienteId, produtoId, quantidade } = req.body;

  // Validação
  if (!clienteId || !produtoId || !quantidade || quantidade <= 0) {
    return res.status(400).json({ error: 'Dados da venda inválidos. Cliente, produto e quantidade positiva são obrigatórios.' });
  }

  // Inicia o "pool" de conexão para a transação
  const client = await db.pool.connect();
  console.log('Iniciando transação de venda...');

  try {
    // --- INÍCIO DA TRANSAÇÃO ---
    await client.query('BEGIN');

    // 1. Buscar o produto e verificar o estoque
    const produtoResult = await client.query(
      'SELECT nome, preco, quantidade_estoque FROM produtos WHERE id = $1 FOR UPDATE', // 'FOR UPDATE' trava a linha para esta transação
      [produtoId]
    );

    if (produtoResult.rows.length === 0) {
      throw new Error('Produto não encontrado.');
    }

    const produto = produtoResult.rows[0];

    if (produto.quantidade_estoque < quantidade) {
      throw new Error(`Estoque insuficiente para "${produto.nome}". Disponível: ${produto.quantidade_estoque}`);
    }

    // 2. Calcular o novo estoque e o valor total
    const novoEstoque = produto.quantidade_estoque - quantidade;
    const valorTotal = produto.preco * quantidade;

    // 3. Criar a Venda na tabela 'vendas'
    const vendaResult = await client.query(
      'INSERT INTO vendas (cliente_id, valor_total) VALUES ($1, $2) RETURNING id',
      [clienteId, valorTotal]
    );
    const vendaId = vendaResult.rows[0].id;

    // 4. Inserir o item na tabela 'venda_itens'
    await client.query(
      'INSERT INTO venda_itens (venda_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
      [vendaId, produtoId, quantidade, produto.preco]
    );

    // 5. Atualizar o estoque na tabela 'produtos'
    await client.query(
      'UPDATE produtos SET quantidade_estoque = $1 WHERE id = $2',
      [novoEstoque, produtoId]
    );

    // --- FIM DA TRANSAÇÃO ---
    await client.query('COMMIT'); // Confirma todas as operações
    console.log(`Venda ${vendaId} registrada com sucesso. Estoque do produto ${produtoId} atualizado para ${novoEstoque}.`);

    // 6. Enviar resposta de sucesso
    res.status(201).json({ 
        message: 'Venda registrada com sucesso!', 
        vendaId: vendaId, 
        produtoAtualizado: produto.nome, 
        novoEstoque: novoEstoque 
    });

  } catch (err) {
    // Se qualquer passo falhar, desfaz tudo
    await client.query('ROLLBACK');
    console.error('Erro na transação de venda:', err.message);
    res.status(500).json({ error: `Erro ao processar venda: ${err.message}` });
  } finally {
    // Libera a conexão de volta para o pool
    client.release();
    console.log('Transação finalizada e conexão liberada.');
  }
});

module.exports = router;