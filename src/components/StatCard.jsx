// src/components/StatCard.jsx

// Um truque: você pode usar a biblioteca 'lucide-react' para ícones,
// mas por enquanto vamos usar emojis como placeholder.
// Para instalar ícones: npm install lucide-react

export default function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
        </div>
        <div className="text-2xl p-2 bg-blue-100 text-blue-600 rounded-md">
          {icon}
        </div>
      </div>
    </div>
  );
}
