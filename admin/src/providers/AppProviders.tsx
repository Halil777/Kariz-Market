import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/i18n/setup';

const queryClient = new QueryClient();

export const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

