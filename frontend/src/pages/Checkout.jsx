import React, { useState, useEffect, useRef } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import gsap from 'gsap';

export const Checkout = () => {
  const { addMessage } = useAssistant();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isConfirming, setIsConfirming] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(".checkout-anim",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 2, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Imperfect Focus Logic
    if (value !== '' && index < 5) {
      // Intentionally delay the focus to feel psychologically frustrating
      setTimeout(() => {
        inputsRef.current[index + 1]?.focus();
      }, 400); // 400ms delay feels terrible but elegant
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      setTimeout(() => {
        inputsRef.current[index - 1]?.focus();
      }, 200);
    }
  };

  const handleConfirm = () => {
    if (otp.join('').length < 6) {
      addMessage("Incomplete submission detected.");
      return;
    }

    setIsConfirming(true);
    addMessage("Initiating unnecessary confirmation sequence.", 5000);

    const tl = gsap.timeline();
    tl.to(".checkout-content", { opacity: 0, scale: 0.9, duration: 2, ease: "power3.inOut" })
      .to(".confirmation-step-1", { opacity: 1, y: 0, duration: 1.5 }, "-=0.5")
      .to(".confirmation-step-1", { opacity: 0, y: -20, duration: 1.5, delay: 2 })
      .to(".confirmation-step-2", { opacity: 1, y: 0, duration: 1.5 })
      .to(".confirmation-step-2", { opacity: 0, y: -20, duration: 1.5, delay: 2 })
      .to(".confirmation-step-final", { opacity: 1, scale: 1, duration: 3, ease: "slow(0.7, 0.7, false)" });
  };

  return (
    <div className="min-h-screen bg-aether-void flex items-center justify-center relative overflow-hidden px-6">
      {!isConfirming ? (
        <div className="checkout-content max-w-lg w-full">
          <h1 className="checkout-anim font-playfair text-4xl text-white mb-4">Verification</h1>
          <p className="checkout-anim font-inter text-sm text-aether-secondary/80 mb-16">
            Please enter your one-time code. Typing will feel slightly disconnected. This is intentional.
          </p>

          <div className="checkout-anim flex gap-4 justify-between mb-16">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputsRef.current[idx] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-16 bg-transparent border-b border-aether-border text-center font-geist text-2xl text-white focus:outline-none focus:border-white transition-colors"
              />
            ))}
          </div>

          <button
            onClick={handleConfirm}
            className="checkout-anim w-full border border-aether-border py-5 font-inter text-xs tracking-[0.2em] uppercase text-aether-secondary hover:text-white hover:border-white transition-all duration-1000"
          >
            Finalize Suffering
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="confirmation-step-1 absolute opacity-0 translate-y-10 text-center">
            <p className="font-geist text-[9px] tracking-[0.3em] text-aether-secondary uppercase mb-4">Phase 1</p>
            <h2 className="font-playfair text-4xl text-white">Validating Patience</h2>
          </div>
          <div className="confirmation-step-2 absolute opacity-0 translate-y-10 text-center">
            <p className="font-geist text-[9px] tracking-[0.3em] text-aether-secondary uppercase mb-4">Phase 2</p>
            <h2 className="font-playfair text-4xl text-white">Transferring Wealth</h2>
          </div>
          <div className="confirmation-step-final absolute opacity-0 scale-95 text-center">
            <h1 className="font-playfair text-6xl md:text-8xl text-white mb-6 tracking-tight">Complete.</h1>
            <p className="font-inter text-sm text-aether-secondary/60">
              The transaction is sealed in the void.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
