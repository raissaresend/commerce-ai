# Commerce AI

Sistema de gestão comercial para pet shops com IA integrada. Permite gerenciar clientes, produtos, agendamentos e vendas, com assistente via WhatsApp powered by Google Gemini.

## Stack

- **Frontend:** React 19, React Router, Tailwind CSS 4, Vite
- **Backend:** Node.js, Express 5, PostgreSQL
- **IA:** Google Gemini API (`@google/genai`)
- **Infra/Ferramentas:** Docker, Docker Compose, Ngrok (Tunelamento para Webhooks)

## Funcionalidades

- Dashboard com métricas de vendas e agendamentos
- Cadastro e listagem de produtos com estoque
- Agendamento de serviços (banho, tosa, consulta veterinária)
- Registro de vendas
- Integração com WhatsApp via IA (Gemini)

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/commerce-ai.git
cd commerce-ai
```

### 2. Suba o banco de dados

```bash
docker compose up -d
```

O schema é criado automaticamente na primeira execução.

### 3. Configure o backend

```bash
cd backend
cp ../.env.example .env
```

Abra o `.env` e preencha sua chave da API do Gemini.

### 4. Instale as dependências e rode o backend

```bash
npm install
npm run dev
```

5. Em outro terminal, rode o frontend

```bash
cd ../frontend
npm install
npm run dev

6. Acesse

http://localhost:5173

Estrutura do projeto

commerce-ai/
├── backend/              # API REST com Express e integração Gemini
├── database/             # Schema SQL do PostgreSQL
├── frontend/
│   └── src/
│       ├── components/   # Componentes reutilizáveis
│       ├── layout/       # Header e layout principal
│       └── pages/        # Páginas da aplicação
├── docker-compose.yml
└── .env.example