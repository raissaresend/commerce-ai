// src/pages/SchedulePage.jsx
import AppointmentCard from "../components/AppointmentCard";
import DayCard from "../components/DayCard"; // 👈 Importe o novo componente
import PerformanceItem from "../components/PerformanceItem"; // 👈 Importe o componente reutilizado

// Dados de exemplo para a página inteira
const todaysAppointments = [
  {
    time: "09:00",
    client: "Rex (Tutor: Maria Silva)",
    service: "Banho e Tosa",
    duration: "1h 30min",
    status: "confirmado",
  },
  {
    time: "10:30",
    client: "Pipoca (Tutor: João Santos)",
    service: "Tosa Higiênica",
    duration: "45min",
    status: "confirmado",
  },
  {
    time: "14:00",
    client: "Thor (Tutor: Ana Costa)",
    service: "Consulta Veterinária",
    duration: "2h",
    status: "pendente",
  },
  {
    time: "16:00",
    client: "Mel (Tutor: Pedro Lima)",
    service: "Vacina V10",
    duration: "1h",
    status: "confirmado",
  },
  {
    time: "17:30",
    client: "Bolinha (Tutor: Carla Mendes)",
    service: "Banho e Hidratação",
    duration: "2h",
    status: "confirmado",
  },
];

const weekAppointments = [
  { dayName: "Dom", dayNumber: 5, appointments: [] },
  {
    dayName: "Seg",
    dayNumber: 6,
    appointments: [{ time: "11:00", client: "Luna" }],
  },
  { dayName: "Ter", dayNumber: 7, appointments: [] },
  {
    dayName: "Qua",
    dayNumber: 8,
    appointments: [{ time: "15:00", client: "Simba" }],
  },
  {
    dayName: "Qui",
    dayNumber: 9,
    isActive: true,
    appointments: [
      { time: "09:00", client: "Rex" },
      { time: "10:30", client: "Pipoca" },
      { time: "14:00", client: "Thor" },
    ],
  },
  { dayName: "Sex", dayNumber: 10, appointments: [] },
  {
    dayName: "Sáb",
    dayNumber: 11,
    appointments: [
      { time: "10:00", client: "Fifi" },
      { time: "11:00", client: "Max" },
    ],
  },
];

const summaryData = [
  { label: "Total de Agendamentos", value: "28", percentage: 90 },
  { label: "Receita Projetada", value: "R$ 3.240", percentage: 75 },
  { label: "Taxa de Ocupação", value: "78%", percentage: 78 },
];

export default function SchedulePage() {
  return (
    <div>
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Agenda de Serviços
          </h2>
          <p className="text-gray-500">Gerencie seus agendamentos</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700">
          + Novo Agendamento
        </button>
      </div>

      {/* Conteúdo principal - layout de 2 colunas */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 👇 COLUNA ESQUERDA ATUALIZADA 👇 */}
        <div className="flex-grow-[3] bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Calendário Semanal</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekAppointments.map((day) => (
              <DayCard
                key={day.dayNumber}
                dayName={day.dayName}
                dayNumber={day.dayNumber}
                appointments={day.appointments}
                isActive={day.isActive}
              />
            ))}
          </div>
        </div>

        {/* Coluna Direita: Agendamentos de Hoje e Resumo */}
        <div className="flex-grow-[2] space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">
              Agendamentos de Hoje{" "}
              <span className="text-sm font-normal text-gray-500">
                {todaysAppointments.length}
              </span>
            </h3>
            <div className="space-y-4">
              {todaysAppointments.map((appt, index) => (
                <AppointmentCard
                  key={index}
                  time={appt.time}
                  client={appt.client}
                  service={appt.service}
                  duration={appt.duration}
                  status={appt.status}
                />
              ))}
            </div>
          </div>

          {/* 👇 RESUMO DA SEMANA ATUALIZADO 👇 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Resumo da Semana</h3>
            <div className="space-y-4">
              {summaryData.map((item, index) => (
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
    </div>
  );
}
