import React from 'react';
import './Navbar.scss'; // importe o arquivo SCSS
import { FaArrowRight } from "react-icons/fa6";

export const Navbar = () => {
  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="Menu principal">
        <div className="navbar__logo">
          <img src="/images/logo.png" alt='Logo Shelby' className='navbar__logo-img' />
          SHELBY
        </div>
        <ul className="navbar__links">
          <li className="navbar__links__dropdown">
            <a href="#servicos">Serviços ▾</a>
            <div className="navbar__links__dropdown-content">
              <a href="#barba">Barba</a>
              <a href="#corte">Corte de cabelo</a>
              <a href="#luzes">Luzes</a>
            </div>
          </li>
          <li><a href="#sobre">Sobre Nós</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <div className="navbar__containerButton">
          <button className="navbar__login">Entrar</button>
          <div className="container">
            <button className='navbar__signup'>Crie uma conta</button>
            <button className="button">
              <span className="icon"><FaArrowRight /></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
