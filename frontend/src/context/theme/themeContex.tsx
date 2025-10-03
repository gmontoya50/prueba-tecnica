import React, { createContext, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from '../../theme/theme';
import { IThemeContextType, IThemeContextProps } from './types/types';

const themeContext = createContext<IThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

const ThemeProviderContext: React.FC<IThemeContextProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <themeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </themeContext.Provider>
  );
};

export { themeContext, ThemeProviderContext };
