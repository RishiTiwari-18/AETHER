import React, { useEffect, useState } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import gsap from 'gsap';

export const AssistantPopup = () => {
  const { messages, isVisible } = useAssistant();
  const [displayedText, setDisplayedText] = useState('');
  
  const currentMessage = messages.length > 0 ? messages[messages.length - 1].text : '';

  useEffect(() => {
    if (isVisible && currentMessage) {
      setDisplayedText('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(currentMessage.substring(0, i));
        i++;
        if (i > currentMessage.length) clearInterval(interval);
      }, 30); // Typing speed
      return () => clearInterval(interval);
    }
  }, [isVisible, currentMessage]);

  return (
    <div 
      className={`fixed bottom-8 right-8 z-60! max-w-sm border border-aether-border bg-aether-void/80 backdrop-blur-xl p-6 transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 rounded-full bg-aether-primary animate-pulse" />
        <span className="font-geist text-xs tracking-[0.2em] uppercase text-aether-secondary">Aether System</span>
      </div>
      <p className="font-inter text-sm text-aether-primary leading-relaxed min-h-[40px]">
        {displayedText}
      </p>
    </div>
  );
};
