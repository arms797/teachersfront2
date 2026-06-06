import React, { useState } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'

export default function ManageExam() {
    const { hasRole } = useUser()
    const [uploadLoading, setUploadLoading] = useState(false)
    const [normalizeLoading, setNormalizeLoading] = useState(false)
    const [updateCodeLoading, setUpdateCodeLoading] = useState(false)
    const [truncateLoading, setTruncateLoading] = useState(false)

    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadResult, setUploadResult] = useState(null)
    const [normalizeResult, setNormalizeResult] = useState(null)
    const [updateCodeResult, setUpdateCodeResult] = useState(null)
    const [truncateResult, setTruncateResult] = useState(null)

    // ================================
    // بخش 1: آپلود فایل اکسل امتحانات
    // ================================
    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0])
        setUploadResult(null)
    }

    const handleUploadExcel = async () => {
        if (!selectedFile) {
            alert('لطفا ابتدا فایل را انتخاب کنید')
            return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)

        setUploadLoading(true)
        setUploadResult(null)

        try {
            const res = await api.post('/api/exams/upload-excel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setUploadResult(res)
        } catch (err) {
            console.error('خطا در آپلود فایل:', err)
            setUploadResult({ error: true, message: err.message })
        } finally {
            setUploadLoading(false)
        }
    }

    // ================================
    // بخش 2: نرمال‌سازی امتحانات
    // ================================
    const handleNormalize = async () => {
        if (!window.confirm('آیا از انجام نرمال‌سازی حروف فارسی در تمام امتحانات اطمینان دارید؟')) return

        setNormalizeLoading(true)
        setNormalizeResult(null)

        try {
            const res = await api.get('/api/exams/normalize')
            setNormalizeResult(res)
        } catch (err) {
            console.error('خطا در نرمال‌سازی:', err)
            setNormalizeResult({ error: true, message: err.message })
        } finally {
            setNormalizeLoading(false)
        }
    }

    // ================================
    // بخش 3: اختصاص کد طراح سوال
    // ================================
    const handleUpdateDesignerCode = async () => {
        if (!window.confirm('آیا از به‌روزرسانی کد طراح سوال اطمینان دارید؟')) return

        setUpdateCodeLoading(true)
        setUpdateCodeResult(null)

        try {
            const res = await api.post('/api/exams/update-question-designer-code')
            setUpdateCodeResult(res)
        } catch (err) {
            console.error('خطا در به‌روزرسانی کد طراح سوال:', err)
            setUpdateCodeResult({ error: true, message: err.message })
        } finally {
            setUpdateCodeLoading(false)
        }
    }

    // ================================
    // بخش 4: حذف کامل کلیه امتحانات (Truncate)
    // ================================
    const handleTruncateExams = async () => {
        const confirm1 = window.confirm('⚠️ هشدار مهم! این عملیات تمام رکوردهای جدول امتحانات را به طور کامل حذف می‌کند. آیا مطمئن هستید؟')
        if (!confirm1) return

        const confirm2 = window.prompt('برای تأیید حذف کامل، عبارت "حذف کامل" را وارد کنید:')
        if (confirm2 !== 'حذف کامل') {
            alert('عملیات حذف لغو شد. عبارت وارد شده صحیح نبود.')
            return
        }

        setTruncateLoading(true)
        setTruncateResult(null)

        try {
            const res = await api.delete('/api/exams/truncate')
            setTruncateResult(res)
            alert(`✅ ${res.message || 'تمامی رکوردهای امتحانات با موفقیت حذف شدند'}`)
        } catch (err) {
            console.error('خطا در حذف کامل:', err)
            const errorMsg = err.response?.data?.message || err.message
            alert(`❌ خطا در حذف کامل: ${errorMsg}`)
            setTruncateResult({ error: true, message: errorMsg })
        } finally {
            setTruncateLoading(false)
        }
    }

    // بررسی دسترسی
    if (!hasRole('admin') && !hasRole('centerAdmin')) {
        return (
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="alert alert-danger text-center">
                        <i className="fa fa-ban ml-2"></i>
                        شما مجاز به دسترسی به این بخش نیستید.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                    <i className="fa fa-tasks fa-2x text-primary ml-2"></i>
                    <h4 className="card-title mb-0">مدیریت امتحانات</h4>
                </div>

                {/* ================================ */}
                {/* بخش اول: آپلود فایل اکسل */}
                {/* ================================ */}
                <div className="card mb-4 border-primary">
                    <div className="card-header bg-primary text-white">
                        <i className="fa fa-upload ml-2"></i>
                        بارگذاری فایل اکسل امتحانات
                    </div>
                    <div className="card-body">
                        <div className="row align-items-end">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">فایل اکسل را انتخاب کنید</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileSelect}
                                    disabled={uploadLoading}
                                />
                                <small className="text-muted">
                                    فرمت فایل باید .xlsx یا .xls باشد
                                </small>
                            </div>
                            <div className="col-md-3">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handleUploadExcel}
                                    disabled={uploadLoading || !selectedFile}
                                >
                                    {uploadLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            در حال بارگذاری...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-upload ml-2"></i>
                                            بارگذاری فایل
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="col-md-3 text-center">
                                {selectedFile && !uploadLoading && (
                                    <span className="text-success">
                                        <i className="fa fa-check-circle"></i> فایل انتخاب شد: {selectedFile.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {uploadResult && !uploadResult.error && (
                            <div className="alert alert-success mt-3">
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-check-circle fa-2x ml-2"></i>
                                    <div>
                                        <strong>نتیجه بارگذاری:</strong><br />
                                        <div className="row mt-2">
                                            <div className="col-md-3">📊 کل ردیف‌ها: {uploadResult.totalRows}</div>
                                            <div className="col-md-3">✅ اضافه شده: {uploadResult.addedCount}</div>
                                            <div className="col-md-3">🔄 تکراری: {uploadResult.duplicateCount}</div>
                                            <div className="col-md-3">❌ خطا: {uploadResult.errorCount}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {uploadResult?.error && (
                            <div className="alert alert-danger mt-3">
                                <i className="fa fa-exclamation-triangle ml-2"></i>
                                خطا در آپلود فایل: {uploadResult.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================================ */}
                {/* بخش دوم: نرمال‌سازی امتحانات */}
                {/* ================================ */}
                <div className="card mb-4 border-warning">
                    <div className="card-header bg-warning text-dark">
                        <i className="fa fa-exchange-alt ml-2"></i>
                        نرمال‌سازی حروف فارسی امتحانات
                    </div>
                    <div className="card-body">
                        <p className="text-muted small mb-3">
                            <i className="fa fa-info-circle ml-1"></i>
                            این عملیات حروف عربی (ي، ك، ة، أ، إ، ؤ، ئ) را به حروف فارسی معادل تبدیل می‌کند.
                        </p>
                        <button
                            className="btn btn-warning"
                            onClick={handleNormalize}
                            disabled={normalizeLoading}
                        >
                            {normalizeLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    در حال نرمال‌سازی...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-exchange-alt ml-2"></i>
                                    شروع نرمال‌سازی
                                </>
                            )}
                        </button>

                        {normalizeResult && !normalizeResult.error && (
                            <div className="alert alert-success mt-3">
                                <i className="fa fa-check-circle ml-2"></i>
                                <strong>نتیجه نرمال‌سازی:</strong><br />
                                کل امتحانات: {normalizeResult.totalExams} |
                                به‌روزرسانی شده: {normalizeResult.updatedCount}
                            </div>
                        )}

                        {normalizeResult?.error && (
                            <div className="alert alert-danger mt-3">
                                <i className="fa fa-exclamation-triangle ml-2"></i>
                                خطا در نرمال‌سازی: {normalizeResult.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================================ */}
                {/* بخش سوم: اختصاص کد طراح سوال */}
                {/* ================================ */}
                <div className="card mb-4 border-success">
                    <div className="card-header bg-success text-white">
                        <i className="fa fa-user-check ml-2"></i>
                        اختصاص کد طراح سوال
                    </div>
                    <div className="card-body">
                        <p className="text-muted small mb-3">
                            <i className="fa fa-info-circle ml-1"></i>
                            این عملیات ابتدا نام طراح سوال را با فیلد استاد در جدول امتحانات مقایسه می‌کند.
                            در صورت عدم تطابق، با جدول اساتید مقایسه شده و کد استاد را در فیلد QuestionDesignerCode ذخیره می‌کند.
                        </p>
                        <button
                            className="btn btn-success"
                            onClick={handleUpdateDesignerCode}
                            disabled={updateCodeLoading}
                        >
                            {updateCodeLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    در حال به‌روزرسانی...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-sync-alt ml-2"></i>
                                    اختصاص کد طراح سوال
                                </>
                            )}
                        </button>

                        {updateCodeResult && !updateCodeResult.error && (
                            <div className="alert alert-success mt-3">
                                <i className="fa fa-check-circle ml-2"></i>
                                <strong>نتیجه به‌روزرسانی:</strong>
                                <div className="row mt-2">
                                    <div className="col-md-4">📊 کل رکوردها: {updateCodeResult.totalExams}</div>
                                    <div className="col-md-4">✅ به‌روزرسانی شده: {updateCodeResult.updatedCount}</div>
                                    <div className="col-md-4">🔍 پیدا نشد: {updateCodeResult.notFoundCount}</div>
                                    <div className="col-md-6 mt-2">📖 تطابق از جدول امتحانات: {updateCodeResult.matchedFromSameTable}</div>
                                    <div className="col-md-6 mt-2">👨‍🏫 تطابق از جدول اساتید: {updateCodeResult.matchedFromTeachersTable}</div>
                                </div>
                            </div>
                        )}

                        {updateCodeResult?.error && (
                            <div className="alert alert-danger mt-3">
                                <i className="fa fa-exclamation-triangle ml-2"></i>
                                خطا در به‌روزرسانی: {updateCodeResult.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================================ */}
                {/* بخش چهارم: حذف کامل کلیه امتحانات */}
                {/* ================================ */}
                <div className="card mb-4 border-danger">
                    <div className="card-header bg-danger text-white">
                        <i className="fa fa-trash-alt ml-2"></i>
                        حذف کامل کلیه امتحانات (Truncate)
                    </div>
                    <div className="card-body">
                        <p className="text-muted small mb-3">
                            <i className="fa fa-exclamation-triangle text-danger ml-1"></i>
                            <strong className="text-danger">هشدار:</strong> این عملیات <strong className="text-danger">تمام رکوردهای جدول امتحانات</strong> را به طور کامل حذف می‌کند.
                        این عمل غیرقابل بازگشت است.
                        </p>
                        <button
                            className="btn btn-danger"
                            onClick={handleTruncateExams}
                            disabled={truncateLoading}
                        >
                            {truncateLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    در حال حذف کامل...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-trash-alt ml-2"></i>
                                    حذف کامل کلیه امتحانات
                                </>
                            )}
                        </button>

                        {truncateResult && !truncateResult.error && (
                            <div className="alert alert-warning mt-3">
                                <i className="fa fa-check-circle ml-2"></i>
                                {truncateResult.message || 'تمامی رکوردهای امتحانات با موفقیت حذف شدند.'}
                            </div>
                        )}

                        {truncateResult?.error && (
                            <div className="alert alert-danger mt-3">
                                <i className="fa fa-exclamation-triangle ml-2"></i>
                                خطا در حذف کامل: {truncateResult.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}