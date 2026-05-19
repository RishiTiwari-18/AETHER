import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

export const SmoothScroll = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Exaggerated scroll physics: slow, heavy, over-smoothed
    const lenis = new Lenis({
      duration: 2.5, // Extremely slow duration (default is ~1.2)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing but takes longer due to duration
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.6, // Resist scrolling
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
};
