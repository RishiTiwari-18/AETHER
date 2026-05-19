import React, { useState, useEffect, useRef } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import { useCart } from '../contexts/CartContext';
import gsap from 'gsap';
import { useNavigate, useParams } from 'react-router-dom';
import { mockProducts } from './Products';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addMessage } = useAssistant();
  const { addToCart, cartQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const hoverTimer = useRef(null);
  
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];
  
  useEffect(() => {
    gsap.fromTo(".product-stagger", 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 2, stagger: 0.2, ease: "power3.out" }
    );
    
    return () => {
      // Component unmounts (leaving page)
      addMessage("It noticed you leaving.", 3000);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [addMessage]);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      addMessage("The item appreciated your attention.", 4000);
    }, 5000); // 5 seconds of hovering
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Cinematic add to cart
    const tl = gsap.timeline();
    
    tl.to(".product-image", { scale: 0.95, filter: "brightness(0.5)", duration: 1.5, ease: "power2.inOut" })
      .to(".cart-overlay", { opacity: 1, duration: 2, ease: "power2.inOut" }, "-=1")
      .to(".cart-overlay-text", { y: 0, opacity: 1, duration: 1.5, stagger: 0.2 }, "-=0.5")
      .to(".cart-overlay", { opacity: 0, duration: 2, delay: 1 })
      .to(".product-image", { scale: 1, filter: "brightness(1)", duration: 2 }, "-=2")
      .add(() => {
        setIsAdding(false);
        addToCart(product);
      });
  };

  const handleGoToCart = () => {
    const tl = gsap.timeline({ onComplete: () => navigate('/cart') });
    tl.to(".page-container", { opacity: 0, filter: "blur(20px)", duration: 2, ease: "power3.inOut" });
  };

  return (
    <div className="page-container min-h-screen bg-aether-void px-[12vw] pt-[160px] pb-[160px] relative">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Product Image Panel */}
        <div 
          className="product-stagger col-span-12 lg:col-span-7 h-[80vh] bg-aether-surface backdrop-blur-3xl border border-aether-border relative overflow-hidden group cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="product-image w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${product.image})` }}
          />
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms]" />
          
          <div className="absolute bottom-6 right-6 text-right">
            <span className="font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase">
              SKU: V-00{product.id}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="product-stagger col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col justify-center translate-y-[32px]">
          <h1 className="font-playfair text-5xl md:text-6xl text-white mb-6">
            {product.name.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
          </h1>
          <p className="font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase mb-12">
            ${product.price}.00 USD
          </p>
          
          <p className="font-inter text-sm text-aether-secondary/80 leading-relaxed mb-16 max-w-[45ch]">
            Constructed with intention. Designed to absorb light rather than reflect it. A statement of hostile isolation.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 border border-aether-border py-4 font-inter text-xs tracking-widest uppercase text-aether-secondary hover:text-white hover:border-white transition-all duration-1000"
              >
                Add To Cart
              </button>
            </div>
            {cartQuantity > 0 && (
              <button 
                onClick={handleGoToCart}
                className="w-full bg-white text-black py-4 font-inter text-xs tracking-widest uppercase hover:bg-aether-secondary transition-colors duration-700"
              >
                View Cart ({cartQuantity})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cinematic Add to Cart Overlay */}
      <div className="cart-overlay fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl opacity-0 pointer-events-none flex flex-col items-center justify-center">
        <h2 className="cart-overlay-text font-playfair text-6xl text-white translate-y-10 opacity-0 mb-4">Secured</h2>
        <p className="cart-overlay-text font-geist text-[9px] tracking-[0.2em] text-aether-secondary uppercase translate-y-10 opacity-0">
          The void expands
        </p>
      </div>
    </div>
  );
};
