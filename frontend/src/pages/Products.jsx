import React, { useEffect } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

export const mockProducts = [
  { id: '1', name: 'Obsidian Trench', price: 1250, image: '/images/product.png' },
  { id: '2', name: 'Architectural Tote', price: 890, image: '/images/bag.png' },
  { id: '3', name: 'Brutalist Boot', price: 1050, image: '/images/boots.png' }
];

export const Products = () => {
  const { addMessage } = useAssistant();
  const navigate = useNavigate();
  
  useEffect(() => {
    addMessage("Peruse our offerings. Or don't.", 4000);
    gsap.fromTo(".product-card", 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "power3.out" }
    );
  }, [addMessage]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-aether-void px-[12vw] pt-[160px] pb-[160px] relative">
      <div className="mb-24">
        <h1 className="font-playfair text-6xl text-white mb-6">Collection 01</h1>
        <p className="font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase">
          Absorb light. Do not reflect.
        </p>
      </div>
      
      {/* Asymmetric Grid */}
      <div className="grid grid-cols-12 gap-8 gap-y-32 relative">
        {mockProducts.map((product, idx) => (
          <div 
            key={product.id} 
            className={`product-card group cursor-pointer ${idx % 2 === 0 ? 'col-span-12 md:col-span-6 lg:col-span-5' : 'col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8 mt-16'}`}
            onClick={() => handleProductClick(product.id)}
          >
            <div className="w-full aspect-[3/4] bg-aether-surface border border-aether-border relative overflow-hidden mb-6">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms]" />
            </div>
            
            <div className="flex justify-between items-start">
              <h2 className="font-playfair text-2xl text-white">{product.name}</h2>
              <span className="font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase mt-2">
                ${product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
