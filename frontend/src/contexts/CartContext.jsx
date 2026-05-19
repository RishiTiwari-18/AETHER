import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAssistant } from './AssistantContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addMessage } = useAssistant();
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0) + 1;
    
    if (totalQuantity === 1) addMessage("Controlled restraint.");
    else if (totalQuantity === 3) addMessage("Escalation detected.");
    else if (totalQuantity >= 5) addMessage("This appears emotionally motivated.");
  }, [cartItems, addMessage]);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    addMessage("Abandonment noted.");
  }, [addMessage]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,
      cartTotal,
      cartQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
