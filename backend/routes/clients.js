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

module.exports = router;