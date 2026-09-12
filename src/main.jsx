import React from 'react'
import { createRoot } from 'react-dom/client'
import '@material-design-icons/font/index.css'
import './styles/base.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
