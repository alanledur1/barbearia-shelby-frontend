'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBarberData, Service } from '@/hooks/useBarberData';
import AppointmentsList from './AppointmentsList';
import styles from './styles.module.scss';
import EditServiceModal from './EditServiceModel';
import ConfirmationModal from './ConfirmationModal';

export default function BarberDashboard() {
  const { 
    appointments = [], 
    services = [], 
    loading, 
    error, 
    setError, 
    refetch, 
    addService, 
    deleteService,
    updateService, 
    updateAppointmentStatus, 
    deleteAppointment 
  } = useBarberData();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [price, setPrice] = useState<number>(50);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filter, setFilter] = useState<'future' | 'overdue' | 'history'>('future');

    // 2. Crie estados para controlar o modal de exclusão de serviço
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<number | null>(null); // Armazena o ID do serviço a ser deletado

  // Memoiza as listas para otimização de performance
  const { futureAppointments, overdueAppointments, historyAppointments } = useMemo(() => {
    const now = new Date();
    const confirmed = appointments.filter(a => a.status === 'CONFIRMED');

    const future = confirmed
      .filter(a => new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const overdue = confirmed
      .filter(a => new Date(a.date) < now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Mais antigo primeiro

    const history = appointments
      .filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Mais recente primeiro

    return { futureAppointments: future, overdueAppointments: overdue, historyAppointments: history };
  }, [appointments]);

  // Escolhe qual lista exibir com base no filtro ativo
  const displayedAppointments = useMemo(() => {
    if (filter === 'overdue') return overdueAppointments;
    if (filter === 'history') return historyAppointments;
    return futureAppointments;
  }, [filter, futureAppointments, overdueAppointments, historyAppointments]);
  // --- FIM DA LÓGICA DE FILTROS ---

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await addService({ name: name.trim(), duration, price });
      setName(''); setDuration(30); setPrice(50);
    } catch {
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    setIsConfirmingDelete(id);
  };

  const handleConfirmDeleteService = async () => {
    if (isConfirmingDelete === null) return;
    try {
      await deleteService(isConfirmingDelete);
    } catch {

    } finally {
      setIsConfirmingDelete(null);
    }
  }

  const handleUpdateService = async (id: number, data: { name: string; duration: number; price: number }) => {
    await updateService(id, data);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <section className={styles.container}>
      {error && (
        <div className={`${styles.toast} ${styles.toastError}`}>
          {error}
        </div>
      )}
      <header className={styles.header}>
        <div>
          <h1>
            Dashboard do Barbeiro
            {overdueAppointments.length > 0 && (
              <button
                className={`${styles.overdueBadge} ${filter === 'overdue' ? styles.active : ''}`}
                title={`Atenção: ${overdueAppointments.length} agendamento(s) passado(s) pendente(s). Clique para ver.`}
                onClick={() => setFilter(prev => prev === 'future' ? 'overdue' : 'future')}
              >
                {overdueAppointments.length}
              </button>
            )}
          </h1>
          <p>{futureAppointments.length} agendamento(s) futuros • {services.length} serviço(s)</p>
        </div>
        <div>
          <button className={styles.refreshButton} onClick={refetch}>Recarregar</button>
        </div>
      </header>

      {loading && <div className={styles.message}>Carregando dados...</div>}

      {!loading && (
        <div className={styles.content}>
          {/* PAINEL DE CONTROLE DAS VISUALIZAÇÕES */}
          {filter === 'overdue' ? (
            <div className={styles.filterActive}>
              <p>Atenção: Mostrando {overdueAppointments.length} agendamento(s) pendente(s).</p>
              <button onClick={() => setFilter('future')}>Ver Próximos</button>
            </div>
          ) : (
            <div className={styles.viewControls}>
              <button onClick={() => setFilter('future')} className={filter === 'future' ? styles.active : ''}>
                Próximos Agendamentos
              </button>
              <button onClick={() => setFilter('history')} className={filter === 'history' ? styles.active : ''}>
                Histórico
              </button>
            </div>
          )}

          <AppointmentsList 
            appointments={displayedAppointments} 
            services={services} 
            viewType={filter}  
            updateAppointmentStatus={updateAppointmentStatus} 
            deleteAppointment={deleteAppointment}
          />

          <aside className={styles.sidebar}>
            <h3>Serviços</h3>
            <form onSubmit={handleCreateService} className={styles.addServiceForm}>
              <input
                type='text'
                placeholder='Nome do serviço'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type='number'
                placeholder='Preço'
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
              <select
                className={styles.durationSelect}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
              <button type="submit" className={styles.addButton} disabled={creating}>
                <span className={styles.buttonText}>{creating ? '...' : 'Adicionar'}</span>
                <span className={styles.buttonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className={styles.svg}>
                    <line y2="19" y1="5" x2="12" x1="12"></line>
                    <line y2="12" y1="12" x2="19" x1="5"></line>
                  </svg>
                </span>
              </button>
            </form>
            <ul className={styles.serviceList}>
              {services.map((s: Service) => (
                <li key={s.id} className={styles.serviceItem}>
                  <span>
                    <strong>{s.name}</strong> — {s.duration} min — R$ {s.price.toFixed(2)}
                  </span>
                  <div className={styles.serviceActions}>
                    <button onClick={() => setEditingService(s)} className={styles.editButton}>Editar</button>
                    <button onClick={() => handleDeleteService(s.id)} className={styles.deleteButton}>Excluir</button>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {editingService && (
            <EditServiceModal
              service={editingService}
              onClose={() => setEditingService(null)}
              onSubmit={handleUpdateService}
            />
          )}

          <ConfirmationModal 
            isOpen={isConfirmingDelete !== null}
            onClose={() => setIsConfirmingDelete(null)}
            onConfirm={handleConfirmDeleteService}
            title="Confirmar Exclusão"
            message="Tem certeza que deseja este serviço? Esta ação não pode ser desfeita."
          />
        </div>
      )}
    </section>
  );
}