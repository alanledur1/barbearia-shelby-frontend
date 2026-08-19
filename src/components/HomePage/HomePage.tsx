'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Preloader } from '../Preloader/Preloader';
import './HomePage.scss';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

// Mini-stats da hero (mesma ideia da referência Lovable): três provas rápidas de confiança
// logo abaixo dos CTAs, em Bebas + label pequena em caixa alta.
const HERO_STATS = [
  { value: '2022', label: 'Desde' },
  { value: '100%', label: 'Hora marcada' },
  { value: '5 min', label: 'Sem espera' },
];

export const HomePage = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const scrollToNextSection = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!loading && !hasAnimated.current) {
      hasAnimated.current = true;

      const elements = document.querySelectorAll('.animate-left');
      gsap.fromTo(
        elements,
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
      );
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div
        className={`HomePage ${loading ? 'hidden' : 'visible'} p-[1.5rem] items-center text-center sm:p-[2rem] sm:items-center sm:text-center md:px-[60px] md:py-0 md:items-start md:text-left lg:px-[100px] lg:py-0 xl:px-[150px] xl:py-0`}
        ref={homeRef}
      >
        <p className="animate-left section-kicker mb-[14px]">
          Rua Esperanto 203 · Quilombo
        </p>

        <h1 className="hero-title animate-left text-[48px] max-w-[90%] sm:text-[60px] md:text-[80px] md:max-w-[640px] lg:text-[96px] lg:max-w-[820px] xl:text-[104px]">
          <span className="block">Barbearia</span>
          <span className="block text-accent-brand">Shelby</span>
        </h1>

        <p className="hero-lead animate-left mt-[18px] max-w-[520px] text-[14px] sm:text-[15px] md:text-[16px]">
          Corte, barba e acabamento com hora marcada. Você chega, senta e sai pronto —
          sem fila, sem enrolação.
        </p>

        <div className="animate-left mt-[28px] flex flex-wrap items-center justify-center gap-[12px] md:justify-start">
          <Link href="/agendamento" className="btn-accent">
            Agendar horário
          </Link>
          <a
            href="https://wa.me/5551998177919?text=Ol%C3%A1,%20gostaria%20de%20agendar%20um%20hor%C3%A1rio"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <FaWhatsapp aria-hidden />
            WhatsApp
          </a>
        </div>

        <ul className="hero-stats animate-left mt-[36px] flex flex-wrap justify-center gap-x-[32px] gap-y-[16px] md:justify-start md:gap-x-[48px]">
          {HERO_STATS.map(({ value, label }) => (
            <li key={label}>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </li>
          ))}
        </ul>

        <div
          className="scroll-down-indicator hidden text-[2.2rem] sm:block md:text-[3rem]"
          onClick={scrollToNextSection}
          // Atributos de Acessibilidade:
          role="button" // Informa que o elemento age como um botão
          tabIndex={0}  // Permite que o elemento seja focado com a tecla Tab
          aria-label="Rolar para próxima seção" // Descreve a ação para leitores de tela
          // Permite que o "botão" seja ativado com as teclas Enter ou Espaço
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); // Evita o scroll padrão da tecla de espaço
              scrollToNextSection();
            }
          }}
        >
          ↓
        </div>
      </div>
    </>
  );

};
