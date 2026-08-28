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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <div className="input-row">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
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
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <div className="input-row">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
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
        </div>

        <div className="input-group">
          <label htmlFor="phone">Celular</label>
          <div className="input-row">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
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
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <div className="input-row">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="rounded-input"
            />
            <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <div className="input-row">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="rounded-input"
            />
            <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}>
              {showConfirmPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
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