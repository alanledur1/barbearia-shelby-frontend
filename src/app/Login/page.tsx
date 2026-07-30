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
      const { token, userType, user } = response.data;

      // 3. Crie o objeto de usuário final, adicionando o userType
      const userData = { ...user, userType };

      // Usa o contexto para armazenar token/usuário
      auth.login(token, userData || null);

      // 4. Redireciona com base no tipo de usuário
      if (userType === 'cliente') {
        router.push('/');
      } else {
        router.push('/barber');
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
