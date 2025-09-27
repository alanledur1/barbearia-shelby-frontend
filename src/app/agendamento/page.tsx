// src/app/agendamento/page.tsx

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

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !selectedService) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    generateTimeSlotsForDate(date, selectedService);
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };


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

            />
            <button onClick={() => setSelectedSlot(null)} className={styles.backButton}>
              Voltar para os horários
            </button>
          </div>

    </main>
  );
}