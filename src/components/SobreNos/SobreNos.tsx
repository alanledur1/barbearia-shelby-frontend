'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SobreNos.scss';

export default function SobreNos() {
  const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const animateOnScroll = (
      selector: string,
      fromVars: gsap.TweenVars,
      triggerOptions: Partial<ScrollTrigger> = {}
    ) => {
      const elements = gsap.utils.toArray(selector);
      elements.forEach((el) => {
        gsap.from(el, {
          ...fromVars,
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none none',
            ...triggerOptions,
          },
        });
      });
    };

    const ctx = gsap.context(() => {
      animateOnScroll('.animate-bottom', {
        y: 120,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.out',
      });

      animateOnScroll('.animate-aguardamos', {
        y: 80,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, {
        start: 'top 100%',
      });

      animateOnScroll('.animate-title', {
        x: 50,
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.out',
      }, {
        start: 'top 90%',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <div className="SobreNos" ref={sectionRef}>
      <div className="title animate-title">SOBRE NÓS</div>
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

      <div className="text-bottom animate-aguardamos">Aguardamos você !!!</div>
    </div>
  );
}
