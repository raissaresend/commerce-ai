// Props:
// - icon: O emoji ou ícone para a atividade
// - text: A descrição da atividade
// - time: Há quanto tempo a atividade ocorreu

export default function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{text}</p>
        <p className="text-xs text-gray-500 truncate">{time}</p>
      </div>
    </div>
  );
}
