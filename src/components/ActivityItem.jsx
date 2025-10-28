export default function ActivityItem({ iconComponent, text, time }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
        {/* Renderiza o ícone passado como componente */}
        {iconComponent}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{text}</p>
        <p className="text-xs text-gray-500 truncate">{time}</p>
      </div>
    </div>
  );
}