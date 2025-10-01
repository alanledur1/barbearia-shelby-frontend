'use client';

import React, { useState } from 'react';
import './CriarConta.scss';

interface CriarContaProps {
  onRegister: (name: string, email: string, password: string) => void;
}

const CriarConta: React.FC<CriarContaProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !celular || !password || !confirmPassword) {
      setError('Preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (celular.length !== 11) {
      setError('O celular deve ter 11 dígitos!');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setError('');
    onRegister(name, email, password);
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="title">Criar Conta</h2>

        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="celular">Celular</label>
          <input
            id="celular"
            type="tel" 
            pattern="[0-9]*"
            placeholder="Digite seu celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">
          Criar Conta
        </button>

        <div className="login-link">
          <p>Já tem conta? <a href="./Login">Faça login</a></p>
        </div>
      </form>
    </div>
  );
};

export default CriarConta;