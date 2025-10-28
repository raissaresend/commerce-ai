import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SalesPage() {
  // Estados 
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const navigate = useNavigate();

  // useEffect para buscar clientes e produtos 
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('/api/clientes');
        if (!response.ok) throw new Error('Erro ao buscar clientes');
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os clientes.');
      }
    };
    const fetchProdutos = async () => {
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        const data = await response.json();
        setProdutos(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os produtos.');
      }
    };
    fetchClientes();
    fetchProdutos();
  }, []);

  // Função handleSubmit 
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

  return (
    <div> 
      <div className="max-w-2xl mx-auto"> 
      
        <h2 className="text-2xl font-bold text-gray-800">Registrar Nova Venda</h2>
        <p className="text-gray-500 mb-6">Selecione o cliente e o produto vendido.</p>

        <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          {/* Seletor de Cliente */}
          <div className="mb-4">
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select
              id="cliente"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              required
            >
              <option value="" disabled>Selecione um cliente...</option>
              {clientes.length === 0 && <option disabled>Carregando...</option>}
              {clientes.map(cli => (
                <option key={cli.id} value={cli.id}>{cli.nome} ({cli.telefone})</option>
              ))}
            </select>
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
              {produtos.length === 0 && <option disabled>Carregando...</option>}
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

          {/* Botão Finalizar */}
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
        
      </div> 
    </div>
  );
}