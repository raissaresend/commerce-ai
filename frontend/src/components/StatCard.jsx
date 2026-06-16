export default function StatCard({ title, value, change, iconComponent }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
        </div>
        {/* Usa o ícone passado como um componente, com as novas cores primárias */}
        <div className="text-primary-600 bg-primary-100 p-2 rounded-md">
          {/* Renderiza o componente do ícone */}
          {iconComponent} 
        </div>
      </div>
    </div>
  );
}