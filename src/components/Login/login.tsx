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
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className='title'>Entrar</h2>

        {(apiError || error) && <p className="error" aria-live="polite">{apiError || error}</p>}

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder='digite seu email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder='digite sua senha'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={rememberMe ? 'current-password' : 'off'}
          />
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
          <Link href="/EsqueciSenha">Esqueceu a senha ?</Link>
        </div>

        <button type="submit" className="btn">
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
