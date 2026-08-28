'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Preloader } from '../Preloader/Preloader';
import './HomePage.scss';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { useParallaxScope } from '@/hooks/useParallaxScope';

// Mini-stats da hero (mesma ideia da referência Lovable): três provas rápidas de confiança
// logo abaixo dos CTAs, no display + label pequena em caixa alta.
//
// `to`/`suffix` separados porque os números sobem de 0 até o valor final quando a hero entra
// (count-up validado no canvas de design). O valor final é o que sai no HTML do servidor —
// sem JS, ou com `prefers-reduced-motion`, a stat continua legível e correta.
const HERO_STATS = [
  { to: 2022, suffix: '', label: 'Desde' },
  { to: 100, suffix: '%', label: 'Hora marcada' },
  { to: 5, suffix: ' min', label: 'Sem espera' },
];

// Duração e easing copiados do canvas: ~2.2s com desaceleração cúbica (out).
const COUNT_DURATION = 2200;

// A <ul> das stats é o 5º elemento `.animate-left`, e o stagger da entrada é de 0.2s —
// então a faixa de stats começa a aparecer por volta dos 0.8s. O count-up dispara junto.
const COUNT_START_DELAY = 0.75;

export const HomePage = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // null = ainda não animou (renderiza o valor final). Um array = valores em contagem.
  const [counts, setCounts] = useState<number[] | null>(null);
  // Dispara a entrada escalonada das palavras do H1 (transição CSS em `.title-word`).
  const [titleIn, setTitleIn] = useState(false);

  const scrollToNextSection = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const hasAnimated = useRef(false);

  // Parallax das camadas de fundo da hero (glow + varredura diagonal).
  useParallaxScope(homeRef);

  useEffect(() => {
    if (loading || hasAnimated.current) return;
    hasAnimated.current = true;

    const scope = homeRef.current;
    if (!scope) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = scope.querySelectorAll('.animate-left');

    if (reduced) {
      // Sem movimento: só garante o estado final (o conteúdo já nasce visível no HTML).
      gsap.set(elements, { autoAlpha: 1, x: 0 });
      setTitleIn(true);
      return;
    }

    gsap.fromTo(
      elements,
      { autoAlpha: 0, x: -50 },
      { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    );

    // O H1 inteiro é deslocado no eixo X pelo tween acima; as palavras se movem no eixo Y
    // por transição CSS dentro dele. Elementos diferentes, propriedades diferentes — nada
    // de GSAP e CSS disputando o mesmo `transform` no mesmo nó.
    const titleCall = gsap.delayedCall(0.2, () => setTitleIn(true));

    // ----- count-up das stats -----
    let frame = 0;
    const countCall = gsap.delayedCall(COUNT_START_DELAY, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / COUNT_DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCounts(HERO_STATS.map(({ to }) => Math.round(to * eased)));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      titleCall.kill();
      countCall.kill();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div
        className={`HomePage ${loading ? 'hidden' : 'visible'} p-[1.5rem] items-center text-center sm:p-[2rem] sm:items-center sm:text-center md:px-[60px] md:py-0 md:items-start md:text-left lg:px-[100px] lg:py-0 xl:px-[150px] xl:py-0`}
        ref={homeRef}
      >
        {/* Camadas atmosféricas da hero (validadas no canvas de design). Ficam sobre a foto
            de fundo e abaixo do conteúdo, e deslizam mais devagar que o texto conforme a
            página rola (ver useParallaxScope).

            `.glow-drift` é wrapper de propósito: a animação CSS `drift` mora nele e o
            parallax do GSAP mora no `.glow` de dentro — as duas mexem em `transform`, e no
            mesmo elemento uma sobrescreveria a outra. */}
        <div className="hero-bg" aria-hidden="true">
          <div className="glow-drift">
            <div className="glow" data-parallax="0.06" />
          </div>
          <div className="sweep" data-parallax="0.12" />
          <div className="grain" />
        </div>

        <div className="hero-emblem-wrap" aria-hidden="true">
          <svg className="hero-emblem" data-parallax="0.16" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <circle cx="200" cy="200" r="172" strokeOpacity={0.9} />
            <circle cx="200" cy="200" r="148" strokeOpacity={0.5} />
            <g transform="translate(140,140) rotate(18 60 60) scale(2.6)" strokeWidth={1}>
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </g>
            <g transform="translate(150,150) rotate(-25 60 60) scale(2.6)" strokeWidth={1}>
              <path d="M3 12h11l6-4.5v9L14 12" />
              <line x1="3" y1="12" x2="1" y2="12" />
            </g>
          </svg>
        </div>

        <p className="animate-left section-kicker mb-[14px]">
          Rua Esperanto 203 · Quilombo
        </p>

        <h1
          className={`hero-title animate-left${titleIn ? ' is-visible' : ''} text-[48px] max-w-[90%] sm:text-[60px] md:text-[80px] md:max-w-[640px] lg:text-[96px] lg:max-w-[820px] xl:text-[104px]`}
        >
          <span className="title-word block">Barbearia</span>
          <span className="title-word block text-accent-brand">Shelby</span>
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
          {HERO_STATS.map(({ to, suffix, label }, idx) => (
            <li key={label}>
              <div className="stat-value">
                {(counts ? counts[idx] : to)}
                {suffix}
              </div>
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
