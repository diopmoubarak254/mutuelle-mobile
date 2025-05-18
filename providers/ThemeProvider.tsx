import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeType>('system');
  const systemColorScheme = useColorScheme();

  // Determine if dark mode should be applied
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && systemColorScheme === 'dark');

  // Apply theme to status bar and other elements
  useEffect(() => {
    // You could add more theme logic here if needed
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}