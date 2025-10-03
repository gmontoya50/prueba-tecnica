import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { ThemeProviderContext } from './context/theme/themeContex';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element with id "root" not found');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ThemeProviderContext>
      <App />
    </ThemeProviderContext>
  </React.StrictMode>
);
