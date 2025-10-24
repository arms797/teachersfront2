import React, { useState } from 'react'
import api from '../../../utils/apiClient.js'

export default function AddTeacherForm({ onSuccess }) {
    const [form, setForm] = useState({
        code: '',
        fname: '',
        lname: '',
        mobile: '',
        fieldOfStudy: '',
        center: '',
        cooperationType: '',
        degree: '',
        academicRank: ''
    })

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await api.post('/api/teachers', form)
            onSuccess()
        } catch (err) {
            alert('خطا در ثبت استاد')
            console.error(err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-2">
                <div className="col-md-4">
                    <input name="code" className="form-control" placeholder="کد استادی" value={form.code} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="fname" className="form-control" placeholder="نام" value={form.fname} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="lname" className="form-control" placeholder="نام خانوادگی" value={form.lname} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="mobile" className="form-control" placeholder="شماره موبایل" value={form.mobile} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="fieldOfStudy" className="form-control" placeholder="رشته" value={form.fieldOfStudy} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="center" className="form-control" placeholder="مرکز" value={form.center} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <select name="cooperationType" className="form-select" value={form.cooperationType} onChange={handleChange}>
                        <option value="">نوع همکاری</option>
                        <option value="عضو هیات علمی">عضو هیات علمی</option>
                        <option value="مدرس مدعو">مدرس مدعو</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <input name="academicRank" className="form-control" placeholder="مرتبه علمی" value={form.academicRank} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="degree" className="form-control" placeholder="مدرک تحصیلی" value={form.degree} onChange={handleChange} />
                </div>
            </div>
            <div className="mt-3 text-end">
                <button type="submit" className="btn btn-success">✅ ثبت استاد</button>
            </div>
        </form>
    )
}
