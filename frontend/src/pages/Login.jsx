import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { PreAuthWarning } from '../components/PreAuthWarning';
import { PhoneMatrix } from '../components/PhoneMatrix';

const hoverWarnings = [
  "Are you sure?",
  "This action may reduce emotional stability.",
  "Authentication is currently experiencing personality issues.",
  "You can still leave.",
  "Your curiosity is becoming expensive."
];

export const Login = () => {
  const { addMessage } = useAssistant();
  const [attempts, setAttempts] = useState(0);
  const [hoverCount, setHoverCount] = useState(0);
  const [inQueue, setInQueue] = useState(false);
  const [phone, setPhone] = useState('');
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" });
  }, []);

  const handleMouseEnter = (e) => {
    if (attempts >= 5 || inQueue) return;

    // 1. Show warning popup
    const warning = hoverWarnings[hoverCount % hoverWarnings.length];

    const popup = document.createElement('div');
    popup.className = 'fixed text-aether-primary font-playfair text-lg opacity-0 pointer-events-none whitespace-nowrap z-50 mix-blend-difference';
    popup.innerText = warning;

    const btnRect = buttonRef.current.getBoundingClientRect();
    const popupX = btnRect.left + btnRect.width / 2;
    const popupY = btnRect.top - 18 - (Math.random() * 12);

    document.body.appendChild(popup);

    gsap.set(popup, { left: popupX, top: popupY, xPercent: -50 });
    gsap.to(popup, {
      opacity: 1,
      y: -8,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(popup, {
          opacity: 0,
          y: -18,
          duration: 2,
          delay: 1,
          ease: "power2.in",
          onComplete: () => popup.remove()
        });
      }
    });

    setHoverCount(prev => prev + 1);

    // 2. Move button unpredictably within bounds
    const randomAngle = Math.random() * Math.PI * 2;
    const moveDist = 150 + Math.random() * 100;

    const currentAbsX = btnRect.left;
    const currentAbsY = btnRect.top;

    let nextAbsX = currentAbsX + Math.cos(randomAngle) * moveDist;
    let nextAbsY = currentAbsY + Math.sin(randomAngle) * moveDist;

    const margin = 20;
    nextAbsX = Math.max(margin, Math.min(nextAbsX, window.innerWidth - btnRect.width - margin));
    nextAbsY = Math.max(margin, Math.min(nextAbsY, window.innerHeight - btnRect.height - margin));

    const dx = nextAbsX - currentAbsX;
    const dy = nextAbsY - currentAbsY;

    gsap.to(buttonRef.current, {
      x: `+=${dx}`,
      y: `+=${dy}`,
      duration: 1.5,
      ease: "power2.out"
    });

    // 3. Update attempts and check if it should stop
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts === 5) {
        addMessage("Fine. You've earned instability.");
        // Snap back to center after the last evasive maneuver finishes
        gsap.to(buttonRef.current, { x: 0, y: 0, duration: 2, ease: "elastic.out(1, 0.3)", delay: 1.5 });
      }
      return newAttempts;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (attempts < 5) return;

    if (phone.length < 10) {
      addMessage("A complete 10-digit sequence is required.");
      return;
    }

    gsap.to(".auth-form", { opacity: 0, duration: 1, onComplete: () => setInQueue(true) });
  };

  useEffect(() => {
    if (inQueue) {
      addMessage("Exclusivity requires patience.", 6000);
      gsap.fromTo(".queue-ui", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 2, delay: 0.5 });

      // Simulate queue very slowly
      setTimeout(() => {
        gsap.to(".queue-ui", { opacity: 0, duration: 2, onComplete: () => navigate('/products') });
      }, 8000);
    }
  }, [inQueue, addMessage, navigate]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-aether-void relative overflow-hidden px-6"
    >
      <PreAuthWarning />
      {!inQueue ? (
        <form onSubmit={handleSubmit} className="auth-form w-full max-w-5xl flex flex-col gap-12">
          <div className="text-center space-y-4">
            <h1 className="font-playfair text-4xl md:text-6xl text-aether-primary tracking-tight">Identity</h1>
            <p className="font-geist text-[9px] tracking-[0.2em] uppercase text-aether-secondary/50">Authenticate to suffer</p>
          </div>

          <div className="space-y-12 max-w-md mx-auto w-full">
            <div className="relative group">
              <input
                type="text"
                required
                className="w-full bg-transparent border-b border-aether-border py-4 font-inter text-sm text-aether-primary focus:outline-none focus:border-aether-primary transition-colors"
                placeholder=" "
              />
              <label className="absolute left-0 top-4 font-inter text-sm text-aether-secondary pointer-events-none transition-all duration-700 group-focus-within:-top-6 group-focus-within:text-xs group-focus-within:opacity-0">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input
                type="password"
                required
                className="w-full bg-transparent border-b border-aether-border py-4 font-inter text-sm text-aether-primary focus:outline-none focus:border-aether-primary transition-colors"
                placeholder=" "
              />
              <label className="absolute left-0 top-4 font-inter text-sm text-aether-secondary pointer-events-none transition-all duration-700 group-focus-within:-translate-x-10 group-focus-within:opacity-0">
                Password
              </label>
            </div>
          </div>

          <PhoneMatrix phone={phone} setPhone={setPhone} />

          <div className="flex justify-center mt-8 relative h-16 w-full">
            <button
              ref={buttonRef}
              onMouseEnter={handleMouseEnter}
              type={attempts >= 5 ? "submit" : "button"}
              className="absolute font-inter text-xs tracking-widest uppercase bg-aether-primary text-aether-void px-12 py-5 hover:bg-white transition-colors duration-1000 whitespace-nowrap"
            >
              Enter The Void
            </button>
          </div>
        </form>
      ) : (
        <div className="queue-ui flex flex-col items-center justify-center gap-8 opacity-0">
          <div className="w-16 h-16 border border-aether-border rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-aether-primary rounded-full animate-ping" />
          </div>
          <h2 className="font-playfair text-3xl text-aether-primary">You are currently #472</h2>
          <p className="font-geist text-xs tracking-[0.2em] uppercase text-aether-secondary text-center max-w-sm">
            in the luxury verification queue
          </p>
        </div>
      )}
    </div>
  );
};
