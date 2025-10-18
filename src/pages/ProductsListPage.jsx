// src/pages/ProductsListPage.jsx

import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";

// 👇 DADOS ATUALIZADOS PARA O TEMA PET SHOP 👇
const productsData = [
  {
    name: "Ração Premier - Cães Adultos 15kg",
    category: "Alimentação",
    price: 249.9,
    stock: 12,
    status: "Ativo",
  },
  {
    name: "Brinquedo de Corda para Cães",
    category: "Brinquedos",
    price: 35.5,
    stock: 45,
    status: "Ativo",
  },
  {
    name: "Coleira Anti-pulgas Seresto",
    category: "Acessórios",
    price: 150.0,
    stock: 8,
    status: "Ativo",
  },
  {
    name: "Sachê Whiskas Gatos Castrados",
    category: "Alimentação",
    price: 4.9,
    stock: 120,
    status: "Ativo",
  },
  {
    name: "Arranhador de Gato com Torre",
    category: "Brinquedos",
    price: 180.0,
    stock: 0,
    status: "Ativo",
  },
  {
    name: "Tapete Higiênico Super Secão",
    category: "Higiene",
    price: 59.9,
    stock: 25,
    status: "Ativo",
  },
];

export default function ProductsListPage() {
  return (
    <div>
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Lista de Produtos
          </h2>
          <p className="text-gray-500">Gerencie seu catálogo de produtos</p>
        </div>
        <Link to="/produtos/novo">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700">
            + Novo Produto
          </button>
        </Link>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 flex justify-between items-center">
          <p className="font-semibold">
            Produtos Cadastrados{" "}
            <span className="text-gray-500 font-normal">
              ({productsData.length})
            </span>
          </p>
          <input
            type="search"
            placeholder="Buscar produtos..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <table className="w-full table-auto">
          <thead className="border-b bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4 font-medium">Nome do Produto</th>
              <th className="p-4 font-medium">Categoria</th>
              <th className="p-4 font-medium">Preço</th>
              <th className="p-4 font-medium">Estoque</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">
                  {product.name}
                </td>
                <td className="p-4 text-gray-600">{product.category}</td>
                <td className="p-4 text-gray-600">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </td>
                <td className="p-4 text-gray-600">
                  {product.stock > 0 ? (
                    product.stock
                  ) : (
                    <Badge text="Sem Estoque" variant="danger" />
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <Badge text="Baixo" variant="warning" />
                  )}
                </td>
                <td className="p-4">
                  <Badge text={product.status} variant="success" />
                </td>
                <td className="p-4 text-gray-600 font-bold cursor-pointer">
                  ...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard
          title="Total de Produtos"
          value={productsData.length}
          icon="📦"
        />
        <StatCard
          title="Produtos Ativos"
          value={productsData.filter((p) => p.status === "Ativo").length}
          icon="✅"
        />
        <StatCard
          title="Estoque Baixo"
          value={productsData.filter((p) => p.stock > 0 && p.stock < 10).length}
          icon="⚠️"
        />
      </div>
    </div>
  );
}
