import React, { useState, useEffect } from 'react'
import api from '../../../utils/apiClient.js'
import { useCenters } from '../../../context/CenterContext.jsx'
import EditScheduleModal from './EditScheduleModal.jsx'
import { useUser } from '../../../context/UserContext.jsx'
import PersianDigitsProvider from '../../../context/PersianDigitsProvider.jsx'
import fontAddress from '../../../assets/fonts/Vazir/Vazir-Regular.woff2'
import logo from '../../../assets/logo.png'
import { useTerms } from '../../../context/TermContext.jsx'

export default function TeacherSchedule({ code, term, onClose }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { centers } = useCenters()
    const [editItem, setEditItem] = useState(null)
    const weekOrder = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
    const { hasRole, userInfo } = useUser()
    const [termForm, setTermForm] = useState(null)
    const canEditTerm = hasRole('admin') || hasRole('teacher') || hasRole('centerAdmin')
    const [email, setEmail] = useState(null)
    const { activeTerm } = useTerms()
    const [locks, setLocks] = useState([])

    // ✅ قفل کردن Body هنگام باز شدن مودال
    useEffect(() => {
        const scrollY = window.scrollY

        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'
        document.body.style.left = '0'
        document.body.style.right = '0'

        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            document.body.style.left = ''
            document.body.style.right = ''
            window.scrollTo(0, scrollY)
        }
    }, [])

    // تابع کمکی برای دریافت نام مرکز از کد مرکز
    const getCenterName = (centerCode) => {
        if (!centerCode) return '—'
        const center = centers.find(c => c.centerCode === centerCode)
        return center?.title || centerCode
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const resLock = await api.get(`/api/ScheduleLock/${term}/${code}`)
                setLocks(resLock || [])
                const res = await api.get(`/api/teachers/teacherTermSchedule/${code}/${term}`)
                setData(res)
                setTermForm(res.termInfo)
                const resmail = await api.get(`/api/teachers/teachersEmail/${code}`)
                setEmail(resmail.email)
            } catch (err) {
                console.error('خطا در دریافت اطلاعات برنامه هفتگی:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [code, term])

    const getLockForDay = (dayOfWeek) => {
        return locks.find(lock =>
            lock.dayOfWeek === dayOfWeek &&
            lock.teacherCode === code &&
            lock.term === term
        )
    }

    const handleLockDay = async (dayOfWeek, centerCode) => {
        if (!userInfo) {
            alert('❌ اطلاعات کاربر یافت نشد')
            return
        }

        if (hasRole('programmer') && userInfo.centerCode !== centerCode) {
            alert('❌ شما فقط می‌توانید روزهایی را قفل کنید که مرکز آن با مرکز شما مطابقت داشته باشد')
            return
        }

        try {
            const lockData = {
                teacherCode: code,
                dayOfWeek: dayOfWeek,
                term: term,
                username: userInfo.username,
                fullName: userInfo.fullName,
                centerCode: userInfo.centerCode,
                description: `قفل شده توسط ${userInfo.fullName}`,
                lockedAt: new Date().toISOString()
            }

            await api.post('/api/ScheduleLock', lockData)
            const resLock = await api.get(`/api/ScheduleLock/${term}/${code}`)
            setLocks(resLock || [])
        } catch (err) {
            console.error('خطا در قفل کردن:', err)
            alert('❌ خطا در قفل کردن روز')
        }
    }

    const handleUnlockDay = async (lockId, dayOfWeek) => {
        try {
            await api.delete(`/api/ScheduleLock/${lockId}`)
            const resLock = await api.get(`/api/ScheduleLock/${term}/${code}`)
            setLocks(resLock || [])
        } catch (err) {
            console.error('خطا در باز کردن قفل:', err)
            alert('❌ خطا در باز کردن قفل')
        }
    }

    if (loading) return <div className="fullscreen-overlay">در حال دریافت اطلاعات...</div>
    if (!data) return <div className="fullscreen-overlay">اطلاعاتی یافت نشد</div>

    function normalizePersian(str) {
        return (str || '')
            .replace(/ي/g, 'ی')
            .replace(/ك/g, 'ک')
            .replace(/\s+/g, ' ')
            .trim()
    }

    function getCellClass(value) {
        const normalized = normalizePersian(value || '')
        if (['تدریس حضوری', 'امکان تدریس در دانشگاه'].includes(normalized)) return 'cell-green'
        if (normalized === 'تدریس الکترونیک') return 'cell-yellow'
        if (normalized === 'عدم حضور در دانشگاه') return 'cell-gray'
        if (normalized === 'فعالیت پژوهشی') return 'cell-blue'
        if (normalized === 'حضور در مرکز') return 'cell-peach'
        if (normalized === 'مشاوره دانشجویی') return 'cell-orange'
        return ''
    }

    const renderTooltipCell = (text) => {
        const short = text?.length > 25 ? text.slice(0, 25) + '...' : text || ''
        return (
            <span title={text} style={{ cursor: 'help' }}>
                {short}
            </span>
        )
    }

    const sortedSchedule = [...data.weeklySchedule]
        .filter(w => w.dayOfWeek !== 'جمعه')
        .sort((a, b) => weekOrder.indexOf(a.dayOfWeek) - weekOrder.indexOf(b.dayOfWeek))

    const handleTermChange = (field, value) => {
        setTermForm(prev => ({ ...prev, [field]: value }))
    }

    const handleTermSubmit = async () => {
        try {
            await api.put(`/api/teacherTerm/${termForm.id}`, termForm)
            alert('✅ اطلاعات ترم با موفقیت ذخیره شد')
            setData(prev => ({ ...prev, termInfo: termForm }))
        } catch (err) {
            alert('❌ خطا در ذخیره اطلاعات ترم')
        }
    }

    const cooperation = normalizePersian(data.teacher.cooperationType)
    const isFaculty = cooperation.includes('مدرس') && cooperation.includes('مدعو')

    function toPersianDigits(str) {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
        return str.toString().replace(/\d/g, d => persianDigits[d])
    }

    const handleClose = () => {
        if (!isFaculty) {
            let errors = []
            if (researchHours > 10) {
                errors.push('❌ کل ساعات پژوهشی نباید بیشتر از 10 ساعت باشد.')
            }
            if (researchInOfficeHours > 6) {
                errors.push('❌ ساعات پژوهشی در ساعات اداری نباید بیشتر از 6 ساعت باشد.')
            }
            if (workHours < 40) {
                errors.push('❌ ساعات کاری اعلام شده نباید کمتر از 40 ساعت باشد.')
            }

            if (errors.length > 0) {
                let initError = []
                initError.push('لطفا نسبت به رفع خطاهای زیر اقدام نمایید')
                initError.push(errors)
                alert(initError.join('\n'))
            }
        }
        onClose()
    }

    function handlePrintView(teacher, schedule, centers) {
        const win = window.open('', '_blank')
        const getCenterTitle = code => centers.find(c => c.centerCode === code)?.title || code

        const rows = schedule.map(ws => `
      <tr>
        <td>${ws.dayOfWeek}</td>
        <td>${getCenterTitle(ws.center)}</td>
        <td>${ws.a || ''}</td>
        <td>${ws.b || ''}</td>
        <td>${ws.c || ''}</td>
        <td>${ws.d || ''}</td>
        <td>${ws.e || ''}</td>
      </tr>
    `).join('')

        const html = `
        <html>
            <head>
            <title>چاپ برنامه هفتگی</title>
            <style>
                @font-face {
                font-family: 'Vazirmatn';
                src: url(${fontAddress}) format('woff2');
                }
                body { font-family: 'Vazirmatn', sans-serif; direction: rtl; text-align: right; padding: 50px 60px; background-color: #fff; }
                h2 { font-size: 20px; margin-bottom: 35px; text-align: center; color: #000; }
                .info { margin-bottom: 35px; font-size: 15px; line-height: 1.9; }
                .info-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 10px; }
                .info-item {
                    flex: 1;
                    font-weight: bold;
                    word-break: break-word; 
                }

                table { width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 20px; table-layout: fixed; }
                th, td { border: 1px solid #444; padding: 6px 6px; vertical-align: top; height: 48px; line-height: 1.4; overflow: hidden; }
                th { background-color: #f5f5f5; font-size: 16px; }
                th:nth-child(1), td:nth-child(1) { width: 7%; }
                th:nth-child(2), td:nth-child(2) { width: 9%; }
                th:nth-child(3), td:nth-child(3),
                th:nth-child(4), td:nth-child(4),
                th:nth-child(5), td:nth-child(5),
                th:nth-child(6), td:nth-child(6),
                th:nth-child(7), td:nth-child(7) { width: 12%; }
                th:nth-child(8), td:nth-child(8) { width: 33%; }
            </style>
            </head>
            <body>
                <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:10px;">
                    <img src=${logo} alt="آرم دانشگاه" style="width:80px; height:auto; margin-bottom:10px;" />
                    <h2>فرم برنامه حضور هفتگی اساتید محترم دانشگاه پیام نور استان فارس در نیمسال ${toPersianDigits(activeTerm)}</h2>
                </div>

            <div class="info">
                <div class="info-row">
                <div class="info-item">کد استادی: ${toPersianDigits(teacher.code)}</div>
                <div class="info-item">نام و نام خانوادگی: ${teacher.fname} ${teacher.lname}</div>
                <div class="info-item">شماره تماس: --- </div>
                <div class="info-item">محل خدمت: ${getCenterTitle(teacher.center)}</div>
                </div>
                <div class="info-row">
                <div class="info-item">رشته تحصیلی: ${teacher.fieldOfStudy}</div>
                <div class="info-item">نوع همکاری: ${teacher.cooperationType}</div>
                <div class="info-item">مرتبه علمی/مدرک: ${teacher.academicRank}</div>
                <div class="info-item">پست اجرایی: ${teacher.executivePosition}</div>
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th>روز/ساعت</th>
                    <th>مرکز</th>
                    <th>
                        <div>A</div>
                        <div>${toPersianDigits("08-10")}</div>
                    </th>
                    <th>
                        <div>B</div>
                        <div>${toPersianDigits("10-12")}</div>
                    </th>
                    <th>
                        <div>C</div>
                        <div>${toPersianDigits("12-14")}</div>
                    </th>
                    <th>
                        <div>D</div>
                        <div>${toPersianDigits("14-16")}</div>
                    </th>
                    <th>
                        <div>E</div>
                        <div>${toPersianDigits("16-18")}</div>
                    </th>                    
                </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <table class="signatures" style="width:100%; border:none; border-collapse:collapse; margin-top:20px;">
                <tr>
                    <td style="text-align:right; font-weight:bold; border:none;">امضاء عضو علمی</td>
                    <td style="text-align:center; font-weight:bold; border:none;">امضاء مدیر گروه</td>
                    <td style="text-align:left; font-weight:bold; border:none;">امضاء رئیس مرکز</td>
                </tr>
            </table>
            </body>
        </html>
    `
        win.document.write(html)
        win.document.close()
    }

    const allValues = data.weeklySchedule.flatMap(ws => {
        const vals = [ws.a, ws.b, ws.c, ws.d, ws.e].map(v => normalizePersian(v))
        return vals
    })

    const researchCount = allValues.filter(v => v === 'فعالیت پژوهشی').length
    const researchHours = researchCount * 2

    const researchInOfficeCount = data.weeklySchedule.reduce((sum, ws) => {
        const vals = [
            normalizePersian(ws.a || ''),
            normalizePersian(ws.b || ''),
            normalizePersian(ws.c || ''),
        ]
        return sum + vals.filter(v => v === 'فعالیت پژوهشی').length
    }, 0)
    const researchInOfficeHours = researchInOfficeCount * 2

    const workCount = allValues.filter(v => v !== 'عدم حضور در دانشگاه' && v !== '').length
    const workHours = workCount * 2

    const absentCount = allValues.filter(v => v === 'عدم حضور در دانشگاه').length
    const absentHours = absentCount * 2

    return (
        <PersianDigitsProvider>
            <div
                className="modal fade show"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1050,
                    overflow: "hidden"
                }}
                role="dialog"
            >
                <div
                    className="modal-dialog modal-fullscreen modal-dialog-scrollable"
                    style={{
                        margin: 0,
                        width: "100%",
                        maxWidth: "100%",
                        height: "100vh",
                        maxHeight: "100vh",
                        position: "relative"
                    }}
                    role="document"
                >
                    <div
                        className="modal-content"
                        style={{
                            height: "100vh",
                            maxHeight: "100vh",
                            border: "none",
                            borderRadius: 0,
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <div
                            className="modal-body"
                            style={{
                                padding: "1rem",
                                overflowY: "auto",
                                overflowX: "hidden",
                                WebkitOverflowScrolling: "touch",
                                flex: "1 1 auto",
                                position: "relative"
                            }}
                        >
                            <div className="container-fluid py-4">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                                        <button className="btn btn-outline-danger me-2" onClick={handleClose}>بستن</button>
                                        <div className="w-100 text-center mb-4">
                                            <img src={logo} alt="آرم دانشگاه" style={{ width: "80px", height: "auto", marginBottom: "5px" }} />
                                            <h4 className="fw-bold text-primary">
                                                فرم برنامه حضور هفتگی اساتید محترم دانشگاه پیام نور استان فارس در نیمسال
                                                {activeTerm}
                                            </h4>
                                        </div>
                                        <button
                                            className="btn btn-outline-success me-2"
                                            onClick={() => handlePrintView(data.teacher, sortedSchedule, centers)}
                                        >
                                            📄برنامه هفتگی قابل چاپ
                                        </button>
                                        <button className="btn btn-outline-danger me-2" onClick={handleClose}>بستن</button>
                                    </div>

                                    <div className="mb-4">
                                        <div className="row mb-2">
                                            <div className="col-md-3"><strong>کد استادی: {data.teacher.code}</strong></div>
                                            <div className="col-md-3"><strong>نام و نام خانوادگی: {data.teacher.fname} {data.teacher.lname}</strong></div>
                                            <div className="col-md-3"><strong>شماره تماس: {data.teacher.mobile}</strong></div>
                                            <div className="col-md-3">
                                                <strong>محل خدمت:{' '}
                                                    {getCenterName(data.teacher.center)}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3"><strong>رشته تحصیلی: {data.teacher.fieldOfStudy}</strong></div>
                                            <div className="col-md-3"><strong>نوع همکاری: {data.teacher.cooperationType}</strong></div>
                                            <div className="col-md-3"><strong>مرتبه علمی/مدرک: {data.teacher.academicRank}</strong></div>
                                            <div className="col-md-3"><strong>پست اجرایی: {data.teacher.executivePosition}</strong></div>
                                        </div>
                                    </div>

                                    <div className="table-responsive" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                                        {data.weeklySchedule.length > 0 ? (
                                            <table className="table table-bordered text-center align-middle" style={{ minWidth: "1200px" }}>
                                                <colgroup>
                                                    <col style={{ width: '8%' }} />
                                                    <col style={{ width: '10%' }} />
                                                    <col style={{ width: '9%' }} />
                                                    <col style={{ width: '9%' }} />
                                                    <col style={{ width: '9%' }} />
                                                    <col style={{ width: '9%' }} />
                                                    <col style={{ width: '9%' }} />
                                                    <col style={{ width: '10%' }} />
                                                    <col style={{ width: '9%' }} />
                                                    <col style={{ width: '9%' }} />
                                                    <col style={{ width: '9%' }} />
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th>روز/ساعت</th>
                                                        <th>مرکز</th>
                                                        <th>A<br />08-10</th>
                                                        <th>B<br />10-12</th>
                                                        <th>C<br />12-14</th>
                                                        <th>D<br />14-16</th>
                                                        <th>E<br />16-18</th>
                                                        <th>توضیحات</th>
                                                        <th>ساعات جایگزین</th>
                                                        <th>ساعات ممنوع</th>
                                                        <th>عملیات</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedSchedule.map((ws, i) => {
                                                        const dayLock = getLockForDay(ws.dayOfWeek)
                                                        const isLocked = !!dayLock
                                                        const isCurrentUserLocker = dayLock?.username === userInfo?.username
                                                        const centerMatch = userInfo?.centerCode === ws.center

                                                        return (
                                                            <tr key={i}>
                                                                <td>{ws.dayOfWeek}</td>
                                                                <td>{getCenterName(ws.center)}</td>
                                                                <td className={getCellClass(ws.a)}>{ws.a}</td>
                                                                <td className={getCellClass(ws.b)}>{ws.b}</td>
                                                                <td className={getCellClass(ws.c)}>{ws.c}</td>
                                                                <td className={getCellClass(ws.d)}>{ws.d}</td>
                                                                <td className={getCellClass(ws.e)}>{ws.e}</td>
                                                                <td>{renderTooltipCell(ws.description)}</td>
                                                                <td>{renderTooltipCell(ws.alternativeHours)}</td>
                                                                <td>{renderTooltipCell(ws.forbiddenHours)}</td>
                                                                <td>
                                                                    {hasRole('teacher') && (
                                                                        isLocked ? (
                                                                            <div className="small text-muted">
                                                                                <span className="badge bg-secondary mb-1">قفل شده</span>
                                                                                <div className="small">توسط: {dayLock.fullName}</div>
                                                                                <div className="small">{getCenterName(dayLock.centerCode)}</div>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-sm btn-outline-primary"
                                                                                onClick={() => setEditItem({
                                                                                    ...ws,
                                                                                    cooperationType: data.teacher.cooperationType,
                                                                                    email: email
                                                                                })}
                                                                            >
                                                                                ✏️ ویرایش
                                                                            </button>
                                                                        )
                                                                    )}

                                                                    {hasRole('programmer') && (
                                                                        isLocked ? (
                                                                            <div>
                                                                                <div className="small text-muted">
                                                                                    <span className="badge bg-secondary mb-1">قفل شده</span>
                                                                                    <div className="small">توسط: {dayLock.fullName}</div>
                                                                                    <div className="small">{getCenterName(dayLock.centerCode)}</div>
                                                                                </div>
                                                                                {isCurrentUserLocker && (
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-danger mt-1"
                                                                                        onClick={() => handleUnlockDay(dayLock.id, ws.dayOfWeek)}
                                                                                    >
                                                                                        🔓 باز کردن قفل
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                className={`btn btn-sm ${centerMatch ? 'btn-outline-warning' : 'btn-outline-secondary'}`}
                                                                                onClick={() => handleLockDay(ws.dayOfWeek, ws.center)}
                                                                                disabled={!centerMatch}
                                                                                title={!centerMatch ? 'فقط می‌توانید روزهایی را قفل کنید که مرکز آن با مرکز شما مطابقت دارد' : ''}
                                                                            >
                                                                                🔒 قفل کردن
                                                                            </button>
                                                                        )
                                                                    )}

                                                                    {(hasRole('centerAdmin') || hasRole('admin')) && (
                                                                        <div className="d-flex gap-1 ">
                                                                            {isLocked ? (
                                                                                <>
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-secondary"
                                                                                        disabled
                                                                                        title="به دلیل قفل بودن روز، ویرایش غیرفعال است"
                                                                                    >
                                                                                        ✏️ ویرایش
                                                                                    </button>
                                                                                    <div className="small text-muted w-100">
                                                                                        <span className="badge bg-secondary mb-1">قفل شده</span>
                                                                                        <div className="small">توسط: {dayLock.fullName}</div>
                                                                                        <div className="small">{getCenterName(dayLock.centerCode)}</div>
                                                                                    </div>
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-danger"
                                                                                        onClick={() => handleUnlockDay(dayLock.id, ws.dayOfWeek)}
                                                                                    >
                                                                                        🔓 باز کردن قفل
                                                                                    </button>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-primary"
                                                                                        onClick={() => setEditItem({
                                                                                            ...ws,
                                                                                            cooperationType: data.teacher.cooperationType,
                                                                                            email: email
                                                                                        })}
                                                                                    >
                                                                                        ✏️ ویرایش
                                                                                    </button>
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-warning"
                                                                                        onClick={() => handleLockDay(ws.dayOfWeek, ws.center)}
                                                                                    >
                                                                                        🔒 قفل کردن
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>برنامه‌ای ثبت نشده</p>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        {!isFaculty && (
                                            <div className="row mb-3">
                                                <div className="col-md-3 d-flex align-items-start">
                                                    <div className="form-check mt-2">
                                                        <input
                                                            className="form-check-input custom-checkbox"
                                                            type="checkbox"
                                                            checked={termForm?.isNeighborTeaching || false}
                                                            onChange={e => canEditTerm && handleTermChange('isNeighborTeaching', e.target.checked)}
                                                            id="chk-neighbor"
                                                            disabled={!canEditTerm}
                                                        />
                                                        <label className="form-check-label" htmlFor="chk-neighbor">
                                                            متقاضی تدریس در مراکز همجوار هستم
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label">دلایل تدریس در مراکز همجوار</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={termForm?.neighborTeaching || ''}
                                                        onChange={e => canEditTerm && handleTermChange('neighborTeaching', e.target.value)}
                                                        readOnly={!canEditTerm || !termForm?.isNeighborTeaching}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label">مراکز همجوار که تقاضای تدریس دارم</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={termForm?.neighborCenters || ''}
                                                        onChange={e => canEditTerm && handleTermChange('neighborCenters', e.target.value)}
                                                        readOnly={!canEditTerm || !termForm?.isNeighborTeaching}
                                                    />
                                                </div>

                                                <div className="col-md-12 mt-3">
                                                    <p className={termForm?.isNeighborTeaching ? "text-success" : "text-muted"}>
                                                        در صورتی که نیاز به تدریس در مراکز همجوار دارید، لازم است فرم مربوط به مجوز تدریس در مراکز همجوار را تکمیل نموده و مراحل اداری لازم را طی نمایید.
                                                    </p>
                                                    <a
                                                        href="/frm.pdf"
                                                        className={`btn btn-outline-primary ${!termForm?.isNeighborTeaching ? "disabled" : ""}`}
                                                        download
                                                    >
                                                        دریافت فرم pdf
                                                    </a>
                                                    <a
                                                        href="/frm.docx"
                                                        className={`btn btn-outline-primary ${!termForm?.isNeighborTeaching ? "disabled" : ""}`}
                                                        download
                                                    >
                                                        دریافت فرم word
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label">پیشنهادات</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={termForm?.suggestion || ''}
                                                    onChange={e => canEditTerm && handleTermChange('suggestion', e.target.value)}
                                                    readOnly={!canEditTerm}
                                                />
                                            </div>

                                            <div className="col-md-3 d-flex align-items-center">
                                                <div className="form-check mt-4">
                                                    <input
                                                        className="form-check-input custom-checkbox"
                                                        type="checkbox"
                                                        checked={termForm?.projector || false}
                                                        onChange={e => canEditTerm && handleTermChange('projector', e.target.checked)}
                                                        id="chk-projector"
                                                        disabled={!canEditTerm}
                                                    />
                                                    <label className="form-check-label ms-2" htmlFor="chk-projector">
                                                        نیاز به ویدئو پروژکتور
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-3 d-flex align-items-center">
                                                <div className="form-check mt-4">
                                                    <input
                                                        className="form-check-input custom-checkbox"
                                                        type="checkbox"
                                                        checked={termForm?.whiteboard2 || false}
                                                        onChange={e => canEditTerm && handleTermChange('whiteboard2', e.target.checked)}
                                                        id="chk-whiteboard"
                                                        disabled={!canEditTerm}
                                                    />
                                                    <label className="form-check-label ms-2" htmlFor="chk-whiteboard">
                                                        نیاز به وایت‌برد بزرگ
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            {canEditTerm && (
                                                <button className="btn btn-success" onClick={handleTermSubmit}>
                                                    💾 ثبت تغییرات اطلاعات ترم
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h6 className="fw-bold mb-2">خلاصه ساعات</h6>
                                        <table className="table table-bordered text-center">
                                            <thead>
                                                <tr>
                                                    <th>نوع فعالیت</th>
                                                    <th>حداکثر مجاز</th>
                                                    <th>ساعات</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>کل ساعات پژوهشی</td>
                                                    <td>10</td>
                                                    <td>{researchHours}</td>
                                                </tr>
                                                <tr>
                                                    <td>ساعات پژوهشی در ساعات اداری</td>
                                                    <td>6</td>
                                                    <td
                                                        style={{
                                                            backgroundColor: researchInOfficeHours > 6 ? '#f8d7da' : 'transparent'
                                                        }}
                                                    >
                                                        {researchInOfficeHours}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>ساعات کاری اعلام شده (شامل حضور، تدریس، پژوهش)</td>
                                                    <td>40</td>
                                                    <td
                                                        style={{
                                                            backgroundColor: workHours < 40 ? '#f8d7da' : 'transparent'
                                                        }}
                                                    >
                                                        {workHours}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>ساعات عدم حضور اعلام شده</td>
                                                    <td>-</td>
                                                    <td>{absentHours}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editItem && (
                <EditScheduleModal
                    item={editItem}
                    term={term}
                    onClose={() => setEditItem(null)}
                    onSave={(updated) => {
                        const updatedList = data.weeklySchedule.map(w =>
                            w.id === updated.id ? { ...w, ...updated } : w
                        )
                        setData(prev => ({ ...prev, weeklySchedule: updatedList }))
                        if (updated.email) {
                            setEmail(updated.email)
                        }
                    }}
                />
            )}
        </PersianDigitsProvider>
    )
}