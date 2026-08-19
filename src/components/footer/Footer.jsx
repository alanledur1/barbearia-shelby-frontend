'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import './Footer.scss';
import Link from 'next/link';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Importar o motion
import { gsap } from 'gsap';
import { BsTiktok } from 'react-icons/bs';

export const Footer = () => {
  const footerRef = useRef(null);
  const pathname = usePathname();
  // Mesma regra do Navbar: dentro de /barber a navegação vive só na Sidebar, o Footer do
  // site público não deve sobrepor a dashboard interna.
  const isDashboardArea = pathname?.startsWith('/barber') ?? false;

  useEffect(() => {
    const footerElement = footerRef.current;
    const columns = document.querySelectorAll('.footer__column');

    const showColumns = () => {
      gsap.to(columns, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) showColumns();
        });
      },
      { threshold: 0.3 }
    );

    if (footerElement) observer.observe(footerElement);

    return () => {
      if (footerElement) observer.unobserve(footerElement);
    };
  }, []);

  if (isDashboardArea) return null;

  return (
    <footer className='footer py-[20px] px-[12px] sm:py-[28px] sm:px-[16px] md:py-[40px] md:px-[18px] lg:py-[50px] lg:px-[20px]' ref={footerRef}>
      <div className='footer__content gap-[18px] text-center md:gap-[22px] md:text-left lg:gap-[20px]'>
        {/* Coluna de marca: mesma assinatura tipográfica da navbar + os dados de contato que
            a referência mantém sempre visíveis no rodapé. */}
        <div className='footer__column footer__brand min-w-0 md:min-w-[220px]'>
          <div className='footer__brandName'>Shelby</div>
          <p>
            Barbearia em Quilombo desde 2022. Hora marcada, sem espera e um corte que
            combina com você.
          </p>
          <p>
            <a href='tel:+5551998177919'>(51) 99817-7919</a><br />
            Rua Esperanto, 203 — Quilombo
          </p>
        </div>

        <div className='footer__column min-w-0 md:min-w-[200px]'>
          <h4 className='text-[16px] sm:text-[17px] lg:text-[18px]'>Explore</h4>
          <ul>
            {/* Âncoras com prefixo "/" + next/link: funcionam também a partir de páginas
                internas (antes `#sobre` só resolvia estando na home). */}
            <li className='text-[13px] sm:text-[15px] lg:text-base'><Link href='/#sobre'>Sobre nós</Link></li>
            <li className='text-[13px] sm:text-[15px] lg:text-base'><Link href='/#servicos'>Nossos serviços</Link></li>
            <li className='text-[13px] sm:text-[15px] lg:text-base'><Link href='/#contato'>Contato</Link></li>
            <li className='text-[13px] sm:text-[15px] lg:text-base'><Link href='/agendamento'>Agendar horário</Link></li>
          </ul>
        </div>

        <div className='footer__column min-w-0 md:min-w-[200px]'>
          <h4 className='text-[16px] sm:text-[17px] lg:text-[18px]'>Horários</h4>
          <ul>
            <li className='text-[13px] sm:text-[15px] lg:text-base'>Ter a Sex: 9h — 20h</li>
            <li className='text-[13px] sm:text-[15px] lg:text-base'>Sábado: 9h — 14h</li>
            <li className='text-[13px] sm:text-[15px] lg:text-base'>Dom e Seg: fechado</li>
          </ul>
        </div>

        <div className='footer__column min-w-0 md:min-w-[200px]'>
          <h4 className='text-[16px] sm:text-[17px] lg:text-[18px]'>Redes</h4>
          <div className='footer__social-icons justify-center mt-[6px] md:justify-start md:mt-[10px]'>
            <motion.a
              href='https://www.tiktok.com/@borgeselias8'
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <BsTiktok className='icon text-[15px] sm:text-[20px]' />
            </motion.a>

            <motion.a
              href="https://wa.me/+555198177919?text=Olá,%20gostaria%20de%20agendar%20um%20horário"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaWhatsapp className='icon text-[15px] sm:text-[20px]' />
            </motion.a>

            <motion.a
              href="https://www.instagram.com/shelby_barbearia22/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram className='icon text-[15px] sm:text-[20px]' />
            </motion.a>
          </div>
        </div>
      </div>

      <div className='footer__bottom mt-[28px] pt-[22px] text-[12px] tracking-[0.14em] uppercase md:mt-[40px] md:pt-[30px] md:text-[13px]'>
        © {new Date().getFullYear()} Barbearia Shelby
      </div>
    </footer>
  );
};
