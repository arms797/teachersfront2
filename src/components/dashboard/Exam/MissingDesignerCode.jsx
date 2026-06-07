import React, { useState, useEffect, useCallback, useRef } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'

export default function MissingDesignerCode() {
    const { hasRole } = useUser()

    // حالت‌های صفحه‌بندی و فیلترها
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize] = useState(50)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    // برای تایپ شماره صفحه
    const [pageInputValue, setPageInputValue] = useState('1')

    // فیلترها
    const [search, setSearch] = useState('')
    const [examDate, setExamDate] = useState('')

    // برای تیک زدن رکوردها
    const [selectedIds, setSelectedIds] = useState([])
    const [selectAll, setSelectAll] = useState(false)

    // برای کد طراح سوال
    const [designerCode, setDesignerCode] = useState('')
    const [updating, setUpdating] = useState(false)

    // برای debounce
    const debounceTimer = useRef(null)

    // بررسی اعتبار کد طراح سوال (۶ رقم عددی)
    const isValidDesignerCode = designerCode.trim().length === 6 && /^\d+$/.test(designerCode.trim())

    // تابع دریافت داده‌ها
    const fetchMissingDesignerCodes = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('page', page)
            params.append('pageSize', pageSize)
            if (search) params.append('search', search)
            if (examDate) params.append('examDate', examDate)

            const res = await api.get(`/api/exams/missing-designer-code?${params.toString()}`)
            setExams(res.items || [])
            setTotalCount(res.totalCount)
            setTotalPages(res.totalPages || Math.ceil(res.totalCount / pageSize))
            setPageInputValue(String(res.page || page))
            setSelectedIds([])
            setSelectAll(false)
        } catch (err) {
            console.error('خطا در دریافت اطلاعات:', err)
            alert('❌ خطا در دریافت لیست دروس بدون کد طراح')
        } finally {
            setLoading(false)
        }
    }, [page, search, examDate, pageSize])

    // debounce برای فیلترها
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(() => {
            if (page === 1) {
                fetchMissingDesignerCodes()
            } else {
                setPage(1)
            }
        }, 700)

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
            }
        }
    }, [search, examDate])

    // بارگذاری با تغییر صفحه
    useEffect(() => {
        fetchMissingDesignerCodes()
    }, [page])

    // تابع بازنشانی فیلترها
    const resetFilters = () => {
        setSearch('')
        setExamDate('')
        setPage(1)
    }

    // تابع تغییر صفحه با اینتر
    const handlePageInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            let newPage = parseInt(pageInputValue)
            if (isNaN(newPage)) newPage = 1
            newPage = Math.max(1, Math.min(newPage, totalPages))
            setPage(newPage)
        }
    }

    // تابع تغییر مقدار ورودی صفحه
    const handlePageInputChange = (e) => {
        const value = e.target.value
        if (value === '' || /^\d+$/.test(value)) {
            setPageInputValue(value)
        }
    }

    // تابع تیک زدن یک رکورد
    const handleSelect = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    // تابع انتخاب همه
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([])
        } else {
            setSelectedIds(exams.map(e => e.id))
        }
        setSelectAll(!selectAll)
    }

    // تابع اعمال کد طراح سوال به رکوردهای انتخاب شده
    const handleAssignCode = async () => {
        if (selectedIds.length === 0) {
            alert('⚠️ لطفا حداقل یک رکورد را انتخاب کنید')
            return
        }

        if (!isValidDesignerCode) {
            alert('⚠️ کد طراح سوال باید ۶ رقم عددی باشد')
            return
        }

        if (!window.confirm(`آیا از اعمال کد "${designerCode}" به ${selectedIds.length} رکورد اطمینان دارید؟`)) {
            return
        }

        setUpdating(true)
        try {
            const res = await api.post('/api/exams/assign-designer-code', {
                ids: selectedIds,
                designerCode: designerCode.trim()
            })

            alert(`✅ ${res.message || `${res.updatedCount} رکورد با موفقیت به‌روزرسانی شد`}`)

            setSelectedIds([])
            setSelectAll(false)
            setDesignerCode('')
            fetchMissingDesignerCodes()
        } catch (err) {
            console.error('خطا در اعمال کد:', err)
            alert('❌ خطا در اعمال کد طراح سوال')
        } finally {
            setUpdating(false)
        }
    }

    // بررسی دسترسی (فقط admin و centerAdmin)
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
                <div className="d-flex align-items-center mb-3">
                    <i className="fa fa-question-circle fa-2x text-warning ml-2"></i>
                    <h4 className="card-title mb-0">دروسی که کد طراح سوال ندارند</h4>
                </div>

                {/* ================================ */}
                {/* بخش فیلترها + اختصاص کد در یک قاب */}
                {/* ================================ */}
                <div className="card mb-3 border-secondary">
                    <div className="card-header bg-secondary text-white py-2">
                        <i className="fa fa-filter ml-2"></i>
                        فیلترها و اختصاص کد طراح سوال
                    </div>
                    <div className="card-body py-2">
                        <div className="row g-2 align-items-end">
                            <div className="col-md-3">
                                <label className="form-label small">جستجو</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="نام طراح سوال، نام درس..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">تاریخ امتحان</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="1403/06/15"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">کد طراح سوال (۶ رقمی)</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="مثال: 123456"
                                    value={designerCode}
                                    onChange={(e) => setDesignerCode(e.target.value)}
                                    maxLength={6}
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    className="btn btn-success btn-sm w-100"
                                    onClick={handleAssignCode}
                                    disabled={updating || selectedIds.length === 0 || !isValidDesignerCode}
                                >
                                    {updating ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        <><i className="fa fa-save ml-1"></i> اعمال کد</>
                                    )}
                                </button>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-outline-secondary btn-sm w-100" onClick={resetFilters}>
                                    <i className="fa fa-undo ml-1"></i> پاک کردن
                                </button>
                            </div>
                            {selectedIds.length > 0 && (
                                <div className="col-md-12 mt-2">
                                    <div className="alert alert-info py-1 mb-0 small">
                                        <i className="fa fa-info-circle ml-1"></i>
                                        {selectedIds.length} رکورد برای اعمال کد انتخاب شده است
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================================ */}
                {/* بخش جدول */}
                {/* ================================ */}
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">در حال بارگذاری...</span>
                        </div>
                        <p className="mt-2 text-muted small">در حال دریافت اطلاعات...</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-striped table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '35px' }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                style={{ margin: 0 }}
                                            />
                                        </th>
                                        <th>نام طراح سوال</th>
                                        <th>نام درس</th>
                                        <th>مرکز</th>
                                        <th>شماره درس و گروه</th>
                                        <th>نوع امتحان</th>
                                        <th>شماره منبع</th>
                                        <th>تاریخ امتحان</th>
                                        <th>ساعت شروع</th>
                                        <th>نوع طراحی سوال</th>
                                        <th>استاد درس</th>
                                        <th>شماره همراه</th>
                                        <th>تعداد ثبت نام</th>
                                        <th className="text-danger">کد طراح</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.length === 0 ? (
                                        <tr>
                                            <td colSpan="14" className="text-center text-muted py-3">
                                                <i className="fa fa-info-circle ml-1"></i>
                                                هیچ داده‌ای یافت نشد
                                            </td>
                                        </tr>
                                    ) : (
                                        exams.map((exam) => (
                                            <tr key={exam.id}>
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={selectedIds.includes(exam.id)}
                                                        onChange={() => handleSelect(exam.id)}
                                                        style={{ margin: 0 }}
                                                    />
                                                </td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.questionDesigner || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.lesson || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.center || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.lessonNoGrp || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.examType || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.sourceNo || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.examDate || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.start || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.questionType || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.teacher || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.mobile || '—'}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{exam.registered}</td>
                                                <td className="text-danger fw-bold" style={{ fontSize: '0.85rem' }}>{exam.questionDesignerCode || 'نامشخص'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ================================ */}
                        {/* بخش صفحه‌بندی */}
                        {/* ================================ */}
                        {totalCount > 0 && (
                            <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                                <div>
                                    <span className="text-muted small">
                                        نمایش {(page - 1) * pageSize + 1} تا {Math.min(page * pageSize, totalCount)} از {totalCount} رکورد
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(page - 1)}>قبلی</button>
                                            </li>

                                            {(() => {
                                                const maxVisible = 5
                                                let start = Math.max(1, page - Math.floor(maxVisible / 2))
                                                let end = Math.min(totalPages, start + maxVisible - 1)

                                                if (end - start + 1 < maxVisible) {
                                                    start = Math.max(1, end - maxVisible + 1)
                                                }

                                                const nodes = []

                                                if (start > 1) {
                                                    nodes.push(
                                                        <li key="first" className="page-item">
                                                            <button className="page-link" onClick={() => setPage(1)}>1</button>
                                                        </li>
                                                    )
                                                    if (start > 2) {
                                                        nodes.push(
                                                            <li key="start-ellipsis" className="page-item disabled">
                                                                <span className="page-link">...</span>
                                                            </li>
                                                        )
                                                    }
                                                }

                                                for (let i = start; i <= end; i++) {
                                                    nodes.push(
                                                        <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                                            <button className="page-link" onClick={() => setPage(i)}>{i}</button>
                                                        </li>
                                                    )
                                                }

                                                if (end < totalPages) {
                                                    if (end < totalPages - 1) {
                                                        nodes.push(
                                                            <li key="end-ellipsis" className="page-item disabled">
                                                                <span className="page-link">...</span>
                                                            </li>
                                                        )
                                                    }
                                                    nodes.push(
                                                        <li key="last" className="page-item">
                                                            <button className="page-link" onClick={() => setPage(totalPages)}>{totalPages}</button>
                                                        </li>
                                                    )
                                                }

                                                return nodes
                                            })()}

                                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(page + 1)}>بعدی</button>
                                            </li>
                                        </ul>
                                    </nav>

                                    <div className="d-flex align-items-center gap-1">
                                        <span className="text-muted small">رفتن به صفحه</span>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            style={{ width: "60px", textAlign: "center", fontSize: "0.75rem" }}
                                            value={pageInputValue}
                                            onChange={handlePageInputChange}
                                            onKeyDown={handlePageInputKeyDown}
                                        />
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            style={{ fontSize: "0.7rem" }}
                                            onClick={() => {
                                                let newPage = parseInt(pageInputValue)
                                                if (isNaN(newPage)) newPage = 1
                                                newPage = Math.max(1, Math.min(newPage, totalPages))
                                                setPage(newPage)
                                            }}
                                        >
                                            برو
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}