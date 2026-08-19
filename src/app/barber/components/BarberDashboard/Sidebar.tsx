'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import {
  FaHouse,
  FaCalendarDays,
  FaCalendarPlus,
  FaFileInvoiceDollar,
  FaChartLine,
  FaGear,
  FaUsers,
  FaLayerGroup,
} from 'react-icons/fa6';
import { useAuth, UserType } from '@/context/AuthContext';
import styles from './Sidebar.module.scss';

type SidebarItem = {
  href: string;
  label: string;
  icon: IconType;
  roles?: UserType[]; // undefined = visível a todo staff (barbeiro, dono, admin)
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: '/', label: 'Site', icon: FaHouse },
  { href: '/barber/agenda', label: 'Agenda', icon: FaCalendarDays },
  { href: '/agendamento', label: 'Novo Agendamento', icon: FaCalendarPlus },
  { href: '/barber/billing', label: 'Faturamento', icon: FaFileInvoiceDollar },
  { href: '/barber/metricas', label: 'Métricas', icon: FaChartLine, roles: ['dono', 'admin'] },
  { href: '/barber/configuracoes', label: 'Configurações', icon: FaGear, roles: ['dono', 'admin'] },
  { href: '/barber/usuarios', label: 'Usuários', icon: FaUsers, roles: ['dono', 'admin'] },
  { href: '/barber/planos', label: 'Planos', icon: FaLayerGroup, roles: ['dono', 'admin'] },
];

function isItemActive(pathname: string, href: string): boolean {
  if (href === '/' || href === '/agendamento') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const auth = useAuth();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleItems = SIDEBAR_ITEMS.filter(
    (item) => !item.roles || (auth.user && item.roles.includes(auth.user.userType))
  );

  return (
    <nav
      className={`${styles.sidebar} inset-x-0 bottom-0 top-auto w-full h-16 flex-row items-center border-t border-t-[#3a3a3a] md:inset-x-auto md:left-0 md:top-0 md:bottom-0 md:w-[72px] md:h-auto md:flex-col md:items-stretch md:border-t-0 md:border-r md:border-r-[#3a3a3a]`}
      aria-label="Navegação da área do barbeiro"
    >
      <ul className={`${styles.list} flex-row justify-around px-[0.5rem] py-0 h-full gap-[0.25rem] md:flex-col md:justify-start md:px-0 md:py-[1.5rem] md:h-auto md:gap-[0.5rem]`}>
        {visibleItems.map(({ href, label, icon: Icon }) => (
          <li key={href} className={styles.item}>
            <Link
              href={href}
              className={`${styles.link} w-[40px] h-[40px] md:w-[48px] md:h-[48px] ${isItemActive(pathname, href) ? styles.active : ''}`}
              aria-label={label}
            >
              <Icon className={styles.icon} aria-hidden="true" />
              <span className={styles.tooltip}>{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={`${styles.profile} p-0 border-t-0 md:pt-[1rem] md:pb-[1.5rem] md:border-t md:border-t-[#3a3a3a]`} ref={profileRef}>
        <button
          className={styles.avatarButton}
          onClick={() => setProfileOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={profileOpen}
          aria-label="Perfil"
        >
          {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
        </button>

        {profileOpen && (
          <div
            className={`${styles.profileMenu} left-auto right-0 bottom-[calc(100%+10px)] md:left-[calc(100%+10px)] md:right-auto md:bottom-0`}
            role="menu"
          >
            <div className={styles.profileHeader}>
              <div className={styles.profileName}>{auth.user?.name}</div>
              <div className={styles.profileEmail}>{auth.user?.email || ''}</div>
            </div>
            <button onClick={() => { auth.logout(); setProfileOpen(false); }}>Sair</button>
          </div>
        )}
      </div>
    </nav>
  );
}
