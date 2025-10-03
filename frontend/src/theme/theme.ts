import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import { TypographyVariantsOptions } from '@mui/material/styles/createTypography';


const typography: TypographyVariantsOptions = {
  fontFamily: 'Open Sans, Montserrat, sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 400,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05rem',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 300,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
};

const standardInputOverrides = {
  defaultProps: {
    disableUnderline: true,
  },
  styleOverrides: {
    input: {
      fontSize: '1.05rem',
      fontWeight: 500,
    },
  },
};

const baseLightTheme = createTheme({
  typography,
  shape: {
    borderRadius: 18,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#7C5CFF',
      light: '#9C7DFF',
      dark: '#5E3AE0',
      contrastText: '#F5F6FF',
    },
    secondary: {
      main: '#5D9BFF',
      light: '#8CB8FF',
      dark: '#356FD6',
      contrastText: '#0D1025',
    },
    info: {
      main: '#4E6AF7',
      light: '#86A0FF',
      dark: '#2F47C5',
      contrastText: '#F5F6FF',
    },
    warning: {
      main: '#F5A524',
      light: '#F8C05B',
      dark: '#B37318',
      contrastText: '#1F1F2B',
    },
    error: {
      main: '#F2757C',
      light: '#F8A5AA',
      dark: '#C13B44',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4ECB8C',
      light: '#74DCAA',
      dark: '#2E9C69',
      contrastText: '#0D1025',
    },
    background: {
      default: '#EEF0FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1B2E',
      secondary: '#5F5B78',
      disabled: '#B3B1C8',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiInput: standardInputOverrides,
  },
});

const baseDarkTheme = createTheme({
  typography,
  shape: {
    borderRadius: 18,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#9C88FF',
      light: '#B7A9FF',
      dark: '#6A55D6',
      contrastText: '#100D20',
    },
    secondary: {
      main: '#5D9BFF',
      light: '#8CB8FF',
      dark: '#356FD6',
      contrastText: '#080B1A',
    },
    success: {
      main: '#4ECB8C',
      contrastText: '#0D1025',
    },
    error: {
      main: '#F2757C',
      contrastText: '#0D1025',
    },
    warning: {
      main: '#F5A524',
      contrastText: '#0D1025',
    },
    info: {
      main: '#6AA8FF',
      contrastText: '#0D1025',
    },
    background: {
      default: '#141329',
      paper: '#1B1B33',
    },
    text: {
      primary: '#F1F2FF',
      secondary: '#C7C4DE',
      disabled: '#6F6C86',
    },
    divider: '#2E2C45',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiInput: standardInputOverrides,
  },
});

const lightTheme = responsiveFontSizes(baseLightTheme);
const darkTheme = responsiveFontSizes(baseDarkTheme);

export { lightTheme, darkTheme };
