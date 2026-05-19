import React, { useState, useEffect, useRef } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import gsap from 'gsap';

export const PhoneMatrix = ({ phone, setPhone }) => {
  const { addMessage } = useAssistant();
  const [selectedByRow, setSelectedByRow] = useState(Array(10).fill(null));
  const rowsRef = useRef([]);

  useEffect(() => {
    // Independent drifting for rows
    rowsRef.current.forEach((row, i) => {
      if (!row) return;
      gsap.to(row, {
        x: () => (Math.random() - 0.5) * 15,
        y: () => (Math.random() - 0.5) * 5,
        duration: 4 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });
    });
    
    // Occasional disturbance
    const disturbance = setInterval(() => {
      const randomRow = rowsRef.current[Math.floor(Math.random() * 10)];
      if (randomRow) {
        gsap.to(randomRow, { x: "+=20", duration: 0.1, yoyo: true, repeat: 1, ease: "power4.inOut" });
      }
    }, 6000);
    
    return () => clearInterval(disturbance);
  }, []);

  useEffect(() => {
    setPhone(selectedByRow.filter(d => d !== null).join(''));
  }, [selectedByRow, setPhone]);

  const handleCheckboxChange = (e, rowIdx, digit) => {
    const isChecked = e.target.checked;
    const cell = e.currentTarget.parentElement;
    
    // Cinematic click transition
    if (isChecked) {
      gsap.to(cell, { scale: 0.9, backgroundColor: "rgba(255,255,255,0.1)", duration: 0.1, yoyo: true, repeat: 1 });
      gsap.fromTo(cell, 
        { boxShadow: "0 0 0px rgba(255,255,255,0)" },
        { boxShadow: "0 0 20px rgba(255,255,255,0.3)", duration: 0.5, yoyo: true, repeat: 1 }
      );
    }
    
    playLuxuryBeep();
    
    // Assistant logic
    if (rowIdx === 3 && Math.random() > 0.5) addMessage("Most users choose row 4.");
    else if (rowIdx === 7 && Math.random() > 0.5) addMessage("This row feels emotionally stable.");
    else if (Math.random() > 0.85) addMessage("Interesting numerical instincts.");
    else if (Math.random() > 0.85) addMessage("You are constructing identity manually.");
    else if (Math.random() > 0.95) addMessage("Typing was removed after the incident.");

    // Delay before registering
    const lag = Math.random() > 0.9 ? 1200 : 400 + Math.random() * 200; // random matrix disturbance lag
    
    setTimeout(() => {
      setSelectedByRow(prev => {
        const next = [...prev];
        if (isChecked) {
          next[rowIdx] = digit;
        } else {
          next[rowIdx] = null;
        }
        return next;
      });
    }, lag);
  };
  
  const playLuxuryBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
  };

  const handlePaste = (e) => {
    e.preventDefault();
    addMessage("Direct efficiency has been deprecated.");
  };

  return (
    <div className="w-full flex flex-col items-center gap-16 my-16" onPaste={handlePaste}>
      {/* Phone Display */}
      <div className="flex flex-col items-center gap-6">
        <label className="font-geist text-[9px] tracking-[0.4em] uppercase text-aether-secondary/50">
          Enter your phone number by selecting one digit from each row. This is the only way.
        </label>
        <div className="flex items-center justify-center gap-3 md:gap-8 h-20 md:h-32 px-4 md:px-8 border-b border-aether-border/30 ">
          {selectedByRow.map((d, i) => (
            <span key={i} className={`digit-${i} font-playfair text-4xl md:text-6xl transition-colors duration-700 ${d !== null ? 'text-white' : 'text-aether-secondary/20'}`}>
              {d !== null ? d : '-'}
            </span>
          ))}
        </div>
      </div>

      {/* 10x10 Grid */}
      <div className="flex flex-col gap-3 md:gap-8 p-4 bg-white/1 backdrop-blur-3xl border border-white/3 rounded-sm relative max-w-full overflow-x-auto no-scrollbar">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/1 to-transparent pointer-events-none" />
        {Array.from({ length: 10 }).map((_, rowIdx) => (
          <div 
            key={rowIdx} 
            ref={el => rowsRef.current[rowIdx] = el}
            className="flex gap-2 md:gap-4 relative min-w-0 md:min-w-max "
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => {
              const isSelected = selectedByRow[rowIdx] === digit;
              const isDisabled = selectedByRow[rowIdx] !== null && !isSelected;
              
              return (
                <label
                  key={`${rowIdx}-${digit}`}
                  className={`w-10 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center border border-white/2 bg-white/1 transition-all duration-1000 font-geist text-[10px] md:text-sm text-aether-secondary/50 group relative overflow-hidden ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300" />
                  <span className="relative z-10 mb-1">{digit}</span>
                  <input
                    type="checkbox"
                    className="accent-white cursor-pointer relative z-10 w-3 h-3 md:w-4 md:h-4"
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={(e) => handleCheckboxChange(e, rowIdx, digit)}
                  />
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
