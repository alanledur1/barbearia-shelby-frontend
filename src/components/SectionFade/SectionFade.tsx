import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SectionFade = () => {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = sectionsRef.current?.querySelectorAll('.section');

    sections?.forEach((section) => {
      gsap.fromTo(
        section,
        { autoAlpha: 0, y: 50 },
        {
          duration: 1,
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div ref={sectionsRef}>
      <section className="section" style={{ height: '100vh', background: '#222', color: '#fff' }}>
        Seção 1
      </section>
      <section className="section" style={{ height: '100vh', background: '#444', color: '#fff' }}>
        Seção 2
      </section>
      <section className="section" style={{ height: '100vh', background: '#666', color: '#fff' }}>
        Seção 3
      </section>
    </div>
  );
};
