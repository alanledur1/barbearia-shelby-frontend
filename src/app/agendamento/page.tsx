'use client';

import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

import AgendamentoForm from '@/components/Agendamento/AgendamentoForm';
import styles from './agendamento-moderno.module.scss'; // Use o novo arquivo
import api from '@/services/api';

// --- Tipos ---
type Service = { id: number; name: string; duration: number; price: number; };
type Appointment = { id: number; date: string; durationMinutes: number; };
type TimeSlot = { time: string; available: boolean; };
type Step = 1 | 2 | 3 | 4; // 1: Serviço, 2: Data/Hora, 3: Dados, 4: Sucesso

export default function PaginaAgendamento() {
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (err) {
        setError('Não foi possível carregar os serviços. Tente recarregar a página.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const generateTimeSlotsForDate = async (date: Date, service: Service) => {
    setIsLoading(true);
    setError(null);
    try {
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
        
        const isBooked = bookedAppointments.some(booked => {
          const bookedStart = new Date(booked.date);
          const bookedEnd = new Date(bookedStart.getTime() + booked.durationMinutes * 60000);
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
  
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setError(null);
    setStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !selectedService) return;
    setSelectedDate(date);
    generateTimeSlotsForDate(date, selectedService);
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
    setError(null);
    setStep(3);
  };

  const handleBookingSubmit = async (data: { cliente: string; email: string; phone: string }) => {
    if (!selectedDate || !selectedSlot || !selectedService) return;
    setIsLoading(true);
    setError(null);
    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    try {
      const clientResponse = await api.post('/clients', { name: data.cliente, email: data.email, phone: data.phone });
      await api.post('/appointments', {
        clientId: clientResponse.data.id,
        serviceId: selectedService.id,
        date: appointmentDateTime.toISOString(),
      });
      setStep(4);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ocorreu um erro ao agendar.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedService(undefined);
    setSelectedDate(undefined);
    setTimeSlots([]);
    setSelectedSlot(null);
    setError(null);
  };
  
  const motionVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.container}>
        {step < 4 && (
          <div className={styles.stepper}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>Serviço</div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>Data & Hora</div>
            <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>Seus Dados</div>
          </div>
        )}

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={motionVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className={styles.stepTitle}>1. Escolha um Serviço</h2>
                {isLoading && <p>Carregando serviços...</p>}
                {error && <p style={{ color: '#f67366' }}>{error}</p>}
                <div className={styles.serviceGrid}>
                  {services.map(service => (
                    <div key={service.id} className={styles.serviceCard} onClick={() => handleServiceSelect(service)}>
                      <h3>{service.name}</h3>
                      <p>{service.duration} min</p>
                      <p><strong>R$ {service.price.toFixed(2).replace('.', ',')}</strong></p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && selectedService && (
              <motion.div key="step2" variants={motionVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className={styles.stepTitle}>2. Escolha a Data e Hora</h2>
                <div className={styles.dateTimePicker}>
                  <div className={styles.dayPickerContainer}>
                    <DayPicker mode="single" selected={selectedDate} onSelect={handleDateSelect} locale={ptBR} fromDate={new Date()} />
                  </div>
                  <div className={styles.timeSlotsContainer}>
                    {isLoading && <p>Buscando...</p>}
                    {selectedDate && timeSlots.map((slot) => (
                      <button key={slot.time} className={styles.timeSlot} disabled={!slot.available} onClick={() => handleSlotSelect(slot.time)}>
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep(1)} className={styles.backButton}>
                  Voltar para Serviços
                </button>
              </motion.div>
            )}

            {step === 3 && selectedService && selectedDate && selectedSlot && (
              <motion.div key="step3" variants={motionVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className={styles.stepTitle}>3. Confirme Seus Dados</h2>
                <div className={styles.summary}>
                  <p><strong>Serviço:</strong> {selectedService.name}</p>
                  <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')} às <strong>{selectedSlot}</strong></p>
                </div>
                <AgendamentoForm onBookingSubmit={handleBookingSubmit} isLoading={isLoading} />
                <button onClick={() => setStep(2)} className={styles.backButton} disabled={isLoading}>
                  Voltar
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={motionVariants} initial="hidden" animate="visible" exit="exit" className={styles.successMessage}>
                <h2>Agendamento Confirmado!</h2>
                <p>Seu horário foi reservado. Um resumo foi enviado para o seu email. Nos vemos em breve!</p>
                <button onClick={resetFlow} className={styles.primaryButton}>
                  Agendar Novo Horário
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}