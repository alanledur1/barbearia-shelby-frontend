'use client';

import React, { useEffect, useRef } from 'react';
import './Footer.scss';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Importar o motion
import { gsap } from 'gsap';
import { BsTiktok } from 'react-icons/bs';

export const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const footerElement = footerRef.current;
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) showColumns();
        });
      },
      { threshold: 0.3 }
    );

    if (footerElement) observer.observe(footerElement);

    return () => {
      if (footerElement) observer.unobserve(footerElement);
    };
  }, []);

  return (
    <footer className='footer' ref={footerRef}>
      <div className='footer__content'>
        <div className='footer__column'>
          <h4>Explore</h4>
          <ul>
            <li><a href='#sobre'>Sobre nós</a></li>
            <li><a href='#servicos'>Nossos serviços</a></li>
            <li><a href='#contato'>Contato</a></li>
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
            <motion.a
              href='https://www.tiktok.com/@borgeselias8'
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <BsTiktok className='icon' />
            </motion.a>

            <motion.a
              href="https://wa.me/+555198177919?text=Olá,%20gostaria%20de%20agendar%20um%20horário"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaWhatsapp className='icon' />
            </motion.a>

            <motion.a
              href="https://www.instagram.com/shelby_barbearia22/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram className='icon' />
            </motion.a>
          </div>
        </div>
      </div>

      <div className='footer__bottom'>© ShelbyBarbearia 2025</div>
    </footer>
  );
};
