'use client';

import React, { useState, useEffect } from 'react';
import { useBarberData, Service } from '@/hooks/useBarberData';
import BarberHeader from './BarberHeader';
import AppointmentsList from './AppointmentsList';
import styles from './styles.module.scss';
import EditServiceModal from './EditServiceModel';

export default function BarberDashboard() {
  const { appointments = [], services = [], loading, error, setError, refetch, addService, deleteService, updateService } = useBarberData();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [price, setPrice] = useState<number>(50);
  const [editingService, setEditingService] = useState<Service | null>(null);

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
    if (!confirm('Excluir serviço?')) return;
    try {
      await deleteService(id);
    } catch {
      // opcional: toast
    }
  };

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
      <BarberHeader onRefresh={refetch} appointmentsCount={appointments.length} servicesCount={services.length} />
      {loading && <div className={styles.message}>Carregando dados...</div>}
      {!loading && (
        <div className={styles.content}>
          <AppointmentsList appointments={appointments} services={services} />

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
        </div>
      )}
    </section>
  );
}