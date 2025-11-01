import React, { useState } from 'react'
import api from '../../../utils/apiClient.js'
import { useCenters } from '../../../context/CenterContext.jsx'

export default function AddTeacherForm({ onSuccess }) {
    const [form, setForm] = useState({
        code: '',
        fname: '',
        lname: '',
        email: '',
        mobile: '',
        fieldOfStudy: '',
        center: '',
        cooperationType: '',
        academicRank: '',
        executivePosition: '',
        nationalCode: '' // ✅ فیلد جدید
    })
    const { centers } = useCenters()

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

            console.log('📦 داده ارسالی به سرور:', JSON.stringify(form, null, 2))
            await api.post('/api/teachers', form)
            onSuccess()
        } catch (err) {
            alert('خطا در ثبت استاد')
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
                    <input name="nationalCode" className="form-control" placeholder="کد ملی" value={form.nationalCode} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="email" type="email" className="form-control" placeholder="ایمیل" value={form.email} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="mobile" className="form-control" placeholder="شماره موبایل" value={form.mobile} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <input name="fieldOfStudy" className="form-control" placeholder="رشته" value={form.fieldOfStudy} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                    <select
                        name="center"
                        className="form-select"
                        value={form.center}
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

                <div className="col-md-4">
                    <select name="cooperationType" className="form-select" value={form.cooperationType} onChange={handleChange}>
                        <option value="">نوع همکاری</option>
                        <option value="عضو هیات علمی">عضو هیات علمی</option>
                        <option value="مدرس مدعو">مدرس مدعو</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        name="academicRank"
                        className="form-select"
                        value={form.academicRank}
                        onChange={handleChange}
                        disabled={!form.cooperationType}
                    >
                        <option value="">مرتبه علمی / مدرک تحصیلی</option>
                        {academicRankOptions.map((rank, i) => (
                            <option key={i} value={rank}>{rank}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <input name="executivePosition" className="form-control" placeholder="سمت اجرایی (اختیاری)" value={form.executivePosition} onChange={handleChange} />
                </div>

            </div>

            <div className="mt-3 text-end">
                <button type="submit" className="btn btn-success">✅ ثبت استاد</button>
            </div>
        </form>
    )
}
