import React from 'react'
import { createRoot } from 'react-dom/client'
import '@material-design-icons/font/index.css'
import './styles/base.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
