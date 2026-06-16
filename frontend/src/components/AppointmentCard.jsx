import Badge from "./Badge";

export default function AppointmentCard({
  time,
  client,
  service,
  duration,
  status,
}) {
  const statusVariants = {
    confirmado: "success",
    pendente: "warning",
    cancelado: "danger",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-800">{time}</p>
        <Badge text={status} variant={statusVariants[status] || "default"} />
      </div>
      <div className="mt-2">
        <p className="font-bold text-gray-900">{client}</p>
        <p className="text-sm text-gray-600">{service}</p>
        <p className="text-xs text-gray-400 mt-1">Duração: {duration}</p>
      </div>
    </div>
  );
}
