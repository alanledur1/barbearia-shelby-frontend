'use client';

import React from 'react';
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

  const visibleItems = SIDEBAR_ITEMS.filter(
    (item) => !item.roles || (auth.user && item.roles.includes(auth.user.userType))
  );

  return (
    <nav className={styles.sidebar} aria-label="Navegação da área do barbeiro">
      <ul className={styles.list}>
        {visibleItems.map(({ href, label, icon: Icon }) => (
          <li key={href} className={styles.item}>
            <Link
              href={href}
              className={`${styles.link} ${isItemActive(pathname, href) ? styles.active : ''}`}
              aria-label={label}
            >
              <Icon className={styles.icon} aria-hidden="true" />
              <span className={styles.tooltip}>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
