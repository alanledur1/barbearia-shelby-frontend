'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './CriarConta.scss';

interface CriarContaProps {
  onRegister: (name: string, email: string, phone: string, password: string) => void;
  apiError?: string; // Prop opcional para erro da API
}

const CriarConta: React.FC<CriarContaProps> = ({ onRegister, apiError }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const numericPhone = phone.replace(/\D/g, '');

    if (!trimmedName || !trimmedEmail || !numericPhone || !trimmedPassword || !trimmedConfirmPassword) {
      setError('Preencha todos os campos!');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (numericPhone.length !== 11) {
      setError('O celular deve ter 11 dígitos numéricos!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (trimmedName.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setError('');
    onRegister(trimmedName, trimmedEmail, numericPhone, trimmedPassword);
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form rounded-card border border-border bg-card">
        <h2 className="title">Criar Conta</h2>
        <p className="subtitle">Leva menos de um minuto — depois é só escolher o horário.</p>
        {/* Mostra o erro da API se ele existir, senão mostra o erro local */}
        {(apiError || error) && <p className="error" aria-live="polite">{apiError || error}</p>}

        <div className="input-group">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="rounded-input"
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
            autoComplete="email"
            className="rounded-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">Celular</label>
          <input
            id="phone"
            type="tel"
            pattern="[0-9]*"
            placeholder="Digite seu celular"
            value={phone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '');
              setPhone(digitsOnly.slice(0, 11));
            }}
            inputMode="numeric"
            autoComplete="tel"
            maxLength={11}
            className="rounded-input"
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
            autoComplete="new-password"
            className="rounded-input"
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
            autoComplete="new-password"
            className="rounded-input"
          />
        </div>

        <button type="submit" className="btn rounded-button">
          Criar Conta
        </button>

        <div className="login-link">
          <p>Já tem conta? <Link href="/Login">Faça login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default CriarConta;