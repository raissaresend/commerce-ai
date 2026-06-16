import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SalesPage() {
  // Estados da Venda
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true); // <-- Novo estado para controlar o carregamento inicial
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  // Estados para o Modal de Novo Cliente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoClienteNome, setNovoClienteNome] = useState('');
  const [novoClienteTelefone, setNovoClienteTelefone] = useState('');
  const [isCadastrando, setIsCadastrando] = useState(false);

  const navigate = useNavigate();

  // useEffect para buscar clientes e produtos 
  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingData(true);
      try {
        const [resClientes, resProdutos] = await Promise.all([
          fetch('/api/clientes'),
          fetch('/api/produtos')
        ]);

        if (!resClientes.ok) throw new Error('Erro ao buscar clientes');
        if (!resProdutos.ok) throw new Error('Erro ao buscar produtos');

        setClientes(await resClientes.json());
        setProdutos(await resProdutos.json());
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados iniciais.');
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchData();
  }, []);

  // Função handleSubmit da VENDA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: parseInt(clienteId),
          produtoId: parseInt(produtoId),
          quantidade: parseInt(quantidade)
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      alert(`Venda registrada com sucesso! Novo estoque para "${data.produtoAtualizado}": ${data.novoEstoque}`);
      navigate('/produtos');
    } catch (err) {
      console.error('Erro ao registrar venda:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função handleCadastrarClienteRapido do MODAL
  const handleCadastrarClienteRapido = async (e) => {
    e.preventDefault();
    setIsCadastrando(true);
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoClienteNome, telefone: novoClienteTelefone })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar cliente');

      // Atualiza a lista de clientes com o novo cliente e seleciona ele no formulário
      setClientes([...clientes, data]);
      setClienteId(data.id); 
      
      // Limpa e fecha o modal
      setNovoClienteNome('');
      setNovoClienteTelefone('');
      setIsModalOpen(false);
      
      alert('Cliente cadastrado com sucesso!');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCadastrando(false);
    }
  };

  return (
    <div> 
      <div className="max-w-2xl mx-auto"> 
      
        <h2 className="text-2xl font-bold text-gray-800">Registrar Nova Venda</h2>
        <p className="text-gray-500 mb-6">Selecione o cliente e o produto vendido.</p>

        {/* --- INÍCIO DO FORMULÁRIO DE VENDA --- */}
        <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          
          {/* Seletor de Cliente */}
          <div className="mb-4">
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <div className="flex gap-2">
              <select
                id="cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                required
              >
                <option value="" disabled>Selecione um cliente...</option>
                {isFetchingData && <option disabled>Carregando clientes...</option>}
                {!isFetchingData && clientes.length === 0 && <option disabled>Nenhum cliente cadastrado</option>}
                
                {clientes.map(cli => (
                  <option key={cli.id} value={cli.id}>{cli.nome} ({cli.telefone})</option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                + Novo
              </button>
            </div>
          </div>

          {/* Seletor de Produto */}
          <div className="mb-4">
            <label htmlFor="produto" className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <select
              id="produto"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              required
            >
              <option value="" disabled>Selecione um produto...</option>
              {isFetchingData && <option disabled>Carregando produtos...</option>}
              {!isFetchingData && produtos.length === 0 && <option disabled>Nenhum produto em estoque</option>}
              
              {produtos.map(prod => (
                <option key={prod.id} value={prod.id} disabled={prod.quantidade_estoque === 0}>
                  {prod.nome} (Estoque: {prod.quantidade_estoque})
                </option>
              ))}
            </select>
          </div>

          {/* Campo de Quantidade */}
          <div className="mb-6">
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input
              type="number"
              id="quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              required
            />
          </div>

          {error && <p className="text-xs text-red-600 text-center mb-4">{error}</p>}

          {/* Botão Finalizar Venda */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !clienteId || !produtoId}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-5 py-2 rounded-lg shadow-sm hover:from-blue-600 hover:to-green-600 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? 'Registrando...' : 'Registrar Venda'}
            </button>
          </div>
        </form>
        {/* --- FIM DO FORMULÁRIO DE VENDA --- */}
        
      </div> 

      {/* --- INÍCIO DO MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Novo Cliente</h3>
            
            <form onSubmit={handleCadastrarClienteRapido}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                  type="text" 
                  required
                  value={novoClienteNome}
                  onChange={(e) => setNovoClienteNome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input 
                  type="text" 
                  required
                  value={novoClienteTelefone}
                  onChange={(e) => setNovoClienteTelefone(e.target.value)}
                  placeholder="Ex: 34999999999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isCadastrando}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCadastrando ? 'Salvando...' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- FIM DO MODAL --- */}

    </div>
  );
}