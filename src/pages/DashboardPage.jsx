// src/pages/DashboardPage.jsx

import StatCard from "../components/StatCard";
import ActivityItem from "../components/ActivityItem";
import PerformanceItem from "../components/PerformanceItem";

// 👇 DADOS ATUALIZADOS PARA O TEMA PET SHOP 👇
const recentActivities = [
  { icon: "🛒", text: "Venda de Ração Premier - 15kg", time: "há 5 min" },
  { icon: "✂️", text: 'Banho e Tosa agendado para "Rex"', time: "há 12 min" },
  {
    icon: "💬",
    text: "Atendimento via WhatsApp finalizado",
    time: "há 25 min",
  },
  { icon: "👤", text: 'Novo cliente "Ana (dona do Pipoca)"', time: "há 1h" },
];

const performanceData = [
  { label: "Vendas", value: "R$ 12.450", percentage: 85 },
  { label: "Serviços (Banho e Tosa)", value: "156", percentage: 70 },
  { label: "Taxa de Conversão", value: "24.3%", percentage: 60 },
];

export default function DashboardPage() {
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

      {/* Grid com os cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Produtos em Estoque"
          value="6"
          change="+12 esta semana"
          icon="📦"
        />
        <StatCard
          title="Serviços Cadastrados"
          value="5"
          change="Banho, Tosa, Vacina..."
          icon="✂️"
        />
        <StatCard
          title="Atendimentos WhatsApp"
          value="1,340"
          change="+80 hoje"
          icon="💬"
        />
        <StatCard
          title="Agendamentos da Semana"
          value="24"
          change="para esta semana"
          icon="📅"
        />
      </div>

      {/* Seções de Atividade e Performance */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade Recente */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Atividade Recente
          </h3>
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

        {/* Performance Semanal */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance Semanal
          </h3>
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
