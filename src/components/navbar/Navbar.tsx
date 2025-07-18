import React from 'react';
import './Navbar.scss'; // importe o arquivo SCSS
import { FaArrowRight } from "react-icons/fa6";
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="Menu principal">
        <div className="navbar__logo">
          <a href="/">
            <img src="/images/logo.png" alt="Logo Shelby" className="navbar__logo-img" />
            <span>SHELBY</span>
          </a>
        </div>
        <ul className="navbar__links">
          <Link href="/Servicos">
            Serviços
          </Link>
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
