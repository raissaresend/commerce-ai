import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import AppointmentCard from '../components/AppointmentCard';
import Badge from '../components/Badge';
import { Package, CheckCircle, AlertTriangle, PlusCircle } from 'lucide-react';

// --- Funções Auxiliares para Formatar Data/Hora ---

// Formata apenas a Hora (ex: 09:00)
const formatTime = (isoString) => {
   if (!isoString) return '';
   try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo' // Define um fuso (ajuste se necessário)
    }).format(date);
   } catch (e) {
      console.error("Erro ao formatar hora:", isoString, e);
      return '--:--';
   }
};

// Formata apenas a Data (ex: 27/10/2025)
const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo' // Define um fuso (ajuste se necessário)
    }).format(date);
  } catch (e) {
    console.error("Erro ao formatar data:", isoString, e);
    return 'Data inválida';
  }
};

// --- Componente Principal da Página ---
export default function SchedulePage() {
  // Estado para todos os agendamentos (vindos do banco)
  const [allAppointments, setAllAppointments] = useState([]);
  // Estado para a data selecionada no calendário
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Link do Calendly
  const calendlyLink = "https://calendly.com/raissa-resende-estudante/banho-e-tosa?month=2025-10"; 

  // Busca os agendamentos da API quando a página carrega
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/agendamentos'); // Chama a API backend
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
        }
        const data = await response.json();

        // Formata os dados para exibição e filtragem
        const formattedData = data.map(appt => ({
          id: appt.id,
          time: formatTime(appt.data_agendamento),
          date: formatDate(appt.data_agendamento), // Data formatada (ex: 27/10/2025)
          client: appt.nome_cliente || 'Cliente Desconhecido',
          service: appt.nome_servico || 'Serviço Desconhecido',
          duration: appt.duracao_minutos ? `${appt.duracao_minutos} min` : '',
          status: appt.status || 'pendente'
        }));

        console.log("Agendamentos formatados recebidos:", formattedData);
        setAllAppointments(formattedData); // Salva TODOS os agendamentos no estado

      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(`Falha ao carregar agendamentos: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []); // O array vazio [] faz com que rode só uma vez

  
  // --- Lógica de Filtragem ---
  // Formata a data selecionada no calendário para o formato "dd/mm/aaaa"
  const selectedDateString = selectedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Filtra a lista principal de agendamentos para mostrar apenas os do dia selecionado
  const filteredAppointments = allAppointments.filter(
    appt => appt.date === selectedDateString
  );

  // Cria um Set (lista sem duplicatas) de todas as datas que têm agendamentos
  const datesWithAppointments = new Set(allAppointments.map(appt => appt.date));
  
  
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agenda de Serviços</h2>
          <p className="text-gray-500">Gerencie seus agendamentos</p>
        </div>
        <a href={calendlyLink} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg shadow-sm hover:from-blue-600 hover:to-green-600 text-sm font-medium"
           >
          <PlusCircle size={18} />
          Novo Agendamento
        </a>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Coluna Esquerda: Calendário */}
        <div className="flex-grow-[3] bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4 self-start">Calendário</h3>
          
          <Calendar
            onChange={setSelectedDate} // Atualiza o estado ao clicar
            value={selectedDate}      // Controla o dia selecionado
            className="react-calendar-override"
            locale="pt-BR" // Força o idioma português para os meses/dias
            
            // Função para estilizar os dias
            tileClassName={({ date, view }) => {
              // Verifica se é 'month' view (a principal)
              if (view === 'month') {
                // Converte a data do tile para o formato 'dd/mm/aaaa'
                const dateString = date.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});
                // Se a data estiver no nosso Set de datas com agendamento, aplica a classe
                if (datesWithAppointments.has(dateString)) {
                  return 'day-with-appointments';
                }
              }
              return null;
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Data selecionada: {selectedDateString}
          </p>
        </div>

        {/* Coluna Direita: Agendamentos do Dia Selecionado */}
        <div className="flex-grow-[2] space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">
              Agendamentos para {selectedDateString}
              {' '}
              <span className="text-sm font-normal text-gray-500">({filteredAppointments.length})</span>
            </h3>
            
            {/* Renderização condicional da lista */}
            {isLoading ? (
              <p className="text-gray-500">Carregando agendamentos...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : filteredAppointments.length === 0 ? (
              <p className="text-gray-500">Nenhum agendamento para esta data.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {/* Mapeia os dados FILTRADOS */}
                {filteredAppointments.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    time={appt.time}
                    client={appt.client}
                    service={appt.service}
                    duration={appt.duration}
                    status={appt.status}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}