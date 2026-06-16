const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota GET para buscar todos os clientes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, nome, telefone FROM clientes ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota POST para criar um novo cliente rapidamente
router.post('/', async (req, res) => {
  const { nome, telefone } = req.body;

  // Validação básica de segurança
  if (!nome || !telefone) {
    return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO clientes (nome, telefone) VALUES ($1, $2) RETURNING *',
      [nome, telefone]
    );
    
    res.status(201).json(result.rows[0]);

  } catch (err) {
    // O código 23505 no PostgreSQL significa "Unique violation"
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Já existe um cliente cadastrado com este telefone.' });
    }
    
    console.error('Erro ao cadastrar cliente:', err.stack);
    res.status(500).json({ error: 'Erro interno ao tentar salvar o cliente.' });
  }
});

module.exports = router;