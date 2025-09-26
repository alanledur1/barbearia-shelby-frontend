// src/app/agendamento/page.tsx
'use client';

import React, { useState } from 'react';

// Importações do Calendário
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale'; // Para traduzir o calendário

import AgendamentoForm from '@/components/Agendamento/AgendamentoForm';
import styles from './agendamento.module.css';

// Novo tipo para os horários
type TimeSlot = {
  time: string;
  available: boolean;
};

// SIMULAÇÃO: Lista de horários já agendados que viria do seu banco de dados
const bookedAppointments = [
  { date: '2025-07-10', time: '10:00' },
  { date: '2025-07-10', time: '14:00' },
  { date: '2025-07-11', time: '11:00' },
];

export default function PaginaAgendamento() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Função que gera os horários para um dia específico
  const generateTimeSlotsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // Formato AAAA-MM-DD
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00'
    ];

    const slotsWithAvailability = allSlots.map(slot => {
      const isBooked = bookedAppointments.some(
        booked => booked.date === dateString && booked.time === slot
      );
      return { time: slot, available: !isBooked };
    });

    setTimeSlots(slotsWithAvailability);
  };

  // Função chamada quando o usuário seleciona uma data no calendário
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedSlot(null); // Reseta a seleção de horário ao trocar de data
    generateTimeSlotsForDate(date);
  };

  // Função chamada quando o usuário clica em um horário
  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };

  // Função final para submeter o agendamento
  const handleBookingSubmit = (data: { cliente: string }) => {
    if (!selectedDate || !selectedSlot) return;

    const newBooking = {
      cliente: data.cliente,
      data: selectedDate.toISOString().split('T')[0],
      hora: selectedSlot
    };

    console.log("NOVO AGENDAMENTO:", newBooking);
    alert(`Horário agendado com sucesso para ${data.cliente} no dia ${newBooking.data} às ${newBooking.hora}!`);

    // Resetar o fluxo
    setSelectedDate(undefined);
    setTimeSlots([]);
    setSelectedSlot(null);
  };

  return (
    <main className={styles.pageBackground}>
      <div className={styles.container}>
        <h1 className={styles.titulo}>Agende seu Horário</h1>

        {!selectedSlot ? (
          <>
            {/* Parte 1: Calendário */}
            <div className={styles.calendarContainer}>
              <h2>{selectedDate ? '2. Escolha um horário' : '1. Escolha um dia'}</h2>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={ptBR}
                fromDate={new Date()} // Impede seleção de dias passados
                styles={{
                  head_cell: { width: '40px' },
                  caption_label: { fontSize: '1.2rem' }
                }}
              />
            </div>

            {/* Parte 2: Cards de Horário */}
            {selectedDate && (
              <div className={styles.timeSlotsContainer}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    className={`${styles.timeCard} ${slot.available ? styles.available : styles.unavailable}`}
                    disabled={!slot.available}
                    onClick={() => handleSlotSelect(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Parte 3: Formulário de Confirmação */
          <div className={styles.confirmationSection}>
            <h2>3. Confirme seus dados</h2>
            <p>Você selecionou o dia <strong>{selectedDate?.toLocaleDateString('pt-BR')}</strong> às <strong>{selectedSlot}</strong>.</p><br></br>
            <AgendamentoForm
              // Modificamos o onSubmit para se adequar ao novo fluxo
              onBookingSubmit={handleBookingSubmit}
            />
            <button onClick={() => setSelectedSlot(null)} className={styles.backButton}>
              Voltar para os horários
            </button>
          </div>
        )}
      </div>
    </main>
  );
}