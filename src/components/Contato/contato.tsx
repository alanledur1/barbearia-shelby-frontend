'use client';

import React from 'react';
import './contato.scss';
import { motion } from 'framer-motion';
import { FaPhone } from "react-icons/fa6";
import { SlEnvolopeLetter } from "react-icons/sl";
import { TbMapShare } from "react-icons/tb";

export const Contato = () => {
  return (
    <div className='contato'>
      <motion.div
        className='title animate-title'
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        CONTATO
      </motion.div>

      <div className='container'>
        {[
          {
            icon: <FaPhone className='icon' />,
            title: '(51) 99817-7919',
            text: 'Atendimento rápido e sem enrolação. Agende agora pelo WhatsApp.',
            delay: 0
          },
          {
            icon: <SlEnvolopeLetter className='icon' />,
            title: 'borgeselias876@gmail.com',
            text: 'Envie dúvidas, sugestões ou propostas comerciais.',
            delay: 0.2
          },
          {
            icon: <TbMapShare className='icon' />,
            title: 'Rua Esperanto 203',
            text: 'Chega junto pra renovar o corte com estilo!',
            delay: 0.4
          }
        ].map(({ icon, title, text, delay }, index) => (
          <motion.div
            className='card'
            key={index}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay }}
          >
            <h3>{icon} {title}</h3>
            <p>{text}</p>
          </motion.div>
        ))}
      </div>

      <div className='contato-conteudo'>
        <motion.div
          className='bloco-titulo'
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <h1>Localização</h1>
        </motion.div>

        <div className='conteudo-horizontal'>
          <motion.div
            className='localizacao'
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d515.7152421319917!2d-51.372101808545125!3d-29.594824897338576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjnCsDM1JzQxLjQiUyA1McKwMjInMTkuOSJX!5e0!3m2!1spt-BR!2sbr!4v1752206341201!5m2!1spt-BR!2sbr"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </motion.div>

          <motion.div
            className='formulario'
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          >
            <form className='form' action="">
              <input type="text" placeholder='Nome' />
              <input type="text" placeholder='Email' />
              <textarea cols={30} rows={10} placeholder='Mensagem'></textarea>
              <button type="submit">Enviar</button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
