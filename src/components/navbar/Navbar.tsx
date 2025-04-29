import React from 'react';
import './Navbar.scss'; // importe o arquivo SCSS

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">SHELBY</div>
      <ul className="navbar__links">
        <li><a href="#home">Início</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#membros"></a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
      <div className="navbar__containerButton">
        <p>Entrar</p>
        <button className="button"></button>
      </div>
    </nav>
  );
};
