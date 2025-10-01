'use client';

import React, { useState } from 'react';
import './login.scss';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Preencha todos os campos!');
      return;
    }

    setError('');
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className='title'>Entrar</h2>

        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder='digite seu email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
        </div>

        <div className="remember-forgot">
          <label><input type="checkbox" /> Lembre de mim </label>
          <a href="../EsqueciSenha">Esqueceu a senha ?</a>
        </div>

        <button type="submit" className="btn">
          Entrar
        </button>

        <div className="register-link">
          <p>Não tem uma conta? <a href="./CriarConta">Registre-se</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
