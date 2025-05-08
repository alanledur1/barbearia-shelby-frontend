'use client';

import React, { useEffect, useRef } from 'react';
import './Footer.scss';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { gsap } from 'gsap';

export const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const footerElement = footerRef.current;
    let lastScrollY = window.scrollY;
    let ticking = false;
  
    const columns = document.querySelectorAll('.footer__column');
  
    const showColumns = () => {
      gsap.to(columns, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });
    };
  
    const hideColumns = () => {
      gsap.to(columns, {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.1,
        ease: 'elastic.out'
      });
    };
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            showColumns();
          }
        });
      },
      { threshold: 0.3 }
    );
  
    if (footerElement) observer.observe(footerElement);
  
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
  
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollingUp = currentScrollY < lastScrollY;
  
          if (scrollingUp) {
            hideColumns();
          }
  
          lastScrollY = currentScrollY;
          ticking = false;
        });
  
        ticking = true;
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      if (footerElement) observer.unobserve(footerElement);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  
  
  

  return (
    <footer className='footer' ref={footerRef}>
      <div className='footer__content'>
        <div className='footer__column'>
          <p>
            ShipUp delivers an unparalleled customer service through dedicated customer teams,
            engaged people working in an agile culture, and a global footprint.
          </p>
        </div>
        <div className='footer__column'>
          <h4>Explore</h4>
          <ul>
            <li>Sobre nós</li>
            <li>Nossos serviços</li>
            <li>Blog</li>
            <li>Contato</li>
          </ul>
        </div>
        <div className='footer__column'>
          <h4>Legal</h4>
          <ul>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div className='footer__column'>
          <h4>Social Media</h4>
          <div className='footer__social-icons'>
            <FaFacebookF className='icon' />
            <FaTwitter className='icon' />
            <FaWhatsapp className='icon' />
            <FaInstagram className='icon' />
          </div>
        </div>
      </div>
      <div className='footer__bottom'>© ShelbyBarbearia 2025</div>
    </footer>
  );
};
