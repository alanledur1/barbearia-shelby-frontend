'use client';

import React, { useState } from 'react';
import Login from '../../components/Login/login';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const auth = useAuth();
  
  const handleLogin =  async (email: string, password: string) => {
    setError('');
    try {
      // 1. A chamada para a API unificada
      const response = await api.post('/login', {
        email,
        password,
      });

      // 2. Desestruture a resposta da API
      const { token, userType, admin, client } = response.data;

      // 3. Determine os dados base do usuário
      const baseUser = userType === 'admin' ? admin : client;
      // 4. Crie o objeto de usuário final, adicionando o userType
      const userData = { ...baseUser, userType };
    

      // Usa o contexto para armazenar token/usuário
      auth.login(token, userData || null);

      // 6. Redireciona com base no tipo de usuário
      if (userType === 'admin') {
        router.push('/barber');
      } else {
        router.push('/')
      }

    } catch (err: unknown) {
      // Para evitar uso de `any` e problemas de lint, usamos uma mensagem genérica
      setError("Email ou senha inválidos. Tente novamente.");
      console.error(err);
    }
  };

  return <Login onLogin={handleLogin} apiError={error} />;
};

export default LoginPage;
