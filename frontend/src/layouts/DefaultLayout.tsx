import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { themeContext } from '../context/theme/themeContex';
import TodoHeader from '../components/header/Header';
import { IContentLayoutProps } from './types/types';

const DefaultLayout: React.FC<IContentLayoutProps> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useContext(themeContext);

  const heroBackgroundClass = isDarkMode ? 'hero-background--dark' : 'hero-background--light';

  const pageBackgroundClass = isDarkMode ? 'page-background--dark' : 'page-background--light';

  return (
    <Box className={`${pageBackgroundClass} page-background page-background-transition`}>
      <TodoHeader
        bgClass={`hero-background ${heroBackgroundClass} background-transition hero-background-animate`}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      {children}
    </Box>
  );
};

export default DefaultLayout;
