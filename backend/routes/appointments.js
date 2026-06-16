const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota GET para buscar todos os agendamentos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        a.id,
        a.data_agendamento,
        a.status,
        -- a.observacoes, -- REMOVIDO
        c.nome AS nome_cliente,
        c.telefone AS telefone_cliente,
        s.nome AS nome_servico,
        s.duracao_minutos
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN servicos s ON a.servico_id = s.id
      ORDER BY a.data_agendamento ASC;
    `;

    console.log('Executando Query: Buscar Agendamentos');
    const result = await db.query(query);

    res.json(result.rows);

  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar agendamentos' });
  }
});

// --- Rota POST para criar um novo agendamento ---
router.post('/', async (req, res) => {
  const { cliente_id, servico_id, data_agendamento, status } = req.body;

  // Validação básica
  if (!cliente_id || !servico_id || !data_agendamento) {
    return res.status(400).json({ error: "Cliente, Serviço e Data são obrigatórios." });
  }

  try {
    const insertQuery = `
      INSERT INTO agendamentos (cliente_id, servico_id, data_agendamento, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [cliente_id, servico_id, data_agendamento, status || 'confirmado'];

    const result = await db.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar agendamento:", err.stack);
    res.status(500).json({ error: "Erro interno do servidor ao criar agendamento" });
  }
});

module.exports = router;