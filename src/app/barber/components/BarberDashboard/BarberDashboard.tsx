'use client';

import React, { useState } from 'react';
import { useBarberData, Service } from '@/hooks/useBarberData';
import BarberHeader from './BarberHeader';
import AppointmentsList from './AppointmentsList';
import styles from './styles.module.css';
import { useAuthSafe } from '@/context/AuthContext';

export default function BarberDashboard() {
  const { appointments = [], services = [], loading, error, refetch, addService, deleteService } = useBarberData();
  const auth = useAuthSafe();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [price, setPrice] = useState<number>(50);

  type BarberUser = { role?: string; isAdmin?: boolean };
  const user = auth?.user as BarberUser | undefined;
  const isAdmin = Boolean(user && (user.role === 'admin' || user.isAdmin));

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await addService({ name: name.trim(), duration, price });
      setName(''); setDuration(30); setPrice(50);
    } catch {
      // opcional: toast
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

  return (
    <section className={styles.container}>
      <BarberHeader onRefresh={refetch} appointmentsCount={appointments.length} servicesCount={services.length} />
      {loading && <div className={styles.message}>Carregando dados...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <div className={styles.content}>
          <div>
            {/* MUDANÇA: passa também services */}
            <AppointmentsList appointments={appointments} services={services} />
          </div>

          <aside className={styles.sidebar}>
            <h3>Serviços</h3>

            {isAdmin && (
              <form onSubmit={handleCreateService} style={{ marginBottom: 16 }}>
                <input required placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
                <input required type="number" min={5} placeholder="Duração (min)" value={duration} onChange={e => setDuration(Number(e.target.value))} />
                <input required type="number" min={0} step="0.01" placeholder="Preço" value={price} onChange={e => setPrice(Number(e.target.value))} />
                <button type="submit" disabled={creating}>Criar serviço</button>
              </form>
            )}

            {services.length === 0 ? <p>Nenhum serviço cadastrado.</p> : (
              <ul className={styles.serviceList}>
                {services.map((s: Service) => (
                  <li key={s.id} className={styles.serviceItem}>
                    <strong>{s.name}</strong> — {s.duration} min — R$ {s.price.toFixed(2)}
                    {isAdmin && (
                      <button style={{ marginLeft: 8 }} onClick={() => handleDeleteService(s.id)}>Excluir</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}