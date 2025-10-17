import React, { useState, useEffect } from 'react'
import api from '../../../utils/apiClient.js'

export default function RoleModal({ role, onClose, onSuccess }) {
    const isEdit = !!role
    const [form, setForm] = useState({ title: '', description: '' })

    useEffect(() => {
        if (isEdit) {
            setForm({ title: role.title, description: role.description })
        }
    }, [isEdit, role])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (isEdit) {
                await api.put(`/api/roles/${role.id}`, form)
            } else {
                await api.post('/api/roles', form)
            }
            onSuccess()
            onClose()
        } catch (err) {
            console.error('خطا در ذخیره نقش:', err)
        }
    }

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: '#00000066' }}>
            <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content text-end" style={{ direction: 'rtl' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'ویرایش نقش' : 'افزودن نقش جدید'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-12">
                                <label className="form-label">عنوان نقش</label>
                                <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required />
                            </div>
                            <div className="col-12">
                                <label className="form-label">توضیحات</label>
                                <textarea name="description" className="form-control" value={form.description} onChange={handleChange} />
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
