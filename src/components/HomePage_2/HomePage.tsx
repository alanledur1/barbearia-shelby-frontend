'use client';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './HomePage.scss';
import { AnimatedText } from '@/components/AnimatedTex/AnimatedTex';
import { useParallaxScope } from '@/hooks/useParallaxScope';

export const HomePage_2 = () => {
  const container = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);

  // Parallax das camadas de fundo desta seção (varredura de luz + malha de pontos), no
  // mesmo GSAP que já anima os títulos aqui — nada de um segundo listener de scroll.
  useParallaxScope(container);

  useEffect(() => {
    if (!container.current) return;

    const titles = container.current.querySelectorAll('.title-anim');

    // 🔒 GARANTE estado inicial SEMPRE
    gsap.set(titles, { opacity: 0, y: 40 });

    // ▶️ Anima entrada inicial
    gsap.to(titles, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.3,
      ease: 'power3.out',
      clearProps: 'transform', // evita conflitos futuros
    });

    // ===== Scroll animation da title-2 =====
    if (title2Ref.current) {
      gsap.set(title2Ref.current, { opacity: 0, x: 80 });

      const observer = new IntersectionObserver(
        ([entry], observerInstance) => {
          if (entry.isIntersecting) {
            gsap.to(title2Ref.current, {
              opacity: 1,
              x: 0,
              duration: 1.5,
              ease: 'power3.out',
              clearProps: 'transform',
            });
            observerInstance.disconnect();
          }
        },
        { threshold: 0.4 }
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

      {/* Camadas atmosféricas com parallax (validadas no canvas de design): uma varredura
          de luz quente e uma malha de pontos que deslizam em ritmos diferentes conforme a
          página rola, entre o véu do vídeo e os títulos. Nenhuma delas tem animação CSS de
          transform, então o GSAP é o único dono desse `transform`. */}
      <div className="story-bg" aria-hidden="true">
        <div className="sweep" data-parallax="0.1" />
        <div className="dots" data-parallax="0.22" />
      </div>

      <div className="title-1 title-anim text-[30px] px-[clamp(1.5rem,6vw,150px)] sm:text-[44px] sm:px-0 md:text-[56px]">
        <AnimatedText />

        <div className="description text-[13px] px-[clamp(1.5rem,6vw,150px)] sm:text-[15px] sm:px-0">
          Na barbearia Shelby, Cada Detalhe É Feito Para Você.
        </div>

        <br /><br />

        {/* Bebas Neue tem peso único (400): o "bold" vem do tamanho/condensação, por isso
            aqui não há font-bold — só uppercase e um tracking levemente aberto. */}
        <div className="title-2 uppercase text-[30px] px-[clamp(1.5rem,6vw,150px)] sm:text-[44px] sm:px-0 md:text-[56px]" ref={title2Ref}>
          Na <span className="red">Shelby</span>, Cada <span className="red">Corte</span> É <br />
          Mais Do Que Um <br />
          <span className="red">Simples</span> Serviço

          <div className="description text-[13px] px-[clamp(1.5rem,6vw,150px)] sm:text-[15px] sm:px-0">
            A Arte De Cortar. A Precisão De Um Shelby.
          </div>
        </div>
      </div>
    </div>
  );
};
