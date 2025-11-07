import React, { useState } from 'react'
import api from '../../../utils/apiClient.js'

export default function EditTermModal({ termInfo, onClose, onSave }) {
    const [form, setForm] = useState({ ...termInfo })

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        try {
            await api.put(`/api/teachers/updateTeacherTerm/${form.id}`, form)
            onSave(form)
            onClose()
        } catch (err) {
            alert('خطا در ذخیره اطلاعات ترم')
        }
    }

    return (
        <div className="fullscreen-overlay">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-primary">ویرایش اطلاعات ترم استاد</h5>
                    <button className="btn btn-danger" onClick={onClose}>بستن</button>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label className="form-label">تدریس همجوار</label>
                        <select
                            className="form-select"
                            value={form.isNeighborTeaching ? 'true' : 'false'}
                            onChange={e => handleChange('isNeighborTeaching', e.target.value === 'true')}
                        >
                            <option value="false">خیر</option>
                            <option value="true">بله</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">دلایل تدریس همجوار</label>
                        <input
                            className="form-control"
                            value={form.neighborTeaching || ''}
                            onChange={e => handleChange('neighborTeaching', e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">مراکز همجوار</label>
                        <input
                            className="form-control"
                            value={form.neighborCenters || ''}
                            onChange={e => handleChange('neighborCenters', e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">پیشنهاد</label>
                        <input
                            className="form-control"
                            value={form.suggestion || ''}
                            onChange={e => handleChange('suggestion', e.target.value)}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label className="form-label">ویدئو پروژکتور</label>
                        <select
                            className="form-select"
                            value={form.projector ? 'true' : 'false'}
                            onChange={e => handleChange('projector', e.target.value === 'true')}
                        >
                            <option value="false">ندارد</option>
                            <option value="true">دارد</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">دو وایت‌برده</label>
                        <select
                            className="form-select"
                            value={form.whiteboard2 ? 'true' : 'false'}
                            onChange={e => handleChange('whiteboard2', e.target.value === 'true')}
                        >
                            <option value="false">ندارد</option>
                            <option value="true">دارد</option>
                        </select>
                    </div>
                </div>

                <div className="text-end mt-4">
                    <button className="btn btn-success me-2" onClick={handleSubmit}>
                        💾 ذخیره اطلاعات ترم
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        ❌ انصراف
                    </button>
                </div>
            </div>
        </div>
    )
}
