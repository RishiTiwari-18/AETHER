import React, { useState, useEffect, useRef } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import gsap from 'gsap';

const warnings = [
  [
    "A temporary lapse in judgment.",
    "Our junior architect was allowed to touch the interface.",
    "Proceed with significantly lowered expectations."
  ],
  [
    "Listen carefully.",
    "This system is mathematically perfect, but emotionally unstable."
  ],
  [
    "We highly recommend spending your capital elsewhere.",
    "This will not end well for you."
  ],
  [
    "Your persistence is becoming embarrassing."
  ],
  [
    "At this point, you are actively choosing to suffer."
  ]
];

export const PreAuthWarning = () => {
  const { hasPassedWarning, setHasPassedWarning, triggerCursorRemoval } = useAssistant();
  const [warningStage, setWarningStage] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!hasPassedWarning) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 2, ease: "power2.inOut" }
      );
    }
  }, [hasPassedWarning]);

  if (hasPassedWarning) return null;

  const handleContinue = () => {
    if (warningStage < warnings.length - 1) {
      // Animate out current text, then update state and animate in
      gsap.to(".warning-text", {
        opacity: 0,
        y: -10,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.in",
        onComplete: () => {
          setWarningStage(prev => prev + 1);
          gsap.fromTo(".warning-text", 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" }
          );
        }
      });
    } else {
      // Final transition out
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          setHasPassedWarning(true);
          setTimeout(() => {
            triggerCursorRemoval();
          }, 1000); // Trigger cursor removal a bit after they enter
        }
      });
    }
  };

  const handleLeave = () => {
    window.location.href = "https://google.com";
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-aether-void/90 backdrop-blur-xl"
    >
      <div className="max-w-2xl text-center px-6">
        <div className="min-h-[200px] flex flex-col justify-center gap-4 mb-12">
          {warnings[warningStage].map((line, i) => (
            <p key={i} className="warning-text font-playfair text-2xl md:text-4xl text-aether-primary opacity-0" style={{ animation: `fadeIn 1s forwards ${i * 0.5}s` }}>
              {line}
            </p>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={handleLeave}
            className="font-inter text-xs tracking-widest uppercase border border-aether-border px-8 py-4 text-aether-secondary hover:text-aether-primary hover:border-aether-primary transition-colors duration-1000"
          >
            Leave While You Can
          </button>
          <button 
            onClick={handleContinue}
            className="font-inter text-xs tracking-widest uppercase bg-aether-primary text-aether-void px-8 py-4 hover:bg-white transition-colors duration-1000"
          >
            Continue Anyway
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .warning-text {
          transform: translateY(10px);
        }
      `}} />
    </div>
  );
};
