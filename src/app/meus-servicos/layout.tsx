// src/app/barber/layout.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  // 2. Novo estado para garantir que a lógica só rode no cliente após a montagem
  const [isClient, setIsClient] = useState(false);

  // 3. Este useEffect só roda no cliente, uma vez, após a primeira renderização
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 4. Lógica de redirecionamento, agora segura
  useEffect(() => {
    // Só executa a verificação se estivermos no cliente e o auth já foi carregado
    if (isClient && auth.isAuthenticated !== null) {
      // Verifica se NAO esta autenticado OU se o tipo NAO é 'client 
      if (!auth.isAuthenticated || auth.user?.userType !== 'client') {
        router.replace('/Login'); // Redireciona se nao for um client logado
      }
    }
  }, [isClient, auth.isAuthenticated, auth.user, router]);


  // 5. Condição de renderização
  // Se ainda não estamos no cliente OU se o usuário não é um cliente autenticado,
  // renderizamos o fallback. Isso garante que o servidor e o cliente inicial renderizem a MESMA COISA.
  if (!isClient || !auth.isAuthenticated || auth.user?.userType !== 'client') {
    return <p style={{ textAlign: 'center', marginTop: '40px' }}>Verificando acesso...</p>;
  }

  // Se tudo estiver certo (no cliente, autenticado, admin), mostra a página.
  return <>{children}</>;
}