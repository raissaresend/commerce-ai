import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { Package, CheckCircle, AlertTriangle, PlusCircle } from 'lucide-react';

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError('Falha ao carregar produtos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lógica para calcular estatísticas
  const totalProdutos = products.length;
  // Assumindo que todos os produtos listados estão 'ativos'
  const produtosAtivos = products.length; 
  const estoqueBaixo = products.filter(p => p.quantidade_estoque > 0 && p.quantidade_estoque < 10).length;

  if (isLoading) {
    return <div className="text-center p-8">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      {/* Cabeçalho da Página */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lista de Produtos</h2>
          <p className="text-gray-500">Gerencie seu catálogo de produtos</p>
        </div>
        <Link to="/produtos/novo">
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg shadow-sm hover:from-blue-600 hover:to-green-600 text-sm font-medium">
            <PlusCircle size={18} />
            Novo Produto
          </button>
        </Link>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <div className="p-4 flex justify-between items-center">
          <p className="font-semibold">Produtos Cadastrados <span className="text-gray-500 font-normal">({totalProdutos})</span></p>
          <input
            type="search"
            placeholder="Buscar produtos..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-xs"
          />
        </div>
        {totalProdutos === 0 ? (
          <p className="p-4 text-center text-gray-500">Nenhum produto cadastrado ainda.</p>
        ) : (
          <table className="w-full table-auto min-w-[600px]">
            <thead className="border-b bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="p-4 font-medium">Nome do Produto</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium">Preço</th>
                <th className="p-4 font-medium">Estoque</th>
                <th className="p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{product.nome}</td>
                  <td className="p-4 text-gray-600">{product.categoria || '-'}</td>
                  <td className="p-4 text-gray-600">R$ {(parseFloat(product.preco) || 0).toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 text-gray-600">
                    {product.quantidade_estoque > 0 ? product.quantidade_estoque : <Badge text="Sem Estoque" variant="danger" />}
                    {product.quantidade_estoque > 0 && product.quantidade_estoque < 10 && <Badge text="Baixo" variant="warning" />}
                  </td>
                  <td className="p-4 text-gray-600 font-bold cursor-pointer">...</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard 
          title="Total de Produtos" 
          value={totalProdutos} 
          iconComponent={<Package size={24} />} 
        />
        <StatCard 
          title="Produtos Ativos" 
          value={produtosAtivos} 
          iconComponent={<CheckCircle size={24} />} 
        />
        <StatCard 
          title="Estoque Baixo" 
          value={estoqueBaixo} 
          iconComponent={<AlertTriangle size={24} />} 
        />
      </div>
    </div>
  );
}