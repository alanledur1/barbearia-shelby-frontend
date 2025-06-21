'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Preloader } from '../Preloader/Preloader';
import './HomePage.scss';
import { FaClock, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

export const HomePage = () => {
  const homeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const scrollToNextSection = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!loading) {
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
      <div className="HomePage" ref={homeRef} style={{ opacity: loading ? 0 : 1 }}>
        <h1 className="h1 animate-left">SHELBY<br />BARBEARIA</h1>
        <button className="button animate-left">Agendar Horário</button>

        {/* Info Box adicionada aqui */}
        <div className="info-box animate-left">
          <h4><FaClock style={{ marginRight: '8px' }} />Horários</h4>
          <p>Seg a Sex: 9h - 20h<br />Sáb: 9h - 14h</p>

          <h4><FaMapMarkerAlt style={{ marginRight: '8px' }} />Localização</h4>
          <p>Rua Esperanto, 203 - Quilombo</p>

          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
            Ver no mapa <FaExternalLinkAlt style={{ marginLeft: '6px' }} />
          </a>
        </div>

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
