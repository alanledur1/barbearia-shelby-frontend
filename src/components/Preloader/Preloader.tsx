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
      <div className="preloader__text text-[1.6rem] tracking-[1px] sm:text-[2rem] sm:tracking-[2px] md:text-[2.4rem] md:tracking-[3px] lg:text-[35px] lg:tracking-[4px]">SHELBY</div>
    </div>
  );
};
