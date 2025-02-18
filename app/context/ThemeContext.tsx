import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../../src/theme/colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  useBlackout: boolean;
  toggleBlackout: () => void;
  colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme as Theme || 'light');
  const [useBlackout, setUseBlackout] = useState(false);

  useEffect(() => {
    setTheme(systemColorScheme as Theme || 'light');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleBlackout = () => {
    setUseBlackout((prev) => !prev);
  };

  const getColors = () => {
    if (theme === 'light') return lightColors;
    return useBlackout ? { ...darkColors, background: '#000000' } : darkColors;
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme,
      useBlackout,
      toggleBlackout,
      colors: getColors()
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;