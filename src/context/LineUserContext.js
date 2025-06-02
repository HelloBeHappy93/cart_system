import React, { createContext, useContext } from 'react';
import { useLineUser } from '../hooks/useLineUser';

const LineUserContext = createContext();

export const LineUserProvider = ({ children }) => {
  const lineUserData = useLineUser();
  
  return (
    <LineUserContext.Provider value={lineUserData}>
      {children}
    </LineUserContext.Provider>
  );
};

export const useLineUserContext = () => {
  const context = useContext(LineUserContext);
  if (!context) {
    throw new Error('useLineUserContext must be used within a LineUserProvider');
  }
  return context;
};