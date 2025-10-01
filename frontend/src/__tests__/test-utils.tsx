import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NotificationsProvider } from '@/notifications/NotificationsProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme(); // si tienes ThemeModeProvider propio, úsalo aquí

const AllProviders = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <NotificationsProvider>{children}</NotificationsProvider>
  </ThemeProvider>
);

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
