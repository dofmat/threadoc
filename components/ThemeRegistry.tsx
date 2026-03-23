'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const theme = createTheme({
  palette: {
    primary: { main: '#0c7bdc' },
    secondary: { main: '#062e65' },
    background: { default: '#eef4fb', paper: '#ffffff' },
    text: { primary: '#122033', secondary: '#5f7188' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Segoe UI", "Trebuchet MS", sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.03em' },
    h4: { fontWeight: 800, letterSpacing: '-0.03em' },
    h5: { fontWeight: 750 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
