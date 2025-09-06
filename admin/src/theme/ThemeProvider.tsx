import React from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    sidebar?: {
      bg?: string;
    };
  }
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const mode = useSelector((s: RootState) => s.theme.mode);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: { default: '#0B1220', paper: '#111827' },
                primary: { main: '#60A5FA' },
                success: { main: '#10B981' },
                error: { main: '#EF4444' },
                warning: { main: '#F59E0B' },
                text: { primary: '#E5E7EB', secondary: '#9CA3AF' },
              }
            : {}),
        },
        typography: {
          fontFamily: 'Inter, Roboto, system-ui, Arial',
        },
        components: {
          MuiButton: { defaultProps: { size: 'small' } },
          MuiTextField: { defaultProps: { size: 'small' } },
          MuiFormControl: { defaultProps: { size: 'small' } },
          MuiSelect: { defaultProps: { size: 'small' } },
          MuiIconButton: { defaultProps: { size: 'small' } },
          MuiTable: { defaultProps: { size: 'small' } },
          MuiToolbar: { defaultProps: { variant: 'dense' } },
          MuiAppBar: {
            styleOverrides: {
              root: ({ theme }) => ({
                boxShadow: 'none',
                borderBottom: `1px solid ${theme.palette.divider}`,
                ...(theme.palette.mode === 'dark' && { backgroundColor: '#0F172A' }),
              }),
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: ({ theme }) => ({
                ...(theme.palette.mode === 'dark' && { backgroundColor: '#0F172A' }),
                width: 64,
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }) => ({
                ...(theme.palette.mode === 'dark' && {
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(255,255,255,0.06)',
                }),
                borderRadius: 10,
              }),
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: ({ theme }) => ({
                borderRight: `1px solid ${theme.palette.divider}`,
                '&:last-of-type': { borderRight: 'none' },
              }),
              head: ({ theme }) => ({
                fontWeight: 600,
                letterSpacing: 0.2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                ...(theme.palette.mode === 'dark'
                  ? { backgroundColor: '#111827', color: theme.palette.text.secondary }
                  : { backgroundColor: '#F3F4F6', color: '#374151' }),
              }),
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: ({ theme }) => ({
                ...(theme.palette.mode === 'dark' && {
                  '&:nth-of-type(even)': { backgroundColor: '#0B1220' },
                }),
              }),
            },
          },
        },
      }),
    [mode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
