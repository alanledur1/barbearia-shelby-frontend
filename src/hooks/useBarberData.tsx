import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type Appointment = {
    id: number;
    date: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    serviceId?: number;
    status?: 'pending' | 'completed' | 'cancelled';
};

export type Service = { id: number; name: string; duration: number; price: number; };

export function useBarberData() {
    const auth = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const headers = auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined;
            const [aRes, sRes] = await Promise.all([
                api.get('/appointments', { headers }),
                api.get('/services', { headers }),
            ]);
            setAppointments(aRes?.data ?? []);
            setServices(sRes?.data ?? []);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [auth?.token]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return { appointments, services, loading, error, refetch: fetchAll, setAppointments };
}