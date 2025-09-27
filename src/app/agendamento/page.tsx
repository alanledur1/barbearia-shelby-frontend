'use client';

import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';
import AgendamentoForm from '@/components/Agendamento/AgendamentoForm';
import styles from './agendamento.module.css';
import api from '@/services/api';

// --- Tipos para os dados que virão da API ---
type Service = {
  id: number;
  name: string;
  duration: number;
};

type Appointment = {
  id: number;
  date: string; // Formato ISO (ex: "2025-07-10T10:00:00.000Z")
  durationMinutes: number;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

// Adicionamos este novo tipo para o status do agendamento
type BookingStatus = 'IDLE' | 'SUCCESS' | 'ERROR';


export default function PaginaAgendamento() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Estado para controlar a tela de sucesso
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('IDLE');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (err) {
        setError('Não foi possível carregar os serviços.');
        console.error(err); // Alterado para logar o erro real
      }
    };
    fetchServices();
  }, []);

  const generateTimeSlotsForDate = async (date: Date, service: Service) => {
    setIsLoading(true);
    setError(null);
    try {
      // CORREÇÃO: Usar [0] para pegar apenas a data "AAAA-MM-DD"
      const dateString = date.toISOString().split('T')[0];
      const response = await api.get<Appointment[]>(`/appointments?date=${dateString}`);
      const bookedAppointments = response.data;

      const allSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
      ];
      
      const slotsWithAvailability = allSlots.map(slot => {
        const slotStart = new Date(`${dateString}T${slot}:00.000-03:00`);
        const slotEnd = new Date(slotStart.getTime() + service.duration * 60000);
        
        // CORREÇÃO: Lógica completa para verificar sobreposição de horários
        const isBooked = bookedAppointments.some(booked => {
          const bookedStart = new Date(booked.date);
          const bookedEnd = new Date(bookedStart.getTime() + booked.durationMinutes * 60000);
          // Verifica se o slot desejado cruza com algum agendamento existente
          return slotStart < bookedEnd && slotEnd > bookedStart;
        });

        return { time: slot, available: !isBooked };
      });

      setTimeSlots(slotsWithAvailability);
    } catch (err) {
      setError('Não foi possível verificar os horários.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === parseInt(serviceId));
    setSelectedService(service);
    setSelectedDate(undefined);
    setTimeSlots([]);
    setSelectedSlot(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !selectedService) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    generateTimeSlotsForDate(date, selectedService);
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };

  const handleBookingSubmit = async (data: { cliente: string; email: string; phone: string }) => {
    if (!selectedDate || !selectedSlot || !selectedService) return;

    setIsLoading(true);
    setError(null);

    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    try {
      const clientResponse = await api.post('/clients', {
        name: data.cliente,
        email: data.email,
        phone: data.phone,
      });
      const clientId = clientResponse.data.id;

      await api.post('/appointments', {
        clientId: clientId,
        serviceId: selectedService.id,
        date: appointmentDateTime.toISOString(),
      });
      
      // CORREÇÃO: Corrigido o typo de "setBookigStatus" para "setBookingStatus"
      setBookingStatus('SUCCESS');

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ocorreu um erro ao agendar.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Se o agendamento foi um sucesso, mostra uma mensagem de confirmação
  if (bookingStatus === 'SUCCESS') {
    return (
      <main className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#4CAF50' }}>Agendamento Confirmado!</h1>
          <p>Seu horário foi reservado com sucesso. Obrigado!</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
            Fazer Novo Agendamento
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.titulo}>Agende seu Horário</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      {!selectedService ? (
        // Etapa 1: Selecionar Serviço
        <div>
          <h2>1. Escolha um Serviço</h2>
          <select onChange={(e) => handleServiceSelect(e.target.value)} defaultValue="">
            <option value="" disabled>Selecione o serviço</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>
      ) : !selectedSlot ? (
        // Etapa 2 e 3: Selecionar Data e Hora
        <>
          <div className={styles.calendarContainer}>
            <h2>{selectedDate ? '3. Escolha um horário' : '2. Escolha um dia'}</h2>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ptBR}
              fromDate={new Date()}
            />
          </div>

          {isLoading && <p>Verificando horários...</p>}
          {selectedDate && !isLoading && (
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
        // Etapa 4: Confirmação e Formulário
        <div className={styles.confirmationSection}>
           <h2>4. Confirme seus dados</h2>
           <p>Serviço: <strong>{selectedService?.name}</strong></p>
           <p>Data: <strong>{selectedDate?.toLocaleDateString('pt-BR')}</strong> às <strong>{selectedSlot}</strong>.</p>
           <AgendamentoForm onBookingSubmit={handleBookingSubmit} isLoading={isLoading} />
           <button onClick={() => setSelectedSlot(null)} className={styles.backButton}>
             Voltar para os horários
           </button>
        </div>
      )}
    </main>
  );
}