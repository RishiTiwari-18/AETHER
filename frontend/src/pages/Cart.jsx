import React, { useEffect } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import { useCart } from '../contexts/CartContext';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { addMessage } = useAssistant();
  const { cartItems, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (cartItems.length === 0) {
      addMessage("The void is empty.", 4000);
    }
    gsap.fromTo(".cart-item", 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, duration: 1.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [addMessage, cartItems.length]);

  return (
    <div className="min-h-screen bg-aether-void px-[12vw] pt-[160px] pb-[160px] relative">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-5xl text-white mb-16">Acquisitions</h1>
        
        {cartItems.length === 0 ? (
          <p className="font-inter text-sm text-aether-secondary/60">Your cart is intentionally desolate.</p>
        ) : (
          <div className="space-y-8 mb-16">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item flex items-center justify-between border-b border-aether-border/30 pb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-32 bg-aether-surface bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                  <div>
                    <h2 className="font-playfair text-2xl text-white mb-2">{item.name}</h2>
                    <p className="font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className="font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase">
                    ${item.price * item.quantity}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="font-inter text-[10px] tracking-widest text-aether-secondary/50 hover:text-white transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-end pt-8">
              <span className="font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase">Subtotal</span>
              <span className="font-playfair text-3xl text-white">${cartTotal}</span>
            </div>
            
            <div className="flex justify-end pt-12">
              <button 
                onClick={() => navigate('/checkout')}
                className="bg-white text-black px-12 py-5 font-inter text-xs tracking-widest uppercase hover:bg-aether-secondary transition-colors duration-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
