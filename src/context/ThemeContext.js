import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    backgroundColor: '#F0F4F8',
    textColor: '#333',
    primaryColor: '#2E7D32',
    secondaryColor: '#1B5E20',
    inputBackground: '#fff',
    placeholderColor: '#999',
    chartBackground: '#2E7D32',
    chartGradientFrom: '#1B5E20',
    chartGradientTo: '#4CAF50',
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};