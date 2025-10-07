interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

interface Appointment {
  id: string;
  barberId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

interface BarberDashboardData {
  barber: Barber;
  appointments: Appointment[];
}

export type { Barber, Appointment, BarberDashboardData };