'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type AgendaBarber = { id: number; name: string };

export type AgendaBusinessHoursDay = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type AgendaHoliday = { id: number; date: string; reason?: string | null };

export type AgendaAppointment = {
  id: number;
  date: string;
  endDate: string;
  durationMinutes: number;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  client?: { id: number; name: string; email?: string | null; phone?: string | null } | null;
  service?: { id: number; name: string; duration: number; price: number } | null;
  admin?: { id: number; name: string; email?: string | null } | null;
};

const DEFAULT_BUSINESS_HOURS: AgendaBusinessHoursDay[] = Array.from({ length: 7 }, (_, dayOfWeek) => ({
  dayOfWeek,
  openTime: '09:00',
  closeTime: '20:00',
  isClosed: false,
}));

function extractErrorMessage(err: unknown, fallback: string) {
  if (typeof err === 'object' && err !== null) {
    const maybeErr = err as { response?: { data?: { error?: string } }; message?: string };
    return maybeErr.response?.data?.error || maybeErr.message || fallback;
  }
  return fallback;
}

export function useDailyAgenda(dateKey: string) {
  const auth = useAuth();
  const [barbers, setBarbers] = useState<AgendaBarber[]>([]);
  const [businessHours, setBusinessHours] = useState<AgendaBusinessHoursDay[]>(DEFAULT_BUSINESS_HOURS);
  const [holidays, setHolidays] = useState<AgendaHoliday[]>([]);
  const [appointments, setAppointments] = useState<AgendaAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined;
  }, [auth?.token]);

  // Barbeiros, horário de funcionamento e feriados mudam raramente — busca uma vez por sessão.
  useEffect(() => {
    const fetchStatic = async () => {
      try {
        const headers = getHeaders();
        const [barbersRes, hoursRes, holidaysRes] = await Promise.all([
          api.get<AgendaBarber[]>('/appointments/barbers'),
          api.get<AgendaBusinessHoursDay[]>('/business-hours', { headers }),
          api.get<AgendaHoliday[]>('/holidays', { headers }),
        ]);
        setBarbers(barbersRes.data);
        const byDay = new Map(hoursRes.data.map((d) => [d.dayOfWeek, d]));
        setBusinessHours(DEFAULT_BUSINESS_HOURS.map((d) => byDay.get(d.dayOfWeek) ?? d));
        setHolidays(holidaysRes.data);
      } catch (err) {
        setError(extractErrorMessage(err, 'Erro ao carregar configurações da agenda.'));
      }
    };
    fetchStatic();
  }, [getHeaders]);

  // Agendamentos do dia selecionado — refaz a cada troca de data.
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const res = await api.get<AgendaAppointment[]>(`/appointments?date=${dateKey}`, { headers });
      setAppointments(res.data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao carregar agendamentos do dia.'));
    } finally {
      setLoading(false);
    }
  }, [dateKey, getHeaders]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { barbers, businessHours, holidays, appointments, loading, error, refetch: fetchAppointments };
}
