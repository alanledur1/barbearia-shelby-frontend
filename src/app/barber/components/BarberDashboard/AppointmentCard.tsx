'use client';

import React, { useState } from 'react';
import { Appointment, Service } from '@/hooks/useBarberData';
import styles from './styles.module.scss';
import { FaClock, FaHandScissors, FaInfoCircle } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';
import { MdDeleteForever } from "react-icons/md";

type Props = {
  appointment: Appointment;
  service?: Service;
  updateAppointmentStatus: (id: number, status: 'COMPLETED' | 'CANCELLED') => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
};



export default function AppointmentCard({ appointment, service, updateAppointmentStatus, deleteAppointment }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<'COMPLETED' | 'CANCELLED' | 'DELETE' | null>(null);


  const formatDate = (iso?: string) => {
    if (!iso) return 'Data não definida';
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  const handleOpenConfirm = (status: 'COMPLETED' | 'CANCELLED' | 'DELETE') => {
    setActionToConfirm(status);
    setIsConfirming(true);
  };

  const handleConfirmAction = async () => {
    if (!actionToConfirm) return;

    try {
      if (actionToConfirm === 'COMPLETED' || actionToConfirm === 'CANCELLED') {
        await updateAppointmentStatus(appointment.id, actionToConfirm);
      } else if (actionToConfirm === 'DELETE') {
        await deleteAppointment(appointment.id);
      }
    } catch (error) {
      console.error("Falha ao atualizar status:", error);
    } finally {
      setIsConfirming(false);
      setActionToConfirm(null);
    }
  };

  const status = appointment.status?.toUpperCase() || 'CONFIRMED';

  // Lógica de fallback para exibir os dados corretos
  const displayName = appointment.clientName || 'Cliente Convidado';
  const displayEmail = appointment.clientEmail || 'N/A';
  const displayPhone = appointment.clientPhone || 'N/B';
  const displayNotes = appointment.notes || 'N/C';

  return (
    <>
      <article className={styles.appointmentCard}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.clientInfo}>{displayName}</div>
            <small className={styles.clientContact}>
              {displayEmail} • {displayPhone} • {displayNotes}
            </small>
          </div>
          <span className={`${styles.status} ${styles[`status${status}`]}`}>
            {status}
          </span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.infoRow}>
            <FaClock />
            <strong>{formatDate(appointment.date)}</strong>
          </div>
          <div className={styles.infoRow}>
            {service ? (
              <>
                <FaHandScissors />
                <span>{service.name} ({service.duration} min) - <strong>R$ {service.price}</strong></span>
              </>
            ) : (
              <>
                <FaInfoCircle />
                <span>Serviço não encontrado</span>
              </>
            )}
          </div>
        </div>

        {status === 'CONFIRMED' && (
          <div className={styles.cardFooter}>
            <button
              className={`${styles.actionButton} ${styles.completeButton}`}
              onClick={() => handleOpenConfirm('COMPLETED')}
            >
              Concluir
            </button>
            <button
              className={`${styles.actionButton} ${styles.cancelButton}`}
              onClick={() => handleOpenConfirm('CANCELLED')}
            >
              Cancelar
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => handleOpenConfirm('DELETE')}
              title="Excluir agendamento"
            >
              <MdDeleteForever size={20} />
            </button>
          </div>
        )}
      </article>

      <ConfirmationModal
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={handleConfirmAction}
        title="Confirmar Ação"
        message={`Tem certeza que deseja ${actionToConfirm === 'DELETE' ? 'excluir este agendamento permanentemente' :
            `marcar este agendamento como "${actionToConfirm === 'COMPLETED' ? 'Concluído' : 'Cancelado'}"`
          }?`}

      />
    </>
  );
}