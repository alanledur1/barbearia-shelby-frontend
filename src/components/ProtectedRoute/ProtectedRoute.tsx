// src/components/ProtectedRoute/ProtectedRoute.tsx
'use client';

import { useAuth, UserType } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Define as propriedades que o componente aceita
type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedUserType: UserType | UserType[]; // Um papel ou uma lista de papéis permitidos
};

export default function ProtectedRoute({ children, allowedUserType }: ProtectedRouteProps) {
  const auth = useAuth();
  const router = useRouter();
  const [isClientSide, setIsClientSide] = useState(false);

  const allowedTypes = Array.isArray(allowedUserType) ? allowedUserType : [allowedUserType];
  const isAuthorized = !!auth.user && allowedTypes.includes(auth.user.userType);

  // Garante que o código só rode no navegador
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Lógica de verificação e redirecionamento
  useEffect(() => {
    // Espera o estado de autenticação ser resolvido e o componente montar no cliente
    if (isClientSide && auth.isAuthenticated !== null) {
      // Se o usuário não estiver logado OU o tipo de usuário não estiver na lista permitida, redireciona
      if (!auth.isAuthenticated || !isAuthorized) {
        router.replace('/Login');
      }
    }
  }, [isClientSide, auth.isAuthenticated, isAuthorized, router]);

  // Enquanto verifica, mostra uma mensagem de fallback para evitar exibir conteúdo protegido
  if (!isClientSide || !auth.isAuthenticated || !isAuthorized) {
    return <p style={{ textAlign: 'center', marginTop: '40px' }}>Verificando acesso...</p>;
  }

  // Se o usuário estiver autorizado, renderiza o conteúdo da página
  return <>{children}</>;
}
