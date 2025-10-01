"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import AgendamentoList from '@/components/Agendamento/AgendamentoList';
import { useAuth } from '@/context/AuthContext';

type Appointment = { id: number; cliente: string; data: string; hora?: string };

export default function MeusServicosPage() {
  const auth = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!auth.user || !auth.token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/appointments?clientId=${auth.user.clientId}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });

        setAppointments(response.data || []);
      } catch (err: unknown) {
        setError('Não foi possível carregar seus serviços.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [auth.user, auth.token]);

  if (!auth.isAuthenticated) return <p>Você precisa estar logado para ver seus serviços.</p>;

  if (loading) return <p>Carregando...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <main style={{ padding: '20px 24px', maxWidth: 980, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 18 }}>Meus Serviços</h1>
      <div style={{ marginTop: 8 }}>
        <AgendamentoList agendamentos={appointments.map(a => ({ id: a.id, cliente: a.cliente, data: a.data, hora: a.hora || '' }))} />
      </div>
    </main>
  );
}
