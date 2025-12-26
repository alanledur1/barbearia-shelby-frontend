'use client';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './HomePage.scss';
import { AnimatedText } from '@/components/AnimatedTex/AnimatedTex';

export const HomePage_2 = () => {
  const container = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);

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

      <div className="title-1 title-anim">
        <AnimatedText />

        <div className="description">
          Na barbearia Shelby, Cada Detalhe É Feito Para Você.
        </div>

        <br /><br />

        <div className="title-2" ref={title2Ref}>
          Na <span className="red">Shelby</span>, Cada <span className="red">Corte</span> É <br />
          Mais Do Que Um <br />
          <span className="red">Simples</span> Serviço

          <div className="description">
            A Arte De Cortar. A Precisão De Um Shelby.
          </div>
        </div>
      </div>
    </div>
  );
};
