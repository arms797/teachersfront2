import React, { useState, useEffect } from 'react'
import { useCenters } from '../../../context/CenterContext.jsx'
import api from '../../../utils/apiClient.js'

export default function EditScheduleModal({ item, term, onClose, onSave }) {
    const { centers } = useCenters()
    const [form, setForm] = useState({ ...item })

    const normalizePersian = (str) =>
        (str || '')
            .replace(/ي/g, 'ی')
            .replace(/ك/g, 'ک')
            .replace(/\s+/g, ' ')
            .trim()

    const cooperation = normalizePersian(item.cooperationType)
    const isFaculty = cooperation.includes('مدرس') && cooperation.includes('مدعو')
    const baseOptions = isFaculty
        ? ['امکان تدریس در دانشگاه', 'عدم حضور در دانشگاه']
        : ['حضور در مرکز', 'تدریس حضوری', 'تدریس الکترونیک', 'فعالیت پژوهشی', 'عدم حضور در دانشگاه']


    const getSlotOptions = (currentValue) => {
        const normalized = normalizePersian(currentValue)
        return baseOptions.includes(normalized) ? baseOptions : [normalized, ...baseOptions]
    }

    const hourSlots = [
        { label: '08-10 (A)', value: 'A', text: '8 الی 10' },
        { label: '10-12 (B)', value: 'B', text: '10 الی 12' },
        { label: '12-14 (C)', value: 'C', text: '12 الی 14' },
        { label: '14-16 (D)', value: 'D', text: '14 الی 16' },
        { label: '16-18 (E)', value: 'E', text: '16 الی 18' },
    ]

    const [altSelected, setAltSelected] = useState([])
    const [forbidSelected, setForbidSelected] = useState([])

    useEffect(() => {
        const parseHours = (str) => {
            return hourSlots
                .filter(h => str?.includes(h.text))
                .map(h => h.value)
        }
        setAltSelected(parseHours(item.alternativeHours))
        setForbidSelected(parseHours(item.forbiddenHours))
    }, [item])

    const handleCheckboxChange = (type, value) => {
        const updater = type === 'alt' ? setAltSelected : setForbidSelected
        const current = type === 'alt' ? altSelected : forbidSelected
        updater(current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value])
    }

    const handleSubmit = async () => {
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
            alert('خطا در ذخیره تغییرات')
        }
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="fullscreen-overlay">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-primary">ویرایش برنامه روز {item.dayOfWeek}</h5>
                    <button className="btn btn-danger" onClick={onClose}>بستن</button>
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
                            <label className="form-label">{['08-10 (A)', '10-12 (B)', '12-14 (C)', '14-16 (D)', '16-18 (E)'][i]}</label>
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
                                        className="form-check-input"
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
                                        className="form-check-input"
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
