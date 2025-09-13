import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { store } from './store'
import { useAppTheme } from './theme'
import './i18n'

const queryClient = new QueryClient()

function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

function RootProviders() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </AppThemeProvider>
    </Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootProviders />
  </StrictMode>,
)
