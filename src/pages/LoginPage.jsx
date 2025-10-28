import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Função para lidar com o login simulado
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Lógica de login (simulada)
    console.log('Tentativa de login com:', { email, password });

    // Simplesmente redireciona para o dashboard se o usuário tentar logar
    if (email && password) {
      // Limpa o erro e redireciona
      setError('');
      navigate('/'); // Redireciona para o Dashboard (rota principal)
    } else {
      setError('Por favor, preencha o e-mail e a senha.');
    }
  };

  return (
    // Container principal que centraliza o card
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      {/* Card de Login */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">

        {/* Logo e Título */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            {/* Ícone */}
            <span className="text-primary-600 p-2 bg-primary-100 rounded-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.2044 2.112C12.822 1.63189 12.078 1.63189 11.6956 2.112L4.4956 11H11V15.5H8.4956L7.19973 17.6001C6.81775 18.0801 7.18974 18.8001 7.80387 18.8001H12V22L19.2 13H13V8.5H15.5L16.7959 6.39993C17.1779 5.91982 16.8059 5.19983 16.1918 5.19983H12V2.8L13.2044 2.112Z" fill="currentColor"/></svg>
            </span>
            <h1 className="text-3xl font-bold text-gray-800">Commerce.AI</h1>
          </div>
          <p className="text-gray-500">Gestão inteligente do seu comércio</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo E-mail */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <p className="text-xs text-red-600 text-center">{error}</p>
          )}

          {/* Botão Entrar) */}
          <div>
          <button
  type="submit"
  className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-md hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  Entrar
</button>
          </div>
        </form>
      </div>
    </div>
  );
}