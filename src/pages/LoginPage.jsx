import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/apiClient.js'

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/api/auth/login', { Username: username, Password: password })
      onLoginSuccess?.()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleViewScheduleClick() {
    alert('نمایش برنامه زمان‌بندی استاد: بعداً تکمیل می‌شود.')
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-12 text-center">
          <button className="btn btn-outline-primary" onClick={handleViewScheduleClick}>
            مشاهده برنامه زمان‌بندی استاد
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4 text-center">ورود به سامانه</h5>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">نام کاربری</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">رمز عبور</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'در حال ورود...' : 'ورود'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
            فقط از طریق HTTPS و با کوکی امن وارد شوید.
          </p>
        </div>
      </div>
    </div>
  )
}
