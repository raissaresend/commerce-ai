// backend/routes/appointments.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão com o banco

// Rota GET para buscar todos os agendamentos (ou futuros)
router.get('/', async (req, res) => {
  try {
    // 👇 Query SQL CORRIGIDA (removido a.observacoes) 👇
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

    // Envia os resultados
    res.json(result.rows);

  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar agendamentos' });
  }
});

// (Futuramente, podemos adicionar rotas POST, PUT, DELETE para agendamentos manuais)

module.exports = router;