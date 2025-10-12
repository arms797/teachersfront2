import React, { useState } from 'react'
import api from '../../utils/apiClient.js'

export default function UserForm({ mode, user, onBack, onSuccess }) {
    const [form, setForm] = useState({
        username: user?.username || '',
        fullName: user?.fullName || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        centerId: user?.centerId || '',
        password: ''
    })
    const [message, setMessage] = useState(null)
    const isEdit = mode === 'edit'

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (isEdit) {
                await api.put(`/api/users/${user.id}`, form)
                setMessage('کاربر با موفقیت ویرایش شد')
            } else {
                await api.post('/api/users', form)
                setMessage('کاربر جدید با موفقیت افزوده شد')
            }
            onSuccess?.()
            onBack()
        } catch (err) {
            setMessage(err.message || 'خطا در ذخیره اطلاعات')
        }
    }

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title">{isEdit ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}</h6>
                {message && <div className="alert alert-info">{message}</div>}

                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">نام کاربری</label>
                        <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">نام کامل</label>
                        <input type="text" name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">ایمیل</label>
                        <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">موبایل</label>
                        <input type="text" name="mobile" className="form-control" value={form.mobile} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">مرکز</label>
                        <input type="text" name="centerId" className="form-control" value={form.centerId} onChange={handleChange} />
                    </div>
                    {!isEdit && (
                        <div className="col-md-6">
                            <label className="form-label">رمز عبور</label>
                            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="col-12 d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                            ذخیره
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onBack}>
                            بازگشت
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
