const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, nome FROM servicos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

module.exports = router;