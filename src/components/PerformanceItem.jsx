// src/components/PerformanceItem.jsx

// Props:
// - label: O nome da métrica (ex: "Vendas")
// - value: O valor a ser exibido (ex: "R$ 12.450")
// - percentage: O valor de 0 a 100 para a largura da barra

export default function PerformanceItem({ label, value, percentage }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
