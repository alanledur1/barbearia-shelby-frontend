// src/app/barber/layout.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// Este componente de layout irá proteger todas as páginas dentro de /barber
export default function BarberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Espera o contexto de autenticação carregar para evitar redirecionamentos indevidos
    if (auth.isAuthenticated === null) {
      return; // Ainda carregando...
    }

    // Se o usuário NÃO estiver autenticado OU NÃO for um admin, redireciona para o login
    if (!auth.isAuthenticated || auth.user?.userType !== 'admin') {
      router.replace('/Login');
    }
  }, [auth.isAuthenticated, auth.user, router]);

  // Se o usuário for um admin autenticado, mostra o conteúdo da página (o children)
  if (auth.isAuthenticated && auth.user?.userType === 'admin') {
    return <>{children}</>;
  }

  // Enquanto a verificação acontece, você pode mostrar uma mensagem ou um spinner de carregamento
  return <p style={{ textAlign: 'center', marginTop: '40px' }}>Verificando acesso...</p>;
}