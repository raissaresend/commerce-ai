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

<img width="1352" height="574" alt="Tela Login" src="https://github.com/user-attachments/assets/334bf284-63b3-4504-8b25-a6429d48cb49" />
<img width="1352" height="574" alt="Chat" src="https://github.com/user-attachments/assets/165ff707-5d1c-478a-bab2-d74be18f49d2" />
<img width="1352" height="574" alt="Vendas" src="https://github.com/user-attachments/assets/e21e6ebb-4f27-45a8-8efa-5186bb7a7fe9" />
<img width="1352" height="574" alt="Agendamento" src="https://github.com/user-attachments/assets/ed117cc0-d907-4e20-8ccc-7148ae9dfddf" />
<img width="1352" height="574" alt="Produtos" src="https://github.com/user-attachments/assets/8fab2f9f-8c79-4d45-890e-507fc3709b85" />
<img width="1352" height="574" alt="Dashboard" src="https://github.com/user-attachments/assets/24194851-7ec3-4ac3-a128-2fe161b02ef1" />


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
