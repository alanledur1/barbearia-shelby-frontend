'use client';

import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

import AgendamentoForm from '@/components/Agendamento/AgendamentoForm';
import styles from './agendamento-moderno.module.scss';
import api from '@/services/api';
import { type BookingFormData } from '@/schemas/agendamentoSchema';

type Service = { id: number; name: string; duration: number; price: number; };
type Appointment = {
  id: number;
  date: string;
  durationMinutes: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
};
type TimeSlot = { time: string; available: boolean; };
type Step = 1 | 2 | 3 | 4;

export default function PaginaAgendamento() {
  const auth = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedPhone, setBookedPhone] = useState<string | null>(null);

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
      // CORREÇÃO: Tipar 'app' como Appointment ou um tipo mais específico se necessário
      const bookedAppointments = (response.data || []).filter((app: Appointment) => app.status === 'CONFIRMED');

      const allSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30'
      ];

      const bookedSlots = new Set<string>();
      // CORREÇÃO: Tipar 'app' como Appointment ou um tipo mais específico
      bookedAppointments.forEach((app: Appointment) => {
        const startTime = new Date(app.date);
        const startSlot = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`;
        bookedSlots.add(startSlot);

        if (app.durationMinutes >= 60) {
          const nextTime = new Date(startTime.getTime() + 30 * 60000);
          const nextSlot = `${String(nextTime.getHours()).padStart(2, '0')}:${String(nextTime.getMinutes()).padStart(2, '0')}`;
          bookedSlots.add(nextSlot);
        }
      });

      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      const slotsWithAvailability = allSlots.map((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        const slotDate = new Date(date);
        slotDate.setHours(hours, minutes, 0, 0);

        if (isToday && slotDate < now) {
          return { time, available: false };
        }

        if (bookedSlots.has(time)) {
          return { time, available: false };
        }

        if (service.duration >= 60) {
          const nextSlotTime = allSlots[index + 1];
          if (!nextSlotTime || nextSlotTime === '12:30' || nextSlotTime === '13:00' || nextSlotTime === '13:30' || nextSlotTime === '20:00') {
            return { time, available: false };
          }
          if (bookedSlots.has(nextSlotTime)) {
            return { time, available: false };
          }
        }

        return { time, available: true };
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
    if (!selectedService) return;

    if (selectedService.duration === 60) {
      const index = timeSlots.findIndex(slot => slot.time === time);
      const nextSlot = timeSlots[index + 1];

      if (nextSlot && !nextSlot.available) {
        setError(`Esse horário exige 1h, mas ${nextSlot.time} já está ocupado.`);
        return;
      }
    }

    setSelectedSlot(time);
    setError(null);
    setStep(3);
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedSlot || !selectedService) return;

    setBookedPhone(data.phone);

    setIsLoading(true);
    setError(null);

    const [hours, minutes] = selectedSlot.split(':').map(Number);

    // ✅ Cria o objeto Date primeiro
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    // ✅ Depois formata para string local (sem UTC)
    const appointmentDateString = format(appointmentDateTime, "yyyy-MM-dd'T'HH:mm:ss");

    try {
      type BookingPayload = {
        serviceId: number;
        date: string;
        client?: { name: string; email: string; phone: string };
        clientId?: number;
        adminId?: number;
        notes?: string;
      };

      let appointmentPayload: BookingPayload;

      if (auth.isAuthenticated && auth.user) {
        if (auth.user.userType === 'admin') {
          appointmentPayload = {
            serviceId: selectedService.id,
            date: appointmentDateString,
            adminId: auth.user.id,
            client: {
              name: data.cliente,
              email: data.email,
              phone: data.phone,
            },
            notes: data.notes,
          };
        } else {
          appointmentPayload = {
            serviceId: selectedService.id,
            date: appointmentDateString,
            clientId: auth.user.id,
            notes: data.notes,
          };
        }
      } else {
        appointmentPayload = {
          serviceId: selectedService.id,
          date: appointmentDateString,
          client: {
            name: data.cliente,
            email: data.email,
            phone: data.phone,
          },
          notes: data.notes,
        };
      }

      console.log("📤 Enviando data:", appointmentDateString);
      await api.post('/appointments', appointmentPayload);
      setStep(4);

    } catch (err: unknown) {
      console.error('Erro ao criar agendamento:', err);
      if (typeof err === 'object' && err !== null) {
        const maybeErr = err as { response?: { data?: { error?: string } }; message?: string };
        const serverMessage = maybeErr.response?.data?.error || maybeErr.message || 'Ocorreu um erro ao agendar.';
        setError(serverMessage);
      } else {
        setError('Ocorreu um erro ao agendar.');
      }
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
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      locale={ptBR} fromDate={new Date()}
                      disabled={[
                        { before: new Date() },
                        { dayOfWeek: [0, 1] }
                      ]}
                    />
                  </div>
                  <div className={styles.timeSlotsContainer}>
                    {isLoading && <p>Buscando...</p>}
                    {selectedDate && timeSlots.map((slot) => (
                      <button key={slot.time} className={`${styles.timeSlot} ${selectedSlot === slot.time ? styles.timeSlotSelected : ''
                        }`} disabled={!slot.available} onClick={() => handleSlotSelect(slot.time)}>
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
                {error && <p style={{ color: '#f67366', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <div className={styles.summary}>
                  <p><strong>Serviço:</strong> {selectedService.name}</p>
                  <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')} às <strong>{selectedSlot}</strong></p>
                </div>
                <AgendamentoForm
                  onBookingSubmitAction={handleBookingSubmit}
                  isLoading={isLoading}
                  initialValues={auth.isAuthenticated && auth.user ? {
                    cliente: auth.user.name ?? '',
                    email: auth.user.email ?? '',
                    phone: '' // Telefone pode não estar no user, mantenha vazio ou pegue de outro lugar
                  } : undefined}
                />
                <button onClick={() => setStep(2)} className={styles.backButton} disabled={isLoading}>
                  Voltar
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={motionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.successMessage}
              >
                <h2>Agendamento Confirmado!</h2>
                <p>Seu horário foi reservado. Um resumo foi enviado para o seu whatsapp. Nos vemos em breve!</p>

                {/* ✅ botão para novo agendamento */}
                <button
                  onClick={() => {
                    // Verifica se temos o telefone
                    if (bookedPhone) {
                      const message = `Olá! Seu horário foi agendado com sucesso para ${selectedDate?.toLocaleDateString('pt-BR')} às ${selectedSlot}. 💈`;
                      const whatsappUrl = `https://wa.me/55${bookedPhone}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    } else {
                      alert("Não foi possível encontrar o número de telefone deste agendamento.");
                    }

                    // Reseta o fluxo
                    resetFlow();
                  }}
                  className={styles.primaryButton}
                >
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