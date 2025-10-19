// src/components/ProtectedRoute/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Define as propriedades que o componente aceita
type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedUserType: 'admin' | 'client'; // Especifica qual tipo de usuário é permitido
};

export default function ProtectedRoute({ children, allowedUserType }: ProtectedRouteProps) {
  const auth = useAuth();
  const router = useRouter();
  const [isClientSide, setIsClientSide] = useState(false);

  // Garante que o código só rode no navegador
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Lógica de verificação e redirecionamento
  useEffect(() => {
    // Espera o estado de autenticação ser resolvido e o componente montar no cliente
    if (isClientSide && auth.isAuthenticated !== null) {
      // Se o usuário não estiver logado OU o tipo de usuário for diferente do permitido, redireciona
      if (!auth.isAuthenticated || auth.user?.userType !== allowedUserType) {
        router.replace('/Login');
      }
    }
  }, [isClientSide, auth.isAuthenticated, auth.user, router, allowedUserType]);

  // Enquanto verifica, mostra uma mensagem de fallback para evitar exibir conteúdo protegido
  if (!isClientSide || !auth.isAuthenticated || auth.user?.userType !== allowedUserType) {
    return <p style={{ textAlign: 'center', marginTop: '40px' }}>Verificando acesso...</p>;
  }

  // Se o usuário estiver autorizado, renderiza o conteúdo da página
  return <>{children}</>;
}