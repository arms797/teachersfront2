import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // اگر نیاز شد، می‌توانیم چک وضعیت از بک‌اند بگیریم؛ فعلاً از state استفاده می‌کنیم.
  useEffect(() => {
    // ساده: اگر کوکی auth ست شده، کاربر را احراز می‌کنیم
    const hasAuthCookie = document.cookie.split('; ').some(c => c.startsWith('tb2_auth='))
    setIsAuthenticated(hasAuthCookie)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={() => setIsAuthenticated(false)} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
