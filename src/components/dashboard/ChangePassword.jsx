import React, { useState } from 'react'
import api from '../../utils/apiClient.js'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  function validatePassword(password) {
    const lengthOk = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return lengthOk && hasUpper && hasLower && hasNumber
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError('رمز جدید و تکرار آن یکسان نیستند.')
      return
    }

    if (!validatePassword(newPassword)) {
      setError('رمز جدید باید حداقل ۸ کاراکتر و شامل حرف بزرگ، حرف کوچک و عدد باشد.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/api/auth/change-password', {
        CurrentPassword: currentPassword,
        NewPassword: newPassword
      })
      setSuccess(res?.message || 'رمز عبور با موفقیت تغییر کرد.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body">
          <h6 className="card-title text-center">تغییر رمز عبور</h6>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label">رمز فعلی</label>
              <input
                type="password"
                className="form-control form-control-sm"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">رمز جدید</label>
              <input
                type="password"
                className="form-control form-control-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">تکرار رمز جدید</label>
              <input
                type="password"
                className="form-control form-control-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="d-grid mt-3">
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? 'در حال ارسال...' : 'تغییر رمز عبور'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
