// backend/db.js - Atualizado para usar variáveis de ambiente

require('dotenv').config(); // Carrega as variáveis do .env
const { Pool } = require('pg');

// Configuração da conexão usando variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Usa a porta do .env ou 5432 como padrão
});

// Função assíncrona para testar a conexão
async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log(`✅ Conexão com PostgreSQL (${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}) estabelecida com sucesso!`);
  } catch (err) {
    console.error('❌ Erro ao conectar com o PostgreSQL:', err.message || err.stack);
  } finally {
    if (client) {
      client.release();
      // console.log('ℹ️ Conexão liberada de volta para o pool.'); // Log opcional
    }
  }
}

// Exporta a função query e a função de teste
module.exports = {
  query: (text, params) => pool.query(text, params),
  testConnection,
};