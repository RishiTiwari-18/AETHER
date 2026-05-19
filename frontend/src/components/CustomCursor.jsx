import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAssistant } from '../contexts/AssistantContext';

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const clonesRef = useRef([]);
  const { cursorRemoved } = useAssistant();

  useEffect(() => {
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let rafId = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseDown = (e) => {
      if (e.button !== 0) return;

      for (let index = 0; index < 20; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 9950;
        const anchorX = e.clientX + Math.cos(angle) * distance;
        const anchorY = e.clientY + Math.sin(angle) * distance;
        const offsetX = anchorX - e.clientX;
        const offsetY = anchorY - e.clientY;

        const clone = document.createElement('div');
        clone.style.position = 'fixed';
        clone.style.left = '0px';
        clone.style.top = '0px';
        clone.style.width = '8px';
        clone.style.height = '8px';
        clone.style.borderRadius = '9999px';
        clone.style.pointerEvents = 'none';
        clone.style.zIndex = '100';
        clone.style.background = 'white';
        clone.style.boxShadow = '0 0 18px rgba(255,255,255,0.25)';
        clone.style.mixBlendMode = 'difference';
        clone.style.transformOrigin = 'center center';
        document.body.appendChild(clone);

        clonesRef.current.push({
          el: clone,
          x: anchorX,
          y: anchorY,
          offsetX,
          offsetY
        });

        gsap.fromTo(
          clone,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' }
        );
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    const render = () => {
      const smoothing = 0.35;

      cursorX += (mouseX - cursorX) * smoothing;
      cursorY += (mouseY - cursorY) * smoothing;

      if (cursorRef.current) {
        gsap.set(cursorRef.current, { x: cursorX, y: cursorY });
      }

      clonesRef.current.forEach((clone) => {
        clone.x += ((mouseX + clone.offsetX) - clone.x) * smoothing;
        clone.y += ((mouseY + clone.offsetY) - clone.y) * smoothing;

        if (clone.el) {
          gsap.set(clone.el, {
            x: clone.x,
            y: clone.y,
            opacity: 1,
            scale: 1
          });
        }
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      cancelAnimationFrame(rafId);
      clonesRef.current.forEach((clone) => {
        if (clone.el && clone.el.remove) clone.el.remove();
      });
      clonesRef.current = [];
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  if (cursorRemoved) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-100 -ml-1 -mt-1 mix-blend-difference"
        style={{ background: 'white', boxShadow: '0 0 18px rgba(255,255,255,0.25)', transformOrigin: 'center center' }}
      />
    </>
  );
};
