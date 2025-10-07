import React from 'react';
import styles from './styles.module.css';

const BarberHeader = () => {
  return (
    <header className={styles.header}>
      <h1>Dashboard do Barbeiro</h1>
      <nav>
        <ul>
          <li><a href="#appointments">Agendamentos</a></li>
          <li><a href="#profile">Perfil</a></li>
          <li><a href="#settings">Configurações</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default BarberHeader;