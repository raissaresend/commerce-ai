// backend/routes/webhooks.js

const express = require("express");
const router = express.Router();
const db = require("../db"); // Importa a conexão com o banco

router.post("/calendly", async (req, res) => {
  // Adiciona 'async' para usar await com o banco
  console.log("=== Webhook do Calendly Recebido ===");

  try {
    // 1. Parse o corpo da requisição (que veio como buffer por causa do express.raw)
    let payload;
    try {
      payload = JSON.parse(req.body.toString());
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do corpo do webhook:", parseError);
      return res.status(400).send("Corpo da requisição inválido");
    }

    console.log("Payload (JSON):", JSON.stringify(payload, null, 2)); // Log para depuração

    // 2. Verifique se é o evento que nos interessa ('invitee.created')
    if (payload.event === "invitee.created") {
      console.log("Evento: Agendamento Criado. Processando...");

      // 3. Extraia os dados relevantes do payload
      const eventDetails = payload.payload;
      const inviteeEmail = eventDetails?.email;
      const inviteeName = eventDetails?.name;
      // 👇 LINHA CORRIGIDA AQUI 👇
      const inviteePhone = eventDetails?.scheduled_event?.location?.location; // Ajustado para pegar da location
      const eventStartTime = eventDetails?.scheduled_event?.start_time; // Data/Hora UTC
      const serviceName = eventDetails?.scheduled_event?.name; // Nome do tipo de evento

      console.log(
        `Dados Extraídos - Nome: ${inviteeName}, Email: ${inviteeEmail}, Telefone: ${inviteePhone}, Serviço: ${serviceName}, Horário: ${eventStartTime}`
      );

      // --- Lógica para encontrar/criar Cliente e Serviço ---
      let clienteId = null;
      let servicoId = null;

      // Validação mínima dos dados extraídos
      if (!inviteePhone || !eventStartTime || !serviceName) {
        console.warn(
          "⚠️ Dados essenciais (telefone, horário ou nome do serviço) não encontrados no payload."
        );
        return res
          .status(200)
          .send("Webhook recebido, mas dados insuficientes");
      }

      // A. Encontrar ou Criar Cliente pelo Telefone
      try {
        let clienteResult = await db.query(
          "SELECT id FROM clientes WHERE telefone = $1",
          [inviteePhone]
        );
        if (clienteResult.rows.length > 0) {
          clienteId = clienteResult.rows[0].id;
          console.log(`Cliente encontrado com ID: ${clienteId}`);
        } else {
          const nomeCliente =
            inviteeName || `Cliente ${inviteePhone.slice(-4)}`;
          clienteResult = await db.query(
            "INSERT INTO clientes (nome, telefone, email) VALUES ($1, $2, $3) RETURNING id",
            [nomeCliente, inviteePhone, inviteeEmail]
          );
          clienteId = clienteResult.rows[0].id;
          console.log(`Novo cliente criado com ID: ${clienteId}`);
        }
      } catch (dbError) {
        console.error("❌ Erro ao buscar/criar cliente:", dbError);
        return res.status(500).send("Erro no banco ao processar cliente");
      }

      // B. Encontrar Serviço pelo Nome
      try {
        // Usamos ILIKE para busca case-insensitive e % para flexibilidade
        const servicoResult = await db.query(
          "SELECT id FROM servicos WHERE nome ILIKE $1",
          [`%${serviceName}%`]
        );
        if (servicoResult.rows.length > 0) {
          servicoId = servicoResult.rows[0].id;
          console.log(`Serviço encontrado com ID: ${servicoId}`);
        } else {
          console.warn(
            `⚠️ Serviço com nome "${serviceName}" não encontrado no banco.`
          );
          return res
            .status(200)
            .send("Webhook recebido, mas serviço não cadastrado");
        }
      } catch (dbError) {
        console.error("❌ Erro ao buscar serviço:", dbError);
        return res.status(500).send("Erro no banco ao processar serviço");
      }

      // 4. Insira na tabela 'agendamentos' se tivermos os IDs
      if (clienteId && servicoId) {
        try {
          const insertQuery = `
            INSERT INTO agendamentos (cliente_id, servico_id, data_agendamento, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
          `;
          const values = [clienteId, servicoId, eventStartTime, "confirmado"];

          const result = await db.query(insertQuery, values);
          console.log(
            "✅ Agendamento inserido no banco de dados:",
            result.rows[0]
          );
          res.status(200).send("Agendamento criado com sucesso");
        } catch (dbError) {
          console.error("❌ Erro ao inserir agendamento:", dbError);
          // Verificar se o erro é de chave duplicada (tentativa de inserir o mesmo agendamento?)
          // Poderíamos adicionar uma lógica para UPDATE em vez de INSERT se o agendamento já existir
          res.status(500).send("Erro no banco ao inserir agendamento");
        }
      } else {
        console.warn(
          "⚠️ Não foi possível inserir agendamento por falta de cliente_id ou servico_id."
        );
        res
          .status(200)
          .send("Webhook recebido, mas falha ao linkar cliente/serviço.");
      }
    } else {
      console.log(`Evento ${payload.event} recebido, ignorando.`);
      res.status(200).send("Evento ignorado");
    }
  } catch (error) {
    console.error(
      "❌ Erro geral ao processar webhook do Calendly:",
      error.stack
    );
    res.status(500).send("Erro interno ao processar webhook");
  }
});

module.exports = router;
