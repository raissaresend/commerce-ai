require('dotenv').config(); 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE || process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log(`✅ Conexão com PostgreSQL (${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE || process.env.DB_NAME}) estabelecida com sucesso!`);
  } catch (err) {
    console.error('❌ Erro ao conectar com o PostgreSQL:', err.message || err.stack);
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  testConnection,
  pool,
};