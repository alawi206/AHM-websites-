import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from './lib/router'
import { App } from './App'
import './styles/index.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages are hydrated; the dev server renders from scratch.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)

;(window as Window & { __sofraReady?: boolean }).__sofraReady = true
