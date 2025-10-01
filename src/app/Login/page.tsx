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
      const response = await api.post('/clients/login', {
        email,
        password,
      });

      // Se o login deu certo, o backend retorna um token e possivelmente o usuário
      const { token, user } = response.data;

      // Usa o contexto para armazenar token/usuário
      auth.login(token, user || null);

      // Redireciona para a página inicial
      router.push('/');
    } catch (err: unknown) {
      // Para evitar uso de `any` e problemas de lint, usamos uma mensagem genérica
      setError("Não foi possível fazer login. Tente novamente.");
      console.error(err);
    }
  };

  return <Login onLogin={handleLogin} apiError={error} />;
};

export default LoginPage;
