import React, { useState } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'

export default function UploadTeacherExcel({ onSuccess }) {
    const { hasRole } = useUser()
    const [showModal, setShowModal] = useState(false)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    if (!hasRole('admin')) return null

    async function handleUpload() {
        if (!file) {
            setError('لطفاً یک فایل اکسل انتخاب کنید')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            setLoading(true)
            setError(null)
            const res = await api.post('/api/teachers/upload-excel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setResult(res) // انتظار داریم res شامل counts باشه
            onSuccess?.()
        } catch (err) {
            setError(`خطا در بارگذاری: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* دکمه باز کردن مودال */}
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(true)}>
                📄 افزودن اساتید با فایل اکسل
            </button>

            {/* مودال */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: '#00000088' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title ">افزودن اساتید با فایل اکسل</h5>
                                <button type="button" className="btn-close" onClick={() => {
                                    setShowModal(false)
                                    setFile(null)
                                    setResult(null)
                                    setError(null)
                                }}></button>
                            </div>
                            <div className="modal-body">
                                <h5 className='modal-title text-danger'>
                                    در استفاده از این آیتم مطمئن باشید چون در صورت اشتباه اطلاعات ترمی اساتید ممکن است از بین برود
                                </h5>
                                <br/>
                                <input
                                    type="file"
                                    accept=".xlsx"
                                    className="form-control mb-3"
                                    onChange={e => setFile(e.target.files[0])}
                                />

                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handleUpload}
                                    disabled={loading}
                                >
                                    {loading ? 'در حال ارسال...' : 'افزودن اساتید'}
                                </button>

                                {error && <div className="alert alert-danger mt-3">{error}</div>}

                                {result && (
                                    <div className="alert alert-success mt-3">
                                        <p className="mb-1">✅ عملیات با موفقیت انجام شد:</p>
                                        <ul className="mb-0">
                                            <li>تعداد افزوده‌شده: {result.addedCount}</li>
                                            <li>تعداد تکراری: {result.duplicateCount}</li>
                                            <li>تعداد خطادار: {result.errorCount}</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
