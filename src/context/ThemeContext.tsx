import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/theme';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  colors: typeof COLORS.light;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  themeType: 'system',
  setThemeType: () => {},
  colors: COLORS.light,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');

  const activeTheme = themeType === 'system' 
    ? (systemColorScheme || 'light') 
    : themeType;

  const colors = COLORS[activeTheme];

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeType, setThemeType, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
