import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'   // 👈 گرفتن کاربر جاری

export default function AnnouncementsManager() {
    const [announcements, setAnnouncements] = useState([])
    const [form, setForm] = useState({ id: null, title: '', body: '', startDate: '', endDate: '', isActive: true, createdBy: '', createdDate: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { userInfo } = useUser()   // 👈 کاربر جاری

    async function fetchAnnouncements() {
        setLoading(true)
        try {
            const res = await api.get('/api/announcement')
            setAnnouncements(res || [])
        } catch (err) {
            setError('خطا در دریافت اطلاعیه‌ها')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    /*async function handleSave() {
        try {
            const payload = {
                ...form,
                createdBy: userInfo?.username || 'system'   // 👈 ایجاد کننده از کانتکست
            }

            if (form.id) {

                await api.put(`/api/announcement/${form.id}`, payload)
            } else {

                console.log(payload)
                await api.post('/api/announcement', payload)
            }

            setForm({ id: null, title: '', body: '', startDate: '', endDate: '', isActive: true })
            fetchAnnouncements()
        } catch (err) {
            setError('خطا در ذخیره اطلاعیه')
        }
    }*/
    async function handleSave() {
        try {
            // بررسی خالی بودن عنوان و متن
            if (!form.title || form.title.trim() === "" || !form.body || form.body.trim() === "") {
                setError("عنوان و متن اطلاعیه نباید خالی باشند.")
                return
            }

            const payload = {
                ...form,
                createdBy: userInfo?.username || 'system'
            }

            if (form.id) {
                await api.put(`/api/announcement/${form.id}`, payload)
            } else {
                await api.post('/api/announcement', payload)
            }

            setForm({ id: null, title: '', body: '', startDate: '', endDate: '', isActive: true })
            setError(null)
            fetchAnnouncements()
        } catch (err) {
            setError('خطا در ذخیره اطلاعیه')
        }
    }



    async function handleDelete(id) {
        if (!window.confirm('آیا مطمئن هستید؟')) return
        try {
            await api.delete(`/api/announcement/${id}`)
            fetchAnnouncements()
        } catch (err) {
            setError('خطا در حذف اطلاعیه')
        }
    }

    function handleEdit(a) {
        setForm({ id: a.id, title: a.title, body: a.body, startDate: a.startDate, endDate: a.endDate, isActive: a.isActive })
    }

    return (
        <div className="container mt-4">
            <h4 className="mb-3">مدیریت اطلاعیه‌ها</h4>

            {/* فرم افزودن/ویرایش */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="mb-2">
                        <label className="form-label">عنوان</label>
                        <input type="text" className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">متن</label>
                        <textarea className="form-control" rows="3" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}></textarea>
                    </div>

                    {/* تاریخ شروع، تاریخ پایان و فعال بودن در یک ردیف */}
                    <div className="row mb-2">
                        <div className="col-md-3">
                            <label className="form-label">تاریخ شروع</label>
                            <input type="text" className="form-control" value={form.startDate || ''} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">تاریخ پایان</label>
                            <input type="text" className="form-control" value={form.endDate || ''} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                        </div>
                        <div className="col-md-2 d-flex align-items-center">
                            <div className="form-check mt-4">
                                <input type="checkbox" className="form-check-input" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                                <label className="form-check-label">فعال</label>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn btn-success me-2"
                        onClick={handleSave}
                        disabled={!form.title.trim() || !form.body.trim()}   // 👈 غیرفعال وقتی خالی باشه
                    >
                        {form.id ? 'ویرایش اطلاعیه' : 'افزودن اطلاعیه'}
                    </button>
                    {form.id && (
                        <button className="btn btn-secondary" onClick={() => setForm({ id: null, title: '', body: '', startDate: '', endDate: '', isActive: true })}>
                            انصراف
                        </button>
                    )}
                </div>
            </div>

            {/* لیست اطلاعیه‌ها */}
            {loading ? (
                <div>در حال بارگذاری...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>عنوان</th>
                            <th>تاریخ شروع</th>
                            <th>تاریخ پایان</th>
                            <th>فعال؟</th>
                            <th>ایجاد کننده</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map(a => (
                            <tr key={a.id}>
                                <td>{a.title}</td>
                                <td>{a.startDate}</td>
                                <td>{a.endDate}</td>
                                <td>{a.isActive ? '✅' : '❌'}</td>
                                <td>{a.createdBy}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(a)}>ویرایش</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
