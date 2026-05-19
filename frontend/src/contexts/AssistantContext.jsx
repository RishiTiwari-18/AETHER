import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AssistantContext = createContext(null);

export const AssistantProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPassedWarning, setHasPassedWarning] = useState(false);
  const [cursorRemoved, setCursorRemoved] = useState(false);

  const addMessage = useCallback((msg, duration = 4000) => {
    const id = Date.now();
    setMessages([{ id, text: msg }]);
    setIsVisible(true);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
      setIsVisible(false);
    }, duration);
  }, []);

  const triggerCursorRemoval = useCallback(() => {
    if (cursorRemoved) return;
    setCursorRemoved(true);
    addMessage("We have temporarily removed your cursor to encourage mindfulness.", 6000);
    setTimeout(() => {
      setCursorRemoved(false);
    }, 6000);
  }, [cursorRemoved, addMessage]);

  return (
    <AssistantContext.Provider value={{ 
      messages, 
      isVisible, 
      addMessage, 
      hasPassedWarning, 
      setHasPassedWarning,
      cursorRemoved,
      triggerCursorRemoval
    }}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => useContext(AssistantContext);
