'use client';

import React from 'react';
import Login from '../../components/Login/login'; // caminho ajustado

const LoginPage: React.FC = () => {
  const handleLogin = (email: string, password: string) => {
    console.log('Email:', email);
    console.log('Senha:', password);
    // aqui você pode integrar com API
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginPage;
