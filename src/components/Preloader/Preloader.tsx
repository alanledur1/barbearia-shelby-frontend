// components/Preloader.tsx
'use client';

import React, { useEffect} from 'react';
import { gsap } from 'gsap';
import './Preloader.scss';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    tl.to('.preloader__overlay', {
      scaleY: 0,
      duration: 1.2,
      ease: 'power4.inOut',
      transformOrigin: 'center center',
      delay: 1
    });
  }, [onComplete]);

  return (
    <div className="preloader__overlay">
      <div className="preloader__text">SHELBY</div>
    </div>
  );
};
