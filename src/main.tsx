import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" toastOptions={{
                style: { background: '#121216', color: '#fff', border: '1px solid #27272a' },
                success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } }
            }} />
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
)
