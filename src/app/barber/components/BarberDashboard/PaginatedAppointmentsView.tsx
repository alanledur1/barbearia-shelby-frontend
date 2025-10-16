'use client';

import React, { useState } from 'react';
import { Appointment, Service } from '@/hooks/useBarberData';
import AppointmentCard from './AppointmentCard';
import styles from './styles.module.scss';

// Função auxiliar para formatar os cabeçalhos de data
const formatDateHeader = (dateString: string) => {
    // CORREÇÃO: Analisa a string de data e cria um objeto Date no fuso horário local,
    // em vez de assumir UTC. Isso evita o deslocamento de um dia.
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    // Comparacoes
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';

// Formatação para outras datas
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' };
    if (date.getFullYear() !== today.getFullYear()) {
        options.year = 'numeric';
    }
    
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

type Props = {
    appointments: Appointment[];
    services: Service[];
    itemsPerPage?: number;
    emptyMessage: string;
    updateAppointmentStatus: (id: number, status: 'COMPLETED' | 'CANCELLED') => Promise<void>;
    deleteAppointment: (id: number) => Promise<void>;
};

export default function PaginatedAppointmentsView({ appointments, services, itemsPerPage = 5, emptyMessage, updateAppointmentStatus, deleteAppointment }: Props) {
    const [currentPage, setCurrentPage] = useState(1);

    const groupedAppointments = appointments.reduce((acc, appointment) => {
        const dateKey = new Date(appointment.date).toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(appointment);
        return acc;
    }, {} as Record<string, Appointment[]>);

    const dateGroups = Object.keys(groupedAppointments);
    const totalPages = Math.ceil(dateGroups.length / itemsPerPage);
    const currentGroups = dateGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (appointments.length === 0) {
        return <div className={styles.empty}>{emptyMessage}</div>;
    }

    return (
        <div>
            {currentGroups.map(dateKey => (
                <div key={dateKey} className={styles.dateGroup}>
                    <h3 className={styles.dateHeader}>{formatDateHeader(dateKey)}</h3>
                    <div className={styles.list}>
                        {groupedAppointments[dateKey].map(app => (
                            <AppointmentCard 
                                key={app.id} 
                                appointment={app} 
                                service={services.find(s => s.id === app.serviceId)}
                                updateAppointmentStatus={updateAppointmentStatus} 
                                deleteAppointment={deleteAppointment}   
                            />
                        ))}
                    </div>
                </div>
            ))}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Próximo</button>
                </div>
            )}
        </div>
    );
}