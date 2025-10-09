'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Preloader } from '../Preloader/Preloader';
import './HomePage.scss';
import { FaClock, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

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
      <div className={`HomePage ${loading ? 'hidden' : 'visible'}`} ref={homeRef}>
        <h1 className="h1 animate-left">SHELBY<br />BARBEARIA</h1>

        {/* Info Box adicionada aqui */}
        <div className="info-box animate-left">
          <h4><FaClock style={{ marginRight: '8px' }} />Horários</h4>
          <p>Ter a Sex: 9h - 20h<br />Sáb: 9h - 14h</p>

          <h4><FaMapMarkerAlt style={{ marginRight: '8px' }} />Localização</h4>
          <p>Rua Esperanto, 203 - Quilombo</p>

          <a href="https://www.google.com/maps/place/29%C2%B035'41.4%22S+51%C2%B022'19.9%22W/@-29.5948367,-51.3722015,19z/data=!4m4!3m3!8m2!3d-29.5948333!4d-51.3721944?hl=pt-BR&entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D">
            Ver no mapa <FaExternalLinkAlt style={{ marginLeft: '6px' }} />
          </a>
        </div>

        <Link href="/agendamento">
          <button className="button animate-left">Agendar Horário</button>
        </Link>

        <div
          className="scroll-down-indicator"
          onClick={scrollToNextSection}
          role="button"
          tabIndex={0}
          aria-label="Scroll para próxima seção"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToNextSection(); }}
        >
          ↓
        </div>
      </div>
    </>
  );

};
