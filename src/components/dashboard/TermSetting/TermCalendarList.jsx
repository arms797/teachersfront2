import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'


export default function TermCalendarList() {
    const [terms, setTerms] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)
    const [form, setForm] = useState({ term: '', title: '', start: '', end: '' })
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        fetchTerms()
    }, [])

    async function fetchTerms() {
        setLoading(true)
        try {
            const res = await api.get('/api/TermCalender')
            setTerms(res)
        } catch (err) {
            setMessage('خطا در دریافت تقویم ترمی')
        } finally {
            setLoading(false)
        }
    }

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (editMode) {
                await api.put(`/api/TermCalender/${form.term}`, form)
                setMessage('ویرایش با موفقیت انجام شد')
            } else {
                await api.post('/api/TermCalender', form)
                setMessage('ترم جدید ثبت شد')
            }
            setForm({ term: '', title: '', start: '', end: '' })
            setEditMode(false)
            fetchTerms()
        } catch (err) {
            setMessage(err.message || 'خطا در ذخیره اطلاعات')
        }
    }

    function handleEdit(term) {
        const item = terms.find(t => t.term === term)
        if (item) {
            setForm({ term: item.term, title: item.title, start: item.start, end: item.end })
            setEditMode(true)
        }
    }

    async function handleDelete(term) {
        if (!window.confirm(`آیا از حذف ترم ${term} مطمئن هستید؟`)) return
        try {
            await api.delete(`/api/TermCalender/${term}`)
            setMessage('ترم حذف شد')
            fetchTerms()
        } catch (err) {
            setMessage('خطا در حذف ترم')
        }
    }

    async function handleActivate(term) {
        try {
            await api.put(`/api/TermCalender/activate/${term}`)
            setMessage(`ترم ${term} فعال شد`)
            fetchTerms()
        } catch (err) {
            setMessage('خطا در فعال‌سازی ترم')
        }
    }

    return (
        <div>
            <h6>لیست تقویم ترمی</h6>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit} className="row g-2 mb-4">
                <div className="col-md-2">
                    <input type="text" name="term" className="form-control" placeholder="کد ترم" value={form.term} onChange={handleChange} required disabled={editMode} />
                </div>
                <div className="col-md-3">
                    <input type="text" name="title" className="form-control" placeholder="عنوان ترم" value={form.title} onChange={handleChange} required />
                </div>
                <div className='col-md-3'>
                    <input
                        type="text"
                        name="start"
                        className="form-control"
                        placeholder="مثال: 1403/07/15"
                        value={form.start}
                        onChange={handleChange}
                        pattern="\d{4}/\d{2}/\d{2}"
                        title="فرمت باید به صورت 1403/07/15 باشد"
                        required
                    />
                </div>
                <div className='col-md-3'>
                    <input
                        type="text"
                        name="end"
                        className="form-control"
                        placeholder="مثال: 1403/07/15"
                        value={form.end}
                        onChange={handleChange}
                        pattern="\d{4}/\d{2}/\d{2}"
                        title="فرمت باید به صورت 1403/07/15 باشد"
                        required
                    />
                </div>
                <div className="col-md-1">
                    <button type="submit" className="btn btn-primary w-100">{editMode ? 'ویرایش' : 'افزودن'}</button>
                </div>
            </form>

            {loading ? (
                <div>در حال بارگذاری...</div>
            ) : (
                <table className="table table-bordered table-sm text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>کد ترم</th>
                            <th>عنوان</th>
                            <th>شروع</th>
                            <th>پایان</th>
                            <th>وضعیت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {terms.map(t => (
                            <tr key={t.term}>
                                <td>{t.term}</td>
                                <td>{t.title}</td>
                                <td>{t.start?.substring(0, 10)}</td>
                                <td>{t.end?.substring(0, 10)}</td>
                                <td>
                                    <span className={`badge bg-${t.active ? 'success' : 'secondary'}`}>
                                        {t.active ? 'فعال' : 'غیرفعال'}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        {!t.active && (
                                            <button className="btn btn-sm btn-outline-success" onClick={() => handleActivate(t.term)}>فعال‌سازی</button>
                                        )}
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(t.term)}>ویرایش</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.term)}>حذف</button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                        {terms.length === 0 && (
                            <tr>
                                <td colSpan="6">هیچ تقویمی ثبت نشده است.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    )
}
