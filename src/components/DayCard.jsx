// - dayName: 'Dom', 'Seg', 'Ter', etc.
// - dayNumber: O número do dia
// - appointments: Uma lista de agendamentos para aquele dia
// - isActive: true se for o dia selecionado

export default function DayCard({
  dayName,
  dayNumber,
  appointments = [],
  isActive = false,
}) {
  const cardClasses = `border rounded-lg p-3 h-32 flex flex-col ${
    isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
  }`;
  const dayNumberClasses = `font-bold text-lg ${
    isActive ? "text-blue-600" : "text-gray-700"
  }`;

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-gray-500">{dayName}</span>
        <span className={dayNumberClasses}>{dayNumber}</span>
      </div>
      <div className="mt-2 space-y-1 overflow-y-auto">
        {appointments.map((appt, index) => (
          <div
            key={index}
            className="text-xs text-gray-600 bg-gray-100 p-1 rounded"
          >
            {appt.time} {appt.client}
          </div>
        ))}
      </div>
    </div>
  );
}
