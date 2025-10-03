import { ReactNode } from 'react';

export interface IThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface IThemeContextProps {
  children: ReactNode;
}
