import React from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap CSS (بدون JS)
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/bootstrap-rtl.css'
import './styles/global.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
