'use client'; // Este componente precisa ser 'use client' por causa dos hooks

import React, { useState, useMemo } from 'react'; // 1. Importe useState e useMemo
import { useClientData } from '@/hooks/useClientData';
import styles from './ClientDashboard.module.scss';
import ClientAppointmentCard from './ClientAppointmentCard';
import MySubscription from './MySubscription';

export default function ClientDashboard() { // Renomeie a função se necessário
  const { appointments, services, loading, error, cancelAppointment } = useClientData();

  // 2. Defina quantos itens por página
  const itemsPerPage = 5;

  // 3. Crie estados separados para a página atual de cada seção
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);

  // 4. Use useMemo para calcular as listas filtradas (como já estava)
  const upcomingAppointments = useMemo(() =>
    appointments.filter(a => a.status === 'CONFIRMED')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), // Ordena por data mais próxima
    [appointments]
  );

  const historyAppointments = useMemo(() =>
    appointments.filter(a => a.status !== 'CONFIRMED')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // Ordena por data mais recente
    [appointments]
  );

  // 5. Calcule o total de páginas e os itens da página atual para CADA seção
  const upcomingTotalPages = Math.ceil(upcomingAppointments.length / itemsPerPage);
  const currentUpcomingAppointments = upcomingAppointments.slice(
    (upcomingCurrentPage - 1) * itemsPerPage,
    upcomingCurrentPage * itemsPerPage
  );

  const historyTotalPages = Math.ceil(historyAppointments.length / itemsPerPage);
  const currentHistoryAppointments = historyAppointments.slice(
    (historyCurrentPage - 1) * itemsPerPage,
    historyCurrentPage * itemsPerPage
  );

  if (loading) {
    return <div className={styles.container}><p>Carregando seus agendamentos...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  // O JSX que estava na página agora fica aqui
  return (
    <div className={styles.container}>
      <h1>Meus Agendamentos</h1>

      <MySubscription />

      <section className={styles.section}>
        <h2>Próximos Agendamentos</h2>
        {currentUpcomingAppointments.length > 0 ? (
          // 6. Mapeie sobre os itens da PÁGINA ATUAL
          currentUpcomingAppointments.map(app => (
            <ClientAppointmentCard
              key={app.id}
              appointment={app}
              service={services.find(s => s.id === app.serviceId)}
              onCancel={cancelAppointment}
            />
          ))
        ) : (
          <p>Você não tem nenhum horário agendado.</p>
        )}
        {/* 7. Adicione os controles de paginação para "Próximos" */}
        {upcomingTotalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => setUpcomingCurrentPage(p => p - 1)} disabled={upcomingCurrentPage === 1}>Anterior</button>
            <span>Página {upcomingCurrentPage} de {upcomingTotalPages}</span>
            <button onClick={() => setUpcomingCurrentPage(p => p + 1)} disabled={upcomingCurrentPage === upcomingTotalPages}>Próximo</button>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Histórico</h2>
        {currentHistoryAppointments.length > 0 ? (
          // 8. Mapeie sobre os itens da PÁGINA ATUAL do histórico
          currentHistoryAppointments.map(app => (
            <ClientAppointmentCard
              key={app.id}
              appointment={app}
              service={services.find(s => s.id === app.serviceId)}
              onCancel={cancelAppointment}
            />
          ))
        ) : (
          <p>Seu histórico está vazio.</p>
        )}
        {/* 9. Adicione os controles de paginação para "Histórico" */}
        {historyTotalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => setHistoryCurrentPage(p => p - 1)} disabled={historyCurrentPage === 1}>Anterior</button>
            <span>Página {historyCurrentPage} de {historyTotalPages}</span>
            <button onClick={() => setHistoryCurrentPage(p => p + 1)} disabled={historyCurrentPage === historyTotalPages}>Próximo</button>
          </div>
        )}
      </section>
    </div>
  );
}