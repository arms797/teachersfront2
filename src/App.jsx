import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home.jsx'
import { UserProvider } from './context/UserContext.jsx'

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const hasAuthCookie = document.cookie.split('; ').some(c => c.startsWith('tb2_auth='))
    setIsAuthenticated(hasAuthCookie)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* صفحه پیش‌فرض */}
        <Route path="/" element={<Home />} />

        {/* صفحه لاگین */}
        <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />} />

        {/* داشبورد محافظت‌شده */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={() => setIsAuthenticated(false)} />
            </ProtectedRoute>
          }
        />

        {/* مسیرهای ناشناخته → هدایت به صفحه اصلی */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
