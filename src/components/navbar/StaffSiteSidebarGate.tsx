'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthSafe } from '@/context/AuthContext';
import Sidebar from '@/app/barber/components/BarberDashboard/Sidebar';

// Staff (barbeiro/dono/admin) que sai da dashboard pelo ícone "Site" da Sidebar continua vendo
// a Sidebar na landing page "/" — só o Navbar volta a aparecer junto (ver Navbar.tsx). Visitante
// e cliente nunca passam por aqui: renderiza null pra eles, "/" fica exatamente como sempre foi.
export function StaffSiteSidebarGate() {
  const pathname = usePathname();
  const auth = useAuthSafe();
  const [isMounted, setIsMounted] = useState(false);

  // Evita mismatch de hidratação: AuthContext lê o usuário do localStorage de forma síncrona,
  // então já vem preenchido no primeiro render do client, mas no server é sempre null.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = auth?.user;
  const isStaff = Boolean(user && ['barbeiro', 'dono', 'admin'].includes(user.userType));

  if (!isMounted || pathname !== '/' || !isStaff) return null;

  return <Sidebar />;
}
