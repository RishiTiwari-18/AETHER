import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useAssistant } from '../contexts/AssistantContext';

export const Landing = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { addMessage } = useAssistant();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(".shutter", { height: 0, duration: 1.5, ease: "power4.inOut", stagger: 0.1 })
      .fromTo(".hero-text", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power3.out", stagger: 0.2 }, "-=0.5")
      .fromTo(".nav-item", { opacity: 0 }, { opacity: 1, duration: 2, stagger: 0.1 }, "-=1.5");
  }, []);

  const handleNavigate = (path) => {
    addMessage("Moving with unnecessary dramatic flair.");
    const tl = gsap.timeline({ onComplete: () => navigate(path) });
    tl.to(".shutter", { height: "100%", duration: 1.5, ease: "power4.inOut", stagger: 0.1, transformOrigin: "bottom" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-aether-void relative px-[12vw]">
      {/* Shutters for transition */}
      <div className="fixed inset-0 z-50 flex flex-col pointer-events-none">
        <div className="shutter w-full h-full bg-black border-b border-aether-border/30"></div>
        <div className="shutter w-full h-full bg-black border-b border-aether-border/30"></div>
        <div className="shutter w-full h-full bg-black"></div>
      </div>

      <nav className="fixed bottom-12 left-[12vw] right-[12vw] h-16 bg-aether-surface backdrop-blur-2xl border border-aether-border flex items-center justify-between px-8 z-40">
        <span className="nav-item font-geist text-[9px] tracking-[0.2em] uppercase">AETHER</span>
        <div className="flex gap-12">
          <button onClick={() => handleNavigate('/login')} className="nav-item font-inter text-xs tracking-widest hover:text-white transition-colors duration-700">LOGIN</button>
        </div>
      </nav>

      <main className="pt-[160px] pb-[160px] flex flex-col gap-[160px]">
        <section className="min-h-[60vh] flex flex-col justify-center pl-[32px]">
          <h1 className="hero-text font-playfair text-[10vw] leading-[100%] tracking-[-0.04em] text-white mix-blend-difference z-10 relative">
            Beautifully<br />Hostile.
          </h1>
          <p className="hero-text font-inter text-sm max-w-[45ch] mt-12 text-aether-secondary/80 leading-relaxed ml-[32px]">
            A study in extremes. Massive, expressive typography paired with microscopic, utilitarian data. Experience cinematic minimalism where friction is a marker of exclusivity.
          </p>
        </section>
        
        <section className="min-h-screen flex items-center justify-end relative">
          <div className="w-[40vw] h-[60vh] bg-[url('/images/hero.png')] bg-cover bg-center bg-aether-surface backdrop-blur-3xl border border-aether-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#111] to-[#050505] opacity-20" />
            <div className="hero-text absolute bottom-8 right-8 text-right">
              <p className="font-geist text-[9px] tracking-[0.2em] uppercase text-aether-secondary mb-2">Collection 01</p>
              <h2 className="font-playfair text-4xl text-white">The Void</h2>
            </div>
            
            {/* Hover overlay that slightly shifts */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms]" />
          </div>
        </section>
      </main>
    </div>
  );
};
