import React, { useState, useEffect } from 'react'
import api from '../../../utils/apiClient.js'
import { useCenters } from '../../../context/CenterContext.jsx'

export default function EditTeacherForm({ teacher, onSuccess }) {
    const [form, setForm] = useState({ ...teacher })
    const { centers } = useCenters()

    useEffect(() => {
        setForm({ ...teacher })
    }, [teacher])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'cooperationType' ? { academicRank: '' } : {})
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (!form.code || !form.fname || !form.lname || !form.cooperationType || !form.academicRank) {
                alert('لطفاً تمام فیلدهای ضروری را تکمیل کنید')
                return
            }

            await api.put(`/api/teachers/${form.id}`, form)
            onSuccess()
        } catch (err) {
            alert('خطا در ویرایش استاد')
            console.error(err)
        }
    }

    const academicRankOptions =
        form.cooperationType === 'عضو هیات علمی'
            ? ['استادیار', 'دانشیار', 'استاد', 'مربی', 'دستیار علمی']
            : form.cooperationType === 'مدرس مدعو'
                ? ['دکتری', 'کارشناسی ارشد']
                : []

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col-md-4">
                    <label className="form-label">کد استادی</label>
                    <input name="code" className="form-control" value={form.code} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">نام</label>
                    <input name="fname" className="form-control" value={form.fname} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">نام خانوادگی</label>
                    <input name="lname" className="form-control" value={form.lname} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">کد ملی</label>
                    <input name="nationalCode" className="form-control" value={form.nationalCode} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">ایمیل</label>
                    <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">شماره موبایل</label>
                    <input name="mobile" className="form-control" value={form.mobile} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">رشته</label>
                    <input name="fieldOfStudy" className="form-control" value={form.fieldOfStudy} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">مرکز</label>
                    <select
                        name="center"
                        className="form-select"
                        value={form.center}
                        onChange={handleChange}
                    >
                        <option value="">انتخاب مرکز</option>
                        {centers.map(c => (
                            <option key={c.centerCode} value={c.title}>
                                {c.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">نوع همکاری</label>
                    <select name="cooperationType" className="form-select" value={form.cooperationType} onChange={handleChange}>
                        <option value="">انتخاب نوع همکاری</option>
                        <option value="عضو هیات علمی">عضو هیات علمی</option>
                        <option value="مدرس مدعو">مدرس مدعو</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">مرتبه علمی / مدرک تحصیلی</label>
                    <select
                        name="academicRank"
                        className="form-select"
                        value={form.academicRank}
                        onChange={handleChange}
                        disabled={!form.cooperationType}
                    >
                        <option value="">انتخاب مرتبه / مدرک</option>
                        {academicRankOptions.map((rank, i) => (
                            <option key={i} value={rank}>{rank}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">سمت اجرایی (اختیاری)</label>
                    <input name="executivePosition" className="form-control" value={form.executivePosition} onChange={handleChange} />
                </div>
            </div>

            <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary">✏️ ویرایش استاد</button>
            </div>
        </form>
    )
}
