-- Tabela para armazenar os clientes (tutores dos pets)
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE
);

-- Tabela para armazenar os produtos do pet shop
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    categoria VARCHAR(100), -- <<< LINHA ADICIONADA AQUI
    sku VARCHAR(100) UNIQUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para armazenar os serviços oferecidos
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL,
    duracao_minutos INTEGER
);

-- Tabela para os agendamentos de serviços
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    servico_id INTEGER NOT NULL REFERENCES servicos(id),
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente'
);

-- Tabela para o histórico de conversas do WhatsApp
CREATE TABLE historico_conversas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    mensagem TEXT NOT NULL,
    remetente VARCHAR(50) NOT NULL,
    "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para registrar as vendas
CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    data_venda TIMESTAMP WITH TIME ZONE DEFAULT now(),
    valor_total NUMERIC(10, 2) NOT NULL
);

-- Tabela para listar os itens de cada venda
CREATE TABLE venda_itens (
    id SERIAL PRIMARY KEY,
    venda_id INTEGER NOT NULL REFERENCES vendas(id),
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10, 2) NOT NULL
);

-- Inserindo alguns serviços de exemplo para começar
INSERT INTO servicos (nome, descricao, preco, duracao_minutos) VALUES
    ('Banho e Tosa Higiênica', 'Banho completo com tosa das áreas higiênicas.', 75.00, 90),
    ('Consulta Veterinária', 'Consulta de rotina ou emergencial.', 150.00, 45),
    ('Aplicação de Vacina V10', 'Imunização contra as principais doenças.', 90.00, 20),
    ('Corte de Unhas', 'Aparo das unhas de cães ou gatos.', 30.00, 15);