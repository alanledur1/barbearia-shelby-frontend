'use client';

import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

import AgendamentoForm from '@/components/Agendamento/AgendamentoForm';
import styles from './agendamento-moderno.module.scss';
import api from '@/services/api';
import { type BookingFormData } from '@/schemas/agendamentoSchema';

type Service = { id: number; name: string; duration: number; price: number; };
type Barber = { id: number; name: string; };
type AvailabilityEntry = {
  date: string;
  durationMinutes: number;
};
type TimeSlot = { time: string; available: boolean; };
type Step = 1 | 2 | 3 | 4 | 5;

// Gera horários de 30 em 30 min entre openTime e closeTime (ex.: "09:00"-"20:00" -> 09:00..19:30).
function generateSlotsInRange(openTime: string, closeTime: string): string[] {
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);
  const slots: string[] = [];
  let cursor = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  while (cursor + 30 <= end) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    cursor += 30;
  }
  return slots;
}

// Feriados são salvos como meia-noite UTC representando a data no calendário. Reconstrói um
// Date em meia-noite LOCAL com os mesmos componentes de ano/mês/dia, para não desalinhar em
// fusos atrás de UTC (ex.: BRT) ao comparar com datas do calendário/DayPicker (que usa local).
function holidayToLocalDate(isoDate: string): Date {
  const d = new Date(isoDate);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export default function PaginaAgendamento() {
  const auth = useAuth();
  const { subscription } = useSubscription();
  const { businessHours, holidays } = useBusinessSettings();
  const [usePlanToggle, setUsePlanToggle] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setBookedPhone] = useState<string | null>(null);

  const isStaffBooking = !!(auth.isAuthenticated && auth.user && ['barbeiro', 'dono', 'admin'].includes(auth.user.userType));

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

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await api.get<Barber[]>('/appointments/barbers');
        setBarbers(response.data);
      } catch (err) {
        setError('Não foi possível carregar os barbeiros. Tente recarregar a página.');
        console.error(err);
      }
    };
    fetchBarbers();
  }, []);

  const generateTimeSlotsForDate = async (date: Date, service: Service, barber: Barber) => {
    setIsLoading(true);
    setError(null);
    try {
      const dateString = date.toISOString().split('T')[0];
      const response = await api.get<AvailabilityEntry[]>(`/appointments/availability?date=${dateString}&adminId=${barber.id}`);
      const bookedAppointments = response.data || [];

      const day = date.getDay();
      const dayConfig = businessHours.find(d => d.dayOfWeek === day);
      const isHoliday = holidays.some(h => new Date(h.date).toISOString().split('T')[0] === dateString);

      let allSlots: string[] = [];
      if (dayConfig && !dayConfig.isClosed && !isHoliday) {
        allSlots = generateSlotsInRange(dayConfig.openTime, dayConfig.closeTime);
      }

      const bookedSlots = new Set<string>();
      bookedAppointments.forEach((app: AvailabilityEntry) => {
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
          if (!nextSlotTime || bookedSlots.has(nextSlotTime)) {
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

    if (isStaffBooking && auth.user) {
      // Staff logado agenda como si mesmo — pula a escolha manual de barbeiro.
      setSelectedBarber({ id: auth.user.id, name: auth.user.name ?? 'Você' });
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setSelectedSlot(null);
    setError(null);
    setStep(3);

    // Se o usuário já tinha escolhido uma data antes de trocar de barbeiro
    // (ex.: voltou da tela de Data & Hora), os horários precisam ser
    // recalculados para o novo barbeiro — senão ficam com dados do anterior.
    if (selectedDate && selectedService) {
      generateTimeSlotsForDate(selectedDate, selectedService, barber);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !selectedService || !selectedBarber) return;
    setSelectedDate(date);
    generateTimeSlotsForDate(date, selectedService, selectedBarber);
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
    setStep(4);
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

    const appointmentDateString = appointmentDateTime.toISOString();

    try {
      type BookingPayload = {
        serviceId: number;
        date: string;
        client?: { name: string; email: string; phone: string };
        clientId?: number;
        adminId?: number;
        notes?: string;
        usePlan?: boolean;
      };

      let appointmentPayload: BookingPayload;

      if (auth.isAuthenticated && auth.user) {
        if (isStaffBooking) {
          appointmentPayload = {
            serviceId: selectedService.id,
            date: appointmentDateString,
            adminId: selectedBarber?.id,
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
            adminId: selectedBarber?.id,
            notes: data.notes,
            ...(subscription && subscription.cutsRemaining > 0 && usePlanToggle ? { usePlan: true } : {}),
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
          adminId: selectedBarber?.id,
          notes: data.notes,
        };
      }

      console.log("📤 Enviando data:", appointmentDateString);
      await api.post('/appointments', appointmentPayload);
      setStep(5);

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
    setSelectedBarber(undefined);
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
        {step < 5 && (
          <div className={styles.stepper}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>Serviço</div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>Barbeiro</div>
            <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>Data & Hora</div>
            <div className={`${styles.step} ${step >= 4 ? styles.active : ''}`}>Seus Dados</div>
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
                <h2 className={styles.stepTitle}>2. Escolha o Barbeiro</h2>
                {error && <p style={{ color: '#f67366' }}>{error}</p>}
                {barbers.length === 0 ? (
                  <p>Nenhum barbeiro disponível no momento.</p>
                ) : (
                  <div className={styles.serviceGrid}>
                    {barbers.map(barber => (
                      <div key={barber.id} className={styles.serviceCard} onClick={() => handleBarberSelect(barber)}>
                        <h3>{barber.name}</h3>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setStep(1)} className={styles.backButton}>
                  Voltar para Serviços
                </button>
              </motion.div>
            )}

            {step === 3 && selectedService && selectedBarber && (
              <motion.div key="step3" variants={motionVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className={styles.stepTitle}>3. Escolha a Data e Hora</h2>
                <div className={styles.dateTimePicker}>
                  <div className={styles.dayPickerContainer}>
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      locale={ptBR} fromDate={new Date()}
                      disabled={[
                        { before: new Date() },
                        { dayOfWeek: businessHours.filter(d => d.isClosed).map(d => d.dayOfWeek) },
                        ...holidays.map(h => holidayToLocalDate(h.date))
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
                <button onClick={() => setStep(isStaffBooking ? 1 : 2)} className={styles.backButton}>
                  Voltar
                </button>
              </motion.div>
            )}

            {step === 4 && selectedService && selectedDate && selectedSlot && (
              <motion.div key="step4" variants={motionVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className={styles.stepTitle}>4. Confirme Seus Dados</h2>
                {error && <p style={{ color: '#f67366', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <div className={styles.summary}>
                  <p><strong>Serviço:</strong> {selectedService.name}</p>
                  {selectedBarber && <p><strong>Barbeiro:</strong> {selectedBarber.name}</p>}
                  <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')} às <strong>{selectedSlot}</strong></p>
                </div>
                {subscription && subscription.cutsRemaining > 0 && (
                  <label className={styles.planToggle}>
                    <input
                      type="checkbox"
                      checked={usePlanToggle}
                      onChange={(e) => setUsePlanToggle(e.target.checked)}
                    />
                    Usar meu plano ({subscription.cutsRemaining} corte{subscription.cutsRemaining > 1 ? 's' : ''} restante{subscription.cutsRemaining > 1 ? 's' : ''} neste ciclo)
                  </label>
                )}
                <AgendamentoForm
                  onBookingSubmitAction={handleBookingSubmit}
                  isLoading={isLoading}
                  initialValues={auth.isAuthenticated && auth.user ? {
                    cliente: auth.user.name ?? '',
                    email: auth.user.email ?? '',
                    phone: ''
                  } : undefined} serviceName={''} date={''} time={''} />
                <button onClick={() => setStep(3)} className={styles.backButton} disabled={isLoading}>
                  Voltar
                </button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                variants={motionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.successMessage}
              >
                <h2>Agendamento Confirmado!</h2>
                <p>
                  Seu horário foi reservado com sucesso.
                  Caso precise falar conosco, clique no botão abaixo.
                </p>

                <a
                  href="https://wa.me/5551998177919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryButton}
                >
                  Falar com a Barbearia no WhatsApp
                </a>

                <button
                  onClick={resetFlow}
                  className={styles.backButton}
                >
                  Novo Agendamento
                </button>
              </motion.div>
            )}


          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}