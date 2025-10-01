'use client';

import React, { useState } from 'react';
import CriarConta from '../../components/CriarConta/CriarConta';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const CriarContaPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (name: string, email: string, phone: string, password: string) => {
    setError('');
    console.log("Enviando:", { name, email, phone, password });
    try {
      await api.post('/clients/signup', {
        name,
        email,
        phone,
        password,
      });

      // Se o cadastro der certo, redireciona para a pagina de login
      router.push('/Login');
    } catch (err: any) {
      const errorMessage = err.message?.data?.error || "Não foi possível criar a conta. Tente novamente.";
      setError(errorMessage);
      console.error(err);
    }
  };


  return <CriarConta onRegister={handleRegister} apiError={error} />;
};

export default CriarContaPage;
