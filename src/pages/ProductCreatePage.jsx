// src/pages/ProductCreatePage.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCreatePage() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [estoque, setEstoque] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [sku, setSku] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newProduct = { nome, preco, descricao, estoque, categoria, sku };
    console.log("Novo produto a ser salvo:", newProduct);
    alert("Produto salvo! (Verifique o console para ver os dados)");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Cadastro de Produto
          </h2>
          <p className="text-gray-500">Adicione um novo produto ao catálogo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna do Formulário */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Informações do Produto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Nome do Produto */}
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome do Produto
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Ração para Cães Filhotes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900" // 👈 CORREÇÃO AQUI
                  required
                />
              </div>

              {/* Campo Preço */}
              <div>
                <label
                  htmlFor="preco"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preço (R$)
                </label>
                <input
                  type="number"
                  id="preco"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900" // 👈 CORREÇÃO AQUI
                  required
                />
              </div>
            </div>

            {/* Campo Descrição */}
            <div className="mt-6">
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição
              </label>
              <textarea
                id="descricao"
                rows="4"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva as características e benefícios do produto..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900" // 👈 CORREÇÃO AQUI
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Campo Estoque */}
              <div>
                <label
                  htmlFor="estoque"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantidade em Estoque
                </label>
                <input
                  type="number"
                  id="estoque"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                />{" "}
                {/* 👈 CORREÇÃO AQUI */}
              </div>

              {/* Campo Categoria */}
              <div>
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Categoria
                </label>
                <input
                  type="text"
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Alimentação"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                />{" "}
                {/* 👈 CORREÇÃO AQUI */}
              </div>

              {/* Campo SKU */}
              <div>
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Código SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ex: RC_FIL_15KG"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                />{" "}
                {/* 👈 CORREÇÃO AQUI */}
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <Link to="/produtos">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </Link>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </div>

        {/* Coluna de Dicas */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Dicas para um bom cadastro
            </h3>
            <ul className="space-y-3 text-sm text-blue-700 list-disc list-inside">
              <li>
                Use nomes descritivos que facilitem a busca pelos clientes.
              </li>
              <li>
                Inclua detalhes importantes na descrição (tamanho, cor,
                material).
              </li>
              <li>
                Mantenha o estoque sempre atualizado para evitar vendas sem
                produto.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
