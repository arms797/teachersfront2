import React, { useState, useEffect, useCallback, useRef } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'

export default function ExamList() {
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
    const [teacher, setTeacher] = useState('')
    const [centerCode, setCenterCode] = useState('')
    const [lessonNo, setLessonNo] = useState('')
    const [examDate, setExamDate] = useState('')
    const [examType, setExamType] = useState('')
    const [questionDesigner, setQuestionDesigner] = useState('')
    const [sourceNo, setSourceNo] = useState('')
    const [dayOfWeek, setDayOfWeek] = useState('')

    // چک‌باکس عدم نمایش تاریخ‌های گذشته
    const [hidePastDates, setHidePastDates] = useState(false)

    // برای debounce
    const debounceTimer = useRef(null)

    // تابع دریافت داده‌ها
    const fetchExams = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('page', page)
            params.append('pageSize', pageSize)
            if (teacher) params.append('search', teacher)
            if (centerCode) params.append('centerCode', centerCode)
            if (lessonNo) params.append('lessonNo', lessonNo)
            if (examDate) params.append('examDate', examDate)
            if (examType) params.append('examType', examType)
            if (questionDesigner) params.append('questionDesigner', questionDesigner)
            if (sourceNo) params.append('sourceNo', sourceNo)
            if (dayOfWeek) params.append('dayOfWeek', dayOfWeek)
            if (hidePastDates) params.append('hidePastDates', 'true')

            const res = await api.get(`/api/exams/paged?${params.toString()}`)
            setExams(res.items || [])
            setTotalCount(res.totalCount)
            setTotalPages(res.totalPages || Math.ceil(res.totalCount / pageSize))
            setPageInputValue(String(res.page || page))
        } catch (err) {
            console.error('خطا در دریافت لیست امتحانات:', err)
            alert('❌ خطا در دریافت لیست امتحانات')
        } finally {
            setLoading(false)
        }
    }, [page, teacher, centerCode, lessonNo, examDate, examType, questionDesigner, sourceNo, dayOfWeek, pageSize, hidePastDates])

    // debounce برای فیلترهایی که با تایپ تغییر می‌کنند
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(() => {
            if (page === 1) {
                fetchExams()
            } else {
                setPage(1)
            }
        }, 700)

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
            }
        }
    }, [teacher, centerCode, lessonNo, examDate, examType, questionDesigner, sourceNo, dayOfWeek, hidePastDates])

    // بارگذاری با تغییر صفحه
    useEffect(() => {
        fetchExams()
    }, [page])

    // تابع بازنشانی فیلترها
    const resetFilters = () => {
        setTeacher('')
        setCenterCode('')
        setLessonNo('')
        setExamDate('')
        setExamType('')
        setQuestionDesigner('')
        setSourceNo('')
        setDayOfWeek('')
        setHidePastDates(false)
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

    // بررسی دسترسی
    if (!hasRole('admin') && !hasRole('centerAdmin') && !hasRole('programmer')) {
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
                    <i className="fa fa-table-list fa-2x text-primary ml-2"></i>
                    <h4 className="card-title mb-0">لیست امتحانات</h4>
                </div>

                {/* ================================ */}
                {/* بخش فیلترها */}
                {/* ================================ */}
                <div className="card mb-4 border-secondary">
                    <div className="card-header bg-secondary text-white">
                        <i className="fa fa-filter ml-2"></i>
                        فیلترها
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">استاد درس</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="نام، نام خانوادگی یا کد استاد"
                                    value={teacher}
                                    onChange={(e) => setTeacher(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">مرکز / کد مرکز</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="نام مرکز یا کد مرکز"
                                    value={centerCode}
                                    onChange={(e) => setCenterCode(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">کد درس</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="کد درس"
                                    value={lessonNo}
                                    onChange={(e) => setLessonNo(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">شماره منبع</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="شماره منبع"
                                    value={sourceNo}
                                    onChange={(e) => setSourceNo(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">تاریخ امتحان</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="1403/06/15"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">روز هفته</label>
                                <select
                                    className="form-select"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                >
                                    <option value="">همه روزها</option>
                                    <option value="شنبه">شنبه</option>
                                    <option value="یک شنبه">یک شنبه</option>
                                    <option value="دوشنبه">دوشنبه</option>
                                    <option value="سه شنبه">سه شنبه</option>
                                    <option value="چهارشنبه">چهارشنبه</option>
                                    <option value="پنجشنبه">پنجشنبه</option>
                                    <option value="جمعه">جمعه</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">نوع امتحان</label>
                                <select
                                    className="form-select"
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                >
                                    <option value="">همه</option>
                                    <option value="استانی">استانی</option>
                                    <option value="استاد محور">استاد محور</option>
                                    <option value="مرکز/واحد">مرکز/واحد</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">طراح سوال</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="نام طراح سوال"
                                    value={questionDesigner}
                                    onChange={(e) => setQuestionDesigner(e.target.value)}
                                />
                            </div>

                            {/* چک‌باکس عدم نمایش تاریخ‌های گذشته */}
                            <div className="col-auto d-flex align-items-end">
                                <div className="form-check d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="hidePastDates"
                                        checked={hidePastDates}
                                        onChange={(e) => setHidePastDates(e.target.checked)}
                                        style={{ margin: "0 5px 0 0", position: "static" }}
                                    />
                                    <label className="form-check-label" htmlFor="hidePastDates" style={{ margin: 0, padding: 0 }}>
                                        عدم نمایش تاریخ‌های گذشته
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-2 d-flex align-items-end">
                                <button className="btn btn-outline-secondary w-100" onClick={resetFilters}>
                                    <i className="fa fa-undo ml-2"></i>
                                    پاک کردن فیلترها
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================================ */}
                {/* بخش جدول امتحانات */}
                {/* ================================ */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">در حال بارگذاری...</span>
                        </div>
                        <p className="mt-2 text-muted">در حال دریافت اطلاعات...</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-striped">
                                <thead className="table-light">
                                    <tr>
                                        <th>نام طراح سوال</th>
                                        <th>نام درس</th>
                                        <th>مرکز و واحد درس</th>
                                        <th>شماره درس و گروه</th>
                                        <th>نوع امتحان</th>
                                        <th>شماره منبع</th>
                                        <th>شرح پیوست</th>
                                        <th>تاریخ امتحان</th>
                                        <th>ساعت شروع</th>
                                        <th>روز هفته</th>
                                        <th>نوع طراحی سوال</th>
                                        <th>استاد درس</th>
                                        <th>شماره همراه استاد</th>
                                        <th>تعداد ثبت نام</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.length === 0 ? (
                                        <tr>
                                            <td colSpan="14" className="text-center text-muted py-4">
                                                <i className="fa fa-info-circle ml-1"></i>
                                                هیچ داده‌ای یافت نشد
                                            </td>
                                        </tr>
                                    ) : (
                                        exams.map((exam) => (
                                            <tr key={exam.id}>
                                                <td>{exam.questionDesigner || '—'}</td>
                                                <td>{exam.lesson || '—'}</td>
                                                <td>{exam.center || '—'}</td>
                                                <td>{exam.lessonNoGrp || '—'}</td>
                                                <td>{exam.examType || '—'}</td>
                                                <td>{exam.sourceNo || '—'}</td>
                                                <td>{exam.attachNo || '—'}</td>
                                                <td>{exam.examDate || '—'}</td>
                                                <td>{exam.start || '—'}</td>
                                                <td>{exam.dayOfWeek || '—'}</td>
                                                <td>{exam.questionType || '—'}</td>
                                                <td>{exam.teacher || '—'}</td>
                                                <td>{exam.mobile || '—'}</td>
                                                <td>{exam.registered}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ================================ */}
                        {/* بخش صفحه‌بندی با قابلیت تایپ شماره صفحه */}
                        {/* ================================ */}
                        {totalCount > 0 && (
                            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                                <div>
                                    <span className="text-muted">
                                        نمایش {(page - 1) * pageSize + 1} تا {Math.min(page * pageSize, totalCount)} از {totalCount} رکورد
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <nav>
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(page - 1)}>
                                                    قبلی
                                                </button>
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
                                                <button className="page-link" onClick={() => setPage(page + 1)}>
                                                    بعدی
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>

                                    {/* بخش تایپ شماره صفحه */}
                                    <div className="d-flex align-items-center gap-1">
                                        <span className="text-muted small">رفتن به صفحه</span>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            style={{ width: "70px", textAlign: "center" }}
                                            value={pageInputValue}
                                            onChange={handlePageInputChange}
                                            onKeyDown={handlePageInputKeyDown}
                                        />
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
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