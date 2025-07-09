'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './SobreNos.scss';

export default function SobreNos() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textFinalRef = useRef<HTMLDivElement>(null);

  const hasAnimatedCards = useRef(false);
  const hasAnimatedTitle = useRef(false);
  const hasAnimatedText = useRef(false);

  const cardsObserver = useRef<IntersectionObserver>();
  const textObserver = useRef<IntersectionObserver>();

  useEffect(() => {
    const animateCards = () => {
      if (!container.current) return;
      const cards = container.current.querySelectorAll('.card.animate-bottom');
      if (cards.length === 0) return;

      cardsObserver.current = new IntersectionObserver(([entry], observerInstance) => {
        if (entry.isIntersecting && !hasAnimatedCards.current) {
          hasAnimatedCards.current = true;
          gsap.fromTo(cards,
            { y: 60, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
          );
          observerInstance.disconnect();
        }
      }, { threshold: 0.3 });

      cardsObserver.current.observe(container.current);
    };

    const animateTextFinal = () => {
      if (!textFinalRef.current) return;

      textObserver.current = new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting && !hasAnimatedText.current) {
          hasAnimatedText.current = true;
          gsap.fromTo(textFinalRef.current,
            { y: 60, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.2, delay: 0.8, ease: 'power3.out' }
          );
          obs.disconnect();
        }
      }, { threshold: 0.4 });

      textObserver.current.observe(textFinalRef.current);
    };

    const animateTitleWithScroll = () => {
      if (!titleRef.current) return;

      const observer = new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting && !hasAnimatedTitle.current) {
          hasAnimatedTitle.current = true;
          gsap.fromTo(
            titleRef.current,
            { x: 100, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 1.2,
              ease: 'power4.out',
            }
          );
          obs.disconnect();
        }
      }, { threshold: 0.4 });

      observer.observe(titleRef.current);
    };


    animateTitleWithScroll();
    animateCards();
    animateTextFinal();

    return () => {
      cardsObserver.current?.disconnect();
      textObserver.current?.disconnect();
    };
  }, []);

  return (
    <div className="SobreNos" ref={container}>
      <div className="title animate-title" ref={titleRef}>SOBRE NÓS</div>
      <div className="container">
        <div className="card animate-bottom">
          <h3>Nossa História</h3>
          <p>
            A Shelby Barbearia foi criada em 2021 para atender um público exigente, que busca estilo, conforto e atitude.
            Com um ambiente pensado para o homem moderno, unimos música, conversa boa e técnicas afiadas para entregar mais
            do que um corte: entregamos identidade. Aqui, cada cliente encontra seu próprio estilo — Shelby é mais que uma barbearia,
            é uma experiência.
          </p>
        </div>

        <div className="card animate-bottom">
          <h3>Ambiente</h3>
          <p>
            A vibe também conta: ambiente climatizado, trilha sonora de respeito, café na recepção e aquele bate-papo que só
            uma barbearia de verdade pode oferecer. Seja sua primeira visita ou a décima, você sempre será recebido como parte da família Shelby.
          </p>
        </div>

        <div className="card animate-bottom">
          <h3>Seu Tempo é valioso</h3>
          <p>
            Sabemos que tempo é um dos bens mais preciosos que você tem. Por isso, cada minuto aqui é planejado para entregar uma experiência de
            cuidado e estilo sem enrolação.
          </p>
        </div>
      </div>

      <div className="text-bottom animate-aguardamos" ref={textFinalRef}>Aguardamos você !!!</div>
    </div>
  );
}
