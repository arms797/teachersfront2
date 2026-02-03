import React, { useState, useEffect } from 'react'
import { useCenters } from '../../../context/CenterContext.jsx'
import api from '../../../utils/apiClient.js'

export default function EditScheduleModal({ item, term, onClose, onSave }) {
    const { centers } = useCenters()

    // فرم برنامه هفتگی
    const [form, setForm] = useState({ ...item })

    // ایمیل جداگانه
    const [emailValue, setEmailValue] = useState(item.email || '')
    const [emailSaving, setEmailSaving] = useState(false)
    const [emailError, setEmailError] = useState(null)
    const [emailSuccess, setEmailSuccess] = useState(null)
    const [initialEmail, setInitialEmail] = useState(item.email || '')
    // انتخاب‌های ساعات جایگزین و ممنوع
    const [altSelected, setAltSelected] = useState([])
    const [forbidSelected, setForbidSelected] = useState([])

    // نرمال‌سازی حروف و فاصله‌ها برای تطبیق‌ها
    const normalizePersian = (str) =>
        (str || '')
            .replace(/ي/g, 'ی')
            .replace(/ك/g, 'ک')
            .replace(/\s+/g, ' ')
            .trim()

    // نوع همکاری و گزینه‌های هر اسلات
    const cooperation = normalizePersian(item.cooperationType)
    const isFaculty = cooperation.includes('مدرس') && cooperation.includes('مدعو')
    const baseOptions = isFaculty
        ? ['امکان تدریس در دانشگاه', 'عدم حضور در دانشگاه']
        : ['حضور در مرکز', 'تدریس حضوری', 'تدریس الکترونیک', 'فعالیت پژوهشی', 'عدم حضور در دانشگاه','مشاوره دانشجویی']

    const getSlotOptions = (currentValue) => {
        const normalized = normalizePersian(currentValue)
        return baseOptions.includes(normalized) ? baseOptions : [normalized, ...baseOptions]
    }

    // تعریف اسلات‌های ساعت
    const hourSlots = [
        { label: '08-10 (A)', value: 'A', text: '8 الی 10' },
        { label: '10-12 (B)', value: 'B', text: '10 الی 12' },
        { label: '12-14 (C)', value: 'C', text: '12 الی 14' },
        { label: '14-16 (D)', value: 'D', text: '14 الی 16' },
        { label: '16-18 (E)', value: 'E', text: '16 الی 18' },
    ]

    // پارس اولیه ساعات جایگزین/ممنوع از متن موجود آیتم
    useEffect(() => {
        const parseHours = (str) => {
            return hourSlots
                .filter(h => str?.includes(h.text))
                .map(h => h.value)
        }
        setAltSelected(parseHours(item.alternativeHours))
        setForbidSelected(parseHours(item.forbiddenHours))
    }, [item])

    // هندل تغییر چک‌باکس‌ها
    const handleCheckboxChange = (type, value) => {
        const updater = type === 'alt' ? setAltSelected : setForbidSelected
        const current = type === 'alt' ? altSelected : forbidSelected
        updater(current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value])
    }

    // ذخیره ایمیل با API جدا
    const handleEmailSave = async () => {
        setEmailError(null)
        setEmailSuccess(null)

        // ولیدیشن ساده ایمیل سمت کلاینت
        const email = emailValue.trim()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (email && !emailRegex.test(email)) {
            setEmailError('فرمت ایمیل معتبر نیست.')
            return
        }
        // اگر ایمیل تغییر نکرده باشد، API صدا زده نمی‌شود
        if (email === initialEmail.trim()) {
            setEmailSuccess('ایمیل تغییری نکرده است.')
            return
        }
        try {
            setEmailSaving(true)
            await api.put(`/api/teachers/updateEmail/${item.teacherCode}`, { email: email })
            setInitialEmail(email)
            onSave({ ...item, email: email })
            setEmailSuccess('ایمیل با موفقیت ذخیره شد.')
            // به‌روزرسانی state بیرونی اگر لازم است
            onSave({ ...item, email })
        } catch (err) {
            // شفافیت کامل ارور
            console.error('Email save error:', err)
            setEmailError(err?.response?.data?.message || err?.message || 'خطا در ذخیره ایمیل')
        } finally {
            setEmailSaving(false)
        }
    }

    // تغییر فیلدهای فرم برنامه
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    // ذخیره برنامه هفتگی
    const handleSubmit = async () => {
        const normalizedDay = normalizePersian(item.dayOfWeek || '')
        const selectedA = normalizePersian(form.a || '')
        const isFacultyLike = cooperation.includes('هیات علمی') || cooperation.includes('عضو هیات علمی')

        // محدودیت سه‌شنبه 08-10
        if (
            normalizedDay === 'سه شنبه' &&
            isFacultyLike &&
            (selectedA === 'تدریس حضوری' || selectedA === 'تدریس الکترونیک')
        ) {
            alert('در روز سه‌شنبه ساعت 10-08 امکان تدریس حضوری یا الکترونیک وجود ندارد.')
            return
        }

        // تبدیل انتخاب‌های چک‌باکس به متن
        const altText = hourSlots.filter(h => altSelected.includes(h.value)).map(h => h.text).join(' , ')
        const forbidText = hourSlots.filter(h => forbidSelected.includes(h.value)).map(h => h.text).join(' , ')

        const payload = {
            ...form,
            alternativeHours: altText,
            forbiddenHours: forbidText
        }

        try {
            await api.put(`/api/WeeklySchedule/updateSchedule/${item.id}`, payload)
            onSave(payload)
            onClose()
        } catch (err) {
            console.error('Schedule save error:', err)
            alert(err?.response?.data?.message || err?.message || 'خطا در ذخیره تغییرات')
        }
    }

    return (
        <div className="fullscreen-overlay">
            <div className="container py-4">
                {/* هدر مودال */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-primary">ویرایش برنامه روز {item.dayOfWeek}</h5>
                    <button className="btn btn-danger" onClick={onClose}>بستن</button>
                </div>

                {/* ایمیل */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <p className="form-text fw-bold text-secondary mb-2">
                            لطفا در صورتی که ایمیل شما ثبت نشده یا می بایست تغییر کند،
                            ایمیل صحیح خود را وارد و ثبت نمایید
                        </p>
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                value={emailValue}
                                onChange={e => setEmailValue(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-success"
                                onClick={handleEmailSave}
                                disabled={emailSaving}
                            >
                                {emailSaving ? 'در حال ذخیره...' : '💾 ذخیره ایمیل'}
                            </button>
                        </div>
                        {emailError && <div className="invalid-feedback d-block">{emailError}</div>}
                        {emailSuccess && <div className="text-success mt-1">{emailSuccess}</div>}
                    </div>
                </div>


                {/* مرکز */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <label className="form-label">مرکز</label>
                        <select
                            className="form-select"
                            value={form.center}
                            onChange={e => handleChange('center', e.target.value)}
                        >
                            {centers.map(c => (
                                <option key={c.centerCode} value={c.centerCode}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ساعات a تا e */}
                <div className="row mb-3">
                    {['a', 'b', 'c', 'd', 'e'].map((slot, i) => (
                        <div className="col-md-2" key={slot}>
                            <label className="form-label">
                                {['08-10 (A)', '10-12 (B)', '12-14 (C)', '14-16 (D)', '16-18 (E)'][i]}
                            </label>
                            <select
                                className="form-select"
                                value={form[slot] || ''}
                                onChange={e => handleChange(slot, e.target.value)}
                            >
                                <option value="">-- انتخاب --</option>
                                {getSlotOptions(form[slot]).map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* توضیحات */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <label className="form-label">توضیحات</label>
                        <textarea
                            className="form-control"
                            value={form.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </div>
                </div>

                {/* ساعات جایگزین و ممنوع */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">ساعات جایگزین</label>
                        <input
                            className="form-control mb-2"
                            value={hourSlots.filter(h => altSelected.includes(h.value)).map(h => h.text).join(' , ')}
                            readOnly
                        />
                        <div className="d-flex flex-wrap gap-2">
                            {hourSlots.map(h => (
                                <div key={h.value} className="form-check form-check-inline">
                                    <input
                                        className="form-check-input custom-checkbox"
                                        type="checkbox"
                                        checked={altSelected.includes(h.value)}
                                        onChange={() => handleCheckboxChange('alt', h.value)}
                                        id={`alt-${h.value}`}
                                    />
                                    <label className="form-check-label" htmlFor={`alt-${h.value}`}>
                                        {h.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">ساعات ممنوع</label>
                        <input
                            className="form-control mb-2"
                            value={hourSlots.filter(h => forbidSelected.includes(h.value)).map(h => h.text).join(' , ')}
                            readOnly
                        />
                        <div className="d-flex flex-wrap gap-2">
                            {hourSlots.map(h => (
                                <div key={h.value} className="form-check form-check-inline">
                                    <input
                                        className="form-check-input custom-checkbox"
                                        type="checkbox"
                                        checked={forbidSelected.includes(h.value)}
                                        onChange={() => handleCheckboxChange('forbid', h.value)}
                                        id={`forbid-${h.value}`}
                                    />
                                    <label className="form-check-label" htmlFor={`forbid-${h.value}`}>
                                        {h.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* دکمه‌ها */}
                <div className="text-end mt-4">
                    <button className="btn btn-success me-2" onClick={handleSubmit}>
                        💾 ذخیره تغییرات
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        ❌ انصراف
                    </button>
                </div>
            </div>
        </div>
    )
}
