import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { ProjectProvider } from './contexts/ProjectProvider.jsx'
import { router } from './routes/router.js'

import 'react-toastify/dist/ReactToastify.css'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ProjectProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ToastContainer />
            </QueryClientProvider>
        </ProjectProvider>
    </StrictMode>,
)
