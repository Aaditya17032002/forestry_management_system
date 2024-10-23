import React, { createContext, useState, useContext } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const forestryTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',
    accent: '#81C784',
    background: '#E8F5E9',
    text: '#1B5E20',
    surface: '#C8E6C9',
  },
};

const emergencyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#D32F2F',
    accent: '#FF8A80',
    background: '#FFEBEE',
    text: '#B71C1C',
    surface: '#FFCDD2',
  },
};

const adminTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    accent: '#64B5F6',
    background: '#E3F2FD',
    text: '#0D47A1',
    surface: '#BBDEFB',
  },
};

const ThemeContext = createContext({
  theme: forestryTheme,
  setTheme: (theme) => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(forestryTheme);

  const changeTheme = (persona) => {
    switch (persona) {
      case 'ForestryManager':
      case 'FieldOperative':
      case 'GISSpecialist':
        setTheme(forestryTheme);
        break;
      case 'EmergencyResponse':
        setTheme(emergencyTheme);
        break;
      case 'Admin':
        setTheme(adminTheme);
        break;
      default:
        setTheme(forestryTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};