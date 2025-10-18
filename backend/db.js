// backend/db.js

const { Pool } = require("pg");

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "commerce_ai_db",
  password: "1234",
  port: 5432,
});

// Função assíncrona para testar a conexão
async function testConnection() {
  let client; // Declara a variável client fora do try para poder usá-la no finally
  try {
    client = await pool.connect(); // Tenta conectar
    console.log("✅ Conexão com o PostgreSQL estabelecida com sucesso!");
  } catch (err) {
    // Se der erro na conexão, mostra a mensagem de erro
    console.error(
      "❌ Erro ao conectar com o PostgreSQL:",
      err.message || err.stack
    );
  } finally {
    // Independentemente de ter dado certo ou erro, se a conexão foi aberta, ela é liberada
    if (client) {
      client.release();
      console.log("ℹ️ Conexão liberada de volta para o pool.");
    }
  }
}

// Exporta um objeto com a função query (para executar SQL) e a função de teste
module.exports = {
  query: (text, params) => pool.query(text, params),
  testConnection, // Exporta a função de teste para ser chamada no server.js
};
