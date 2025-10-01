'use client';

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import './Navbar.scss';
import { FaArrowRight } from "react-icons/fa6";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthSafe } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const auth = useAuthSafe();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Marca que o componente já montou no cliente (evita diferença SSR/CSR)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          <Link href="/" className="navbar__logoLink">
            <Image src="/images/logo.png" alt="Logo Shelby" width={48} height={48} className="navbar__logo-img" />
            <span>SHELBY</span>
          </Link>
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
          {/* Mostra opções diferentes dependendo do estado de autenticação */}
          {isMounted && auth && auth.isAuthenticated ? (
            <div className="navbar__user" ref={dropdownRef}>
              <button className="navbar__avatarButton" onClick={() => setOpen(v => !v)} aria-haspopup="true" aria-expanded={open}>
                {/* Avatar: primeira letra do nome */}
                <span className="navbar__avatar">{auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}</span>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    className="navbar__dropdown"
                    role="menu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="navbar__dropdownHeader">
                      <div className="navbar__avatarLarge">{auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}</div>
                      <div className="navbar__userInfo">
                        <div className="navbar__userName">{auth.user?.name}</div>
                        <div className="navbar__userEmail">{auth.user?.email || ''}</div>
                      </div>
                    </div>
                    <Link href="/meus-servicos" className="navbar__dropdownItem">Meus Serviços</Link>
                    <button className="navbar__dropdownItem" onClick={() => { auth.logout(); setOpen(false); }}>Sair</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button className="navbar__hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Abrir menu">
                <span className={`hamburger ${mobileOpen ? 'is-open' : ''}`}></span>
              </button>

              <Link href="/Login" className="navbar__login">Entrar</Link>

              <div className="container" >
                <Link href="/CriarConta" className="navbar__signup">Crie uma conta</Link>
                <Link href="/CriarConta">
                  <button className="button">
                    <span className="icon"><FaArrowRight /></span>
                  </button>
                </Link>
              </div>

              <AnimatePresence>
                {mobileOpen && (
                  <motion.nav
                    className="navbar__mobileMenu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ul>
                      <li><Link href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
                      <li><Link href="/Servicos" onClick={() => setMobileOpen(false)}>Serviços</Link></li>
                      <li><Link href="/#sobre" onClick={() => setMobileOpen(false)}>Sobre Nós</Link></li>
                      <li><Link href="/#contato" onClick={() => setMobileOpen(false)}>Contato</Link></li>
                    </ul>
                  </motion.nav>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
