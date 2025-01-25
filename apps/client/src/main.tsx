import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App.tsx'
import './index.css'
import '@fontsource/roboto'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_, query) => {
      if (query.queryKey[0] !== 'check-auth') {
        queryClient.invalidateQueries({ queryKey: ['check-auth'] })
      }
    },
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>,
)
