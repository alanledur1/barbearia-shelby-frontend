'use client';

import React, { useState } from 'react';
import Login from '../../components/Login/login';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const handleLogin =  async (email: string, password: string) => {
    setError('');
    try {
      const response = await api.post('/clients/login', {
        email,
        password,
      });

      // Se o login deu certo, o backend retorna um token
      const { token } = response.data;

      // Guardamos o token no localStorage para manter o usuario logado
      localStorage.setItem('authToken', token);

      // Rediriciona para a página inicial
      router.push('/');
    } catch (err: any) {
      const errorMessage = err.message?.data?.error || "Não foi possível fazer login. Tente novamente.";
      setError(errorMessage);
      console.error(err);
    }
  };

  return <Login onLogin={handleLogin} apiError={error} />;
};

export default LoginPage;
