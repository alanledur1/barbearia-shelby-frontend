'use client';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './HomePage.scss';
import { AnimatedText } from '@/components/AnimatedTex/AnimatedTex';

export const HomePage_2 = () => {
  const container = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animação inicial dos títulos
    if (container.current) {
      gsap.from(container.current.querySelectorAll('.title-anim'), {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.3,
        ease: 'power3.out',
      });
    }

    // Animação com scroll da title-2
    if (title2Ref.current) {
      const observer = new IntersectionObserver(
        (entries, observerInstance) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            gsap.fromTo(
              title2Ref.current,
              { x: 100, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 1.5,
                ease: 'power3.out',
              }
            );
            observerInstance.disconnect(); // remove o observer após animar
          }
        },
        { threshold: 0.4 } // dispara quando 40% do elemento estiver visível
      );

      observer.observe(title2Ref.current);

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="HomePage_2" ref={container}>
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="/videos/barbearia.mp4" type="video/mp4" />
      </video>
      <div className="background-overlay" />
      {/* 🔹 CONTEÚDO */}
      <div className="title-1 title-anim">
        <AnimatedText />
        <br /> <br />
        <div className="description">
          Na barbearia Shelby, Cada Detalhe É Feito Para Você.
        </div>
      </div>

      <div className="title-2" ref={title2Ref}>
        Na <span className="red">Shelby</span>, Cada <span className="red">Corte</span> É <br />
        Mais Do Que Um <br />
        <span className="red">Simples</span> Serviço
        <br /> <br />
        <div className="description">
          A Arte De Cortar. A Precisão De Um Shelby.
        </div>
      </div>
    </div>

  );
};
