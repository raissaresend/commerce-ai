// backend/routes/dashboard.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão com o banco

// Rota GET para buscar as estatísticas do dashboard
router.get('/', async (req, res) => {
  console.log('Executando Query: Buscar Estatísticas do Dashboard');
  try {
    // 1. Contar Produtos
    const produtosResult = await db.query('SELECT COUNT(*) FROM produtos');
    const totalProdutos = parseInt(produtosResult.rows[0].count, 10);

    // 2. Contar Serviços
    const servicosResult = await db.query('SELECT COUNT(*) FROM servicos');
    const totalServicos = parseInt(servicosResult.rows[0].count, 10);

    // 3. Contar Agendamentos Futuros (exemplo: agendamentos de hoje em diante)
    const agendamentosResult = await db.query(
      "SELECT COUNT(*) FROM agendamentos WHERE data_agendamento >= current_date"
    );
    const totalAgendamentos = parseInt(agendamentosResult.rows[0].count, 10);

    // 4. (Opcional) Contar Atendimentos WhatsApp (usando tabela de histórico)
    // Por enquanto, vamos retornar um número estático para este, já que não estamos salvando o histórico
    const totalWhatsapp = 0; // Mude se quiser simular

    // 5. Envia o objeto JSON com todas as estatísticas
    res.json({
      totalProdutos: totalProdutos,
      totalServicos: totalServicos,
      totalAgendamentos: totalAgendamentos,
      totalWhatsapp: totalWhatsapp 
      // Adicionar mais estatísticas aqui (ex: receita)
    });

  } catch (err) {
    console.error('Erro ao buscar estatísticas do dashboard:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;