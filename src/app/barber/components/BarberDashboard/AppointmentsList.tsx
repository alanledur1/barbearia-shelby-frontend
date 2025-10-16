'use client';

import React from 'react';
import { Appointment, Service } from '@/hooks/useBarberData';
import PaginatedAppointmentsView from './PaginatedAppointmentsView'; // Importe o novo componente

type Props = {
    appointments?: Appointment[] | null;
    services?: Service[] | null;
    viewType: 'future' | 'overdue' | 'history'; 
    updateAppointmentStatus: (id: number, status: 'COMPLETED' | 'CANCELLED') => Promise<void>;
    deleteAppointment: (id: number) => Promise<void>;
};

export default function AppointmentsList({ appointments: appointmentsProp, services: servicesProp, viewType, updateAppointmentStatus, deleteAppointment }: Props) {
    const appointments = appointmentsProp || [];
    const services = servicesProp || [];

    // Define a mensagem a ser exibida quando a lista estiver vazia
    const emptyMessages = {
        future: "Nenhum agendamento futuro.",
        overdue: "Nenhum agendamento pendente.",
        history: "Nenhum registro no histórico."
    };

    return (
        <PaginatedAppointmentsView 
            appointments={appointments}
            services={services}
            emptyMessage={emptyMessages[viewType]}
            updateAppointmentStatus={updateAppointmentStatus}
            deleteAppointment={deleteAppointment}
        />
    );
}