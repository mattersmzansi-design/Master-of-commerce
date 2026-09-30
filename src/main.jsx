import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* HelmetProvider lets any page swap the <title>, meta description and
        canonical URL for its route. See src/components/PageMeta.jsx. */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
