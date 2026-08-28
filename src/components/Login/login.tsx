'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './login.scss';


interface LoginProps {
  onLogin: (email: string, password: string) => void;
  apiError?: string; //Prop opcional
}

const Login: React.FC<LoginProps> = ({ onLogin, apiError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Preencha todos os campos!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Informe um e-mail válido.');
      return;
    }

    setError('');
    onLogin(trimmedEmail, trimmedPassword);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form rounded-card border border-border bg-card">
        <h2 className='title'>Bem-vindo de volta</h2>
        <p className='subtitle'>Entre para ver e gerenciar seus agendamentos.</p>

        {(apiError || error) && <p className="error" aria-live="polite">{apiError || error}</p>}

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
              placeholder='digite seu email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
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
              placeholder='digite sua senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={rememberMe ? 'current-password' : 'off'}
              className="rounded-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="remember-forgot">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            {' '}Lembre de mim
          </label>
          <Link href="/EsqueciSenha">Esqueceu a senha?</Link>
        </div>

        <button type="submit" className="btn rounded-button">
          Entrar
        </button>

        <div className="register-link">
          <p>Não tem uma conta? <Link href="/CriarConta">Registre-se</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
