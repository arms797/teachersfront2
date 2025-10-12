import React, { useState } from 'react'
import api from '../../utils/apiClient.js'

export default function UpdateContact() {
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    function validateMobile(m) {
        return /^09\d{9}$/.test(m)
    }

    function validateEmail(e) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (mobile && !validateMobile(mobile)) {
            setError('شماره موبایل معتبر نیست (باید با 09 شروع شود و 11 رقم باشد).')
            return
        }

        if (email && !validateEmail(email)) {
            setError('ایمیل معتبر نیست.')
            return
        }

        if (!mobile && !email) {
            setError('حداقل یکی از فیلدها را وارد کنید.')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/api/auth/update-contact', {
                Mobile: mobile || null,
                Email: email || null
            })
            setSuccess(res?.message || 'اطلاعات تماس با موفقیت بروزرسانی شد.')
            setMobile('')
            setEmail('')
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
                    <h6 className="card-title text-center">تغییر ایمیل و شماره موبایل</h6>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">شماره موبایل جدید</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="مثلاً 09123456789"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label">ایمیل جدید</label>
                            <input
                                type="email"
                                className="form-control form-control-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="مثلاً example@email.com"
                            />
                        </div>

                        <div className="d-grid mt-3">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                                {loading ? 'در حال ارسال...' : 'بروزرسانی اطلاعات'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
