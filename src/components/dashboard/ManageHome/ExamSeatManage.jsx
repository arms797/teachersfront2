import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient'

export default function ExamSeatManage() {
    const [summary, setSummary] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null) // برای نگه داشتن رکوردی که می‌خواهیم حذف کنیم

    // بارگذاری خلاصه
    const fetchSummary = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.get('/api/examseat')
            console.log(res)
            const data = res.data || []
            
            // مرتب‌سازی بر اساس تاریخ و ساعت
            const sorted = data.sort((a, b) => {
                if (a.date === b.date) return a.time.localeCompare(b.time)
                return a.date.localeCompare(b.date)
            })
            setSummary(sorted)
        } catch (err) {
            setError('خطا در دریافت اطلاعات خلاصه')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSummary()
    }, [])

    // حذف رکورد بر اساس تاریخ و ساعت
    const confirmDelete = async () => {
        if (!deleteTarget) return
        try {
            await api.delete(`/api/examseat/${deleteTarget.date}/${deleteTarget.time}`)
            setMessage('رکوردهای متناظر حذف شدند.')
            setDeleteTarget(null)
            fetchSummary()
        } catch (err) {
            setMessage('خطا در حذف رکوردها')
        }
    }

    // آپلود فایل اکسل
    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setSelectedFile(file)
        const formData = new FormData()
        formData.append('file', file)
        try {
            await api.post('/api/examseat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setMessage('فایل با موفقیت بارگذاری شد.')
            setSelectedFile(null)
            fetchSummary()
        } catch (err) {
            setMessage('خطا در بارگذاری فایل اکسل')
        }
    }

    return (
        <div className="container mt-4">
            <h3 className="fw-bold text-primary mb-3">خلاصه شماره صندلی امتحانات</h3>

            {/* پیام‌ها */}
            {message && <div className="alert alert-info">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* دکمه آپلود اکسل */}
            <div className="mb-3">
                <label className="btn btn-success">
                    افزودن رکوردها از فایل اکسل
                    <input type="file" accept=".xlsx,.xls" hidden onChange={handleUpload} />
                </label>
                {selectedFile && <span className="ms-2">{selectedFile.name}</span>}
            </div>

            {loading && <div>در حال بارگذاری...</div>}

            <table className="table table-bordered text-center">
                <thead className="table-light">
                    <tr>
                        <th>تاریخ</th>
                        <th>ساعت</th>
                        <th>تعداد دانشجو</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.date}</td>
                            <td>{item.time}</td>
                            <td>{item.count}</td>
                            <td>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => setDeleteTarget(item)}
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteModal"
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                    {summary.length === 0 && !loading && (
                        <tr>
                            <td colSpan="4">هیچ داده‌ای موجود نیست</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal حذف */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">تأیید حذف</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="بستن"></button>
                        </div>
                        <div className="modal-body">
                            {deleteTarget && (
                                <p>
                                    آیا مطمئن هستید که می‌خواهید رکوردهای تاریخ <strong>{deleteTarget.date}</strong> و ساعت <strong>{deleteTarget.time}</strong> حذف شوند؟
                                </p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={confirmDelete}
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
