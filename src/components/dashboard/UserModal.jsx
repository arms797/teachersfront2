import React, { useState, useEffect } from 'react'
import api from '../../utils/apiClient.js'
import { useCenters } from '../../context/CenterContext.jsx'

export default function UserModal({ mode, user, onClose, onSuccess }) {
    const isEdit = mode === 'edit'

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        nationalCode: '',
        mobile: '',
        email: '',
        centerCode: '',
        username: '',
        isActive: true
    })

    const [message, setMessage] = useState(null)
    const { centers } = useCenters()

    useEffect(() => {
        if (isEdit && user) {
            setForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                nationalCode: user.nationalCode || '',
                mobile: user.mobile || '',
                email: user.email || '',
                centerCode: user.centerCode || '',
                username: user.username || '',
                isActive: user.isActive ?? true
            })
        }
    }, [isEdit, user])

    function handleChange(e) {
        const { name, value, type, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = {
            ...form,
            password: form.nationalCode || 'Spnu123'
        }
        //console.log('ارسال به API:', payload)
        try {
            if (isEdit) {
                await api.put(`/api/users/${user.id}`, payload)
                setMessage('ویرایش با موفقیت انجام شد')
            } else {
                await api.post('/api/users', payload)
                setMessage('کاربر جدید افزوده شد')
            }
            onSuccess?.()
            onClose()
        } catch (err) {
            setMessage(err.message || 'خطا در ذخیره اطلاعات')
        }
    }

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: '#00000066' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content text-end" style={{ direction: 'rtl' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {message && <div className="alert alert-info">{message}</div>}

                        <form onSubmit={handleSubmit} className="row g-3 align-item-center">
                            <div className="col-md-6">
                                <label className="form-label">نام</label>
                                <input type="text" name="firstName" className="form-control" value={form.firstName} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">نام خانوادگی</label>
                                <input type="text" name="lastName" className="form-control" value={form.lastName} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">کد ملی</label>
                                <input type="text" name="nationalCode" className="form-control" value={form.nationalCode} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">موبایل</label>
                                <input type="text" name="mobile" className="form-control" value={form.mobile} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">ایمیل</label>
                                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">مرکز</label>
                                <select
                                    name="centerCode"
                                    className="form-select"
                                    value={form.centerCode}
                                    onChange={handleChange}
                                >
                                    <option value="">انتخاب مرکز</option>
                                    {centers.map(c => (
                                        <option key={c.centerCode} value={c.centerCode}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">نام کاربری</label>
                                <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                                <input type="checkbox" name="isActive" className="form-check-input ms-2" checked={form.isActive} onChange={handleChange} />
                                <label className="form-check-label">فعال باشد</label>
                            </div>

                            <div className="col-12 d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">ذخیره</button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>انصراف</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
