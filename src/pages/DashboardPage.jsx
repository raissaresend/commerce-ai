// src/pages/DashboardPage.jsx - CONECTADO AO BACKEND

import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';
import PerformanceItem from '../components/PerformanceItem';

// --- Dados Estáticos (para Atividade e Performance, por enquanto) ---
const recentActivities = [
  { icon: '🛒', text: 'Venda de Ração Premier - 15kg', time: 'há 5 min' },
  { icon: '✂️', text: 'Banho e Tosa agendado para "Rex"', time: 'há 12 min' },
  { icon: '👤', text: 'Novo cliente cadastrado', time: 'há 1h' },
];
const performanceData = [
  { label: 'Vendas (Simulado)', value: 'R$ 1.450', percentage: 85 },
  { label: 'Serviços (Simulado)', value: '15', percentage: 70 },
];
// --- Fim dos Dados Estáticos ---

export default function DashboardPage() {
  // 1. Estado para guardar as estatísticas dinâmicas
  const [stats, setStats] = useState({
    totalProdutos: '...', // Valor inicial
    totalServicos: '...',
    totalAgendamentos: '...',
    totalWhatsapp: '...',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect para buscar os dados da API
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dashboard-stats'); // Chama nossa API
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        setStats(data); // Salva os números reais no estado
        console.log("Estatísticas do dashboard carregadas:", data);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); // Array vazio, roda só uma vez

  // 3. JSX principal
  return (
    <div>
      {/* Título e Status */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500">Visão geral do seu negócio</p>
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          ● Sistema Online
        </span>
      </div>

      {/* Grid com os cards de estatísticas (AGORA DINÂMICOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Produtos Cadastrados" 
          value={isLoading ? '...' : stats.totalProdutos} // Mostra o dado do estado
          icon="📦" 
        />
        <StatCard 
          title="Serviços Cadastrados" 
          value={isLoading ? '...' : stats.totalServicos} // Mostra o dado do estado
          icon="✂️" 
        />
        <StatCard 
          title="Atendimentos WhatsApp" 
          value={isLoading ? '...' : stats.totalWhatsapp} // Mostra o dado do estado
          icon="💬" 
        />
        <StatCard 
          title="Próximos Agendamentos" 
          value={isLoading ? '...' : stats.totalAgendamentos} // Mostra o dado do estado
          icon="📅" 
        />
      </div>

      {/* Mensagem de Erro (se houver) */}
      {error && (
         <div className="mt-4 text-center p-4 bg-red-100 text-red-700 rounded-lg">
           Erro ao carregar estatísticas: {error}
         </div>
      )}

      {/* Seções de Atividade e Performance (ainda estáticas) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                text={activity.text}
                time={activity.time}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Semanal</h3>
           <div className="space-y-6">
            {performanceData.map((item, index) => (
              <PerformanceItem 
                key={index}
                label={item.label}
                value={item.value}
                percentage={item.percentage}
              />
            ))}
           </div>
        </div>
      </div>
    </div>
  );
}