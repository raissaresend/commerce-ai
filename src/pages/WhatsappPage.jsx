// src/pages/WhatsappPage.jsx
import React, { useState } from "react";

// Dados de exemplo para a lista de conversas (à esquerda)
const initialConversations = [
  {
    id: 1,
    name: "Maria Silva",
    lastMessage: "Obrigado pelo atendimento!",
    time: "14:59",
    unread: 0,
    avatarInitial: "MS",
  },
  {
    id: 2,
    name: "João Santos",
    lastMessage: "Gostaria de remarcar meu horário.",
    time: "12:45",
    unread: 2,
    avatarInitial: "JS",
  },
  {
    id: 3,
    name: "Ana Costa",
    lastMessage: "Qual o valor da vacina V10?",
    time: "Ontem",
    unread: 0,
    avatarInitial: "AC",
  },
  {
    id: 4,
    name: "Pedro Lima",
    lastMessage: "Meu cachorro comeu chocolate!",
    time: "Ontem",
    unread: 1,
    avatarInitial: "PL",
  },
];

// Dados de exemplo para a conversa ativa (no centro) 
const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Olá! Bem-vindo ao Pet Shop XYZ. Como posso ajudar?",
  },
  // Remova outras mensagens de exemplo se quiser começar com uma conversa limpa
];

export default function WhatsappPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(
    initialConversations[0]
  ); // Seleciona a primeira conversa por padrão
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar que o bot está "pensando"

  // Função para enviar mensagem e obter resposta da IA
  const handleSendMessage = async (e) => {
    // Marca a função como async
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return; // Não envia se vazia ou se já está carregando

    const userMessageText = newMessage; // Guarda a mensagem antes de limpar
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userMessageText,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]); // Adiciona mensagem do usuário à tela
    setNewMessage(""); // Limpa o input
    setIsLoading(true); // Indica que o bot está processando

    // --- LÓGICA COM FETCH PARA O BACKEND ---
    try {
      console.log("Enviando para backend:", userMessageText);

      // Chama o endpoint do backend com a mensagem do usuário
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessageText }), // Envia a mensagem no corpo
      });

      if (!response.ok) {
        // Se a resposta do backend não for OK, lança um erro
        const errorData = await response.json().catch(() => ({})); // Tenta pegar erro do JSON, senão objeto vazio
        throw new Error(
          `Erro HTTP: ${response.status} - ${
            errorData.error || response.statusText
          }`
        );
      }

      // Pega a resposta JSON do backend
      const data = await response.json();

      // Cria a mensagem do bot com a resposta da IA
      const botResponse = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]); // Adiciona resposta do bot
    } catch (error) {
      console.error("Erro ao enviar/receber mensagem do backend:", error);
      // Adiciona uma mensagem de erro na interface do chat
      const errorResponse = {
        id: Date.now() + 1,
        sender: "bot",
        text: `Desculpe, não consegui processar sua mensagem agora. (${error.message})`,
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false); // Terminou de carregar (com sucesso ou erro)
    }
    // --- FIM DA LÓGICA ---
  };

  return (
    // Container principal do chat
    <div className="flex h-[calc(100vh-100px)] border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Coluna Esquerda: Lista de Conversas */}
      <div className="w-1/4 border-r border-gray-200 flex flex-col min-w-[250px]">
        {/* Cabeçalho da Lista */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Atendimento WhatsApp
          </h2>
        </div>
        {/* Lista Rolável */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            // Item da Conversa
            <div
              key={convo.id}
              className={`p-4 flex items-center space-x-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                activeConversation?.id === convo.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveConversation(convo)} // Atualiza a conversa ativa ao clicar
            >
              {/* Avatar */}
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                {convo.avatarInitial}
              </div>
              {/* Nome e Última Mensagem */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {convo.name}
                  </p>
                  <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {convo.time}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {convo.lastMessage}
                  </p>
                  {/* Contador de Não Lidas */}
                  {convo.unread > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {convo.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Central: Conversa Ativa */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {" "}
        {/* Fundo levemente cinza para mensagens */}
        {/* Cabeçalho da Conversa Ativa */}
        {activeConversation ? ( // Só mostra se houver conversa ativa
          <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-white">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
              {activeConversation.avatarInitial}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {activeConversation.name}
              </p>
              <p className="text-xs text-green-600">Online</p>{" "}
              {/* Status Simulado */}
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200 flex items-center justify-center text-gray-500">
            Selecione uma conversa
          </div>
        )}
        {/* Área das Mensagens (Rolável) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            // Balão de Mensagem
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {/* Indicador de "digitando..." */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg max-w-xs lg:max-w-md bg-white text-gray-500 border border-gray-200 shadow-sm italic">
                Digitando...
              </div>
            </div>
          )}
        </div>
        {/* Área de Input de Mensagem */}
        <div className="p-4 border-t border-gray-200 bg-gray-100">
          <form
            onSubmit={handleSendMessage}
            className="flex space-x-3 items-center"
          >
            {/* Ícone de anexo (opcional) */}
            {/* <button type="button" className="text-gray-500 hover:text-gray-700">📎</button> */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              disabled={isLoading} // Desabilita input enquanto espera resposta
            />
            {/* Ícone de emoji */}
            {/* <button type="button" className="text-gray-500 hover:text-gray-700">😀</button> */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !newMessage.trim()} // Desabilita botão se estiver carregando ou vazio
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
