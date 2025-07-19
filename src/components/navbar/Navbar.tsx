'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import './Navbar.scss';
import { FaArrowRight } from "react-icons/fa6";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = ['topo', 'sobre', 'contato'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'topo') {
              setActiveSection(''); // ativa "Home"
            } else {
              setActiveSection(`#${id}`);
            }
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      const section = href.split('#')[1];
      return pathname === '/' && activeSection === `#${section}`;
    }

    if (href === '/') {
      return pathname === '/' && activeSection === '';
    }

    return pathname === href;
  };

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
          <li className={isActive('/') ? 'active' : ''}>
            <Link href="/">Home</Link>
          </li>
          <li className={isActive('/Servicos') ? 'active' : ''}>
            <Link href="/Servicos">Serviços</Link>
          </li>
          <li className={isActive('/#sobre') ? 'active' : ''}>
            <Link href="/#sobre">Sobre Nós</Link>
          </li>
          <li className={isActive('/#contato') ? 'active' : ''}>
            <Link href="/#contato">Contato</Link>
          </li>
        </ul>
        <div className="navbar__containerButton">
          <button className="navbar__login">Entrar</button>
          <div className="container">
            <button className="navbar__signup">Crie uma conta</button>
            <button className="button">
              <span className="icon"><FaArrowRight /></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
