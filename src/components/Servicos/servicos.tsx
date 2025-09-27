'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './servicos.module.scss';
import api from '@/services/api';


// Tipo para um servico individual
type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function Servicos() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        // Adicionando imagens estáticas aos dados da API (você pode melhorar isso no futuro)
        const servicesWithImages = response.data.map((service: any, index: number) => {
          const images = ['/images/corte.webp', '/images/barba.jpeg', '/images/sobrancelha.jpg', '/images/corte-2.jpg'];
          return {
            ...service,
            image: images[index % images.length] // Cicla entre as imagens disponíveis
          };
        });
        setServices(servicesWithImages);
      } catch (err) {
        setError('Não foi possível carregar os serviços.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (isLoading) {
    return <p>Carregando serviços...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className={styles.SobreNos}>
      <motion.div
        layout
        className={styles.title}
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        SERVIÇOS
      </motion.div>

      <div className={styles.container}>
        {[
          {
            title: 'Corte de Cabelo',
            text: 'Corte de cabelo, lavado com shampoo, secagem e modelagem com pomada ou cera. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0,
            image: '/images/corte.webp'
          },
          {
            title: 'Corte + Barba',
            text: 'Corte de cabelo e barba, com lavagem, secagem e modelagem. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0.2,
            image: '/images/barba.jpeg'
          },
          {
            title: 'Corte + Barba + Sobrancelha',
            text: 'Corte de cabelo, barba e sobrancelha, com lavagem, secagem e modelagem. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0.4,
            image: '/images/sobrancelha.jpg'
          },
          {
            title: 'Corte + Sobrancelha',
            text: 'Corte de cabelo e sobrancelha, com lavagem, secagem e modelagem. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0.6,
            image: '/images/corte-2.jpg'
          },
        ].map(({ title, text, delay, image }) => (
          <motion.div
            layout
            className={styles.card}
            key={title}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay }}
          >
            <div className={styles.imageWrapper}>
              <img src={image} className={styles.image} />
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.text}>{text}</p>
          </motion.div>
        ))}
      </div>
      <div className={styles.container}>
        {services.map((service, index) => (
          <motion.div
            layout
            className={styles.card}
            key={service.id}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.2 }}
          >
            <div className={styles.imageWrapper}>
              <img src={service.image} alt={service.name} className={styles.image} />
            </div>
            <h3 className={styles.title}>{service.name}</h3>
            <p className={styles.text}>{service.description}</p>
            <p className={styles.text}><strong>R$ {service.price.toFixed(2).replace('.', ',')}</strong></p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
