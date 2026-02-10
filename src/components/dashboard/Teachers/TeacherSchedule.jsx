import React, { useState, useEffect } from 'react'
import api from '../../../utils/apiClient.js'
import { useCenters } from '../../../context/CenterContext.jsx'
import EditScheduleModal from './EditScheduleModal.jsx'
import { useUser } from '../../../context/UserContext.jsx'
import PersianDigitsProvider from '../../../context/PersianDigitsProvider.jsx'
import fontAddress from '../../../assets/fonts/Vazir/Vazir-Regular.woff2'
import logo from '../../../assets/logo.svg'
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
    const [loc, setLoc] = useState([])
    const [scheduleLocks, setScheduleLocks] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const [scheduleResult, emailResult, locResult, locksResult] = await Promise.allSettled([
                    api.get(`/api/teachers/teacherTermSchedule/${code}/${term}`),
                    api.get(`/api/teachers/teachersEmail/${code}`),
                    api.get(`/api/teachers/teacherTermSchedule/${term}/${code}`),
                    api.get(`/api/ScheduleLock/teacher/${code}?term=${term}`)
                ])

                // پردازش نتایج
                if (scheduleResult.status === 'fulfilled') {
                    setData(scheduleResult.value)
                    setTermForm(scheduleResult.value?.termInfo || null)
                } else {
                    console.error('خطا در دریافت برنامه هفتگی:', scheduleResult.reason)
                }

                if (emailResult.status === 'fulfilled') {
                    setEmail(emailResult.value?.email || null)
                } else {
                    console.error('خطا در دریافت ایمیل:', emailResult.reason)
                }

                if (locResult.status === 'fulfilled') {
                    setLoc(locResult.value?.items || [])
                } else {
                    console.error('خطا در دریافت اطلاعات مکانی:', locResult.reason)
                }

                if (locksResult.status === 'fulfilled') {
                    setScheduleLocks(locksResult.value || [])
                } else {
                    console.error('خطا در دریافت قفل‌ها:', locksResult.reason)
                    setScheduleLocks([])
                }

            } catch (err) {
                console.error('خطای غیرمنتظره:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [code, term])

    const getLockForDay = (dayOfWeek) => {
        return scheduleLocks.find(lock =>
            lock.dayOfWeek === dayOfWeek &&
            lock.teacherCode === code &&
            lock.term === term
        )
    }

    const handleLockDay = async (dayOfWeek) => {
        if (!userInfo) return
        try {
            const lockData = {
                teacherCode: code,
                dayOfWeek: dayOfWeek,
                term: term,
                username: userInfo.username,
                fullName: userInfo.fullName,
                centerCode: userInfo.centerCode
            }
            await api.post('/api/ScheduleLock/lock', lockData)

            const locksRes = await api.get(`/api/ScheduleLock/teacher/${code}?term=${term}`)
            setScheduleLocks(locksRes || [])
            alert(`✅ روز ${dayOfWeek} با موفقیت قفل شد.`)
        } catch (err) {
            alert('❌ خطا در قفل کردن روز')
            console.error(err)
        }
    }

    const handleUnlockDay = async (lockId) => {
        if (!window.confirm('آیا از باز کردن این قفل اطمینان دارید؟')) return
        try {
            await api.delete(`/api/ScheduleLock/${lockId}`)
            const updatedLocks = scheduleLocks.filter(lock => lock.id !== lockId)
            setScheduleLocks(updatedLocks)
            alert('✅ قفل با موفقیت باز شد.')
        } catch (err) {
            alert('❌ خطا در باز کردن قفل')
            console.error(err)
        }
    }

    const isCurrentUserLocker = (lock) => {
        return lock && userInfo && lock.username === userInfo.username
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
                return
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
                <div class="info-item">شماره تماس: ${toPersianDigits(teacher.mobile) || '—'}</div>
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
                    <td style="text-align:left; font-weight:bold; border:none;">امضاء رئیس دانشگاه</td>
                </tr>
            </table>
            </body>
        </html>
    `
        win.document.write(html)
        win.document.close()
    }

    return (
        <PersianDigitsProvider>
            <div className="modal fade show" style={{ display: "block" }} role="dialog" >
                <div className="modal-dialog modal-fullscreen modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="container-fluid py-4 ">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <button className="btn btn-outline-danger me-2" onClick={handleClose}>بستن</button>
                                        <div className="w-100 text-center mb-4">
                                            <img src={logo} alt="آرم دانشگاه" style={{ width: "80px", height: "70px", marginBottom: "5px" }} />

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
                                            <div className="col-md-3"><strong>شماره تماس: {data.teacher.mobile || '—'}</strong></div>
                                            <div className="col-md-3"><strong>محل خدمت: {centers.find(c => c.centerCode === data.teacher.center)?.title || data.teacher.center}</strong></div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-3"><strong>رشته تحصیلی: {data.teacher.fieldOfStudy}</strong></div>
                                            <div className="col-md-3"><strong>نوع همکاری: {data.teacher.cooperationType}</strong></div>
                                            <div className="col-md-3"><strong>مرتبه علمی/مدرک: {data.teacher.academicRank}</strong></div>
                                            <div className="col-md-3"><strong>پست اجرایی: {data.teacher.executivePosition}</strong></div>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>روز</th>
                                                    <th>مرکز</th>
                                                    <th>بازه A (۸-۱۰)</th>
                                                    <th>بازه B (۱۰-۱۲)</th>
                                                    <th>بازه C (۱۲-۱۴)</th>
                                                    <th>بازه D (۱۴-۱۶)</th>
                                                    <th>بازه E (۱۶-۱۸)</th>
                                                    <th>اقدامات</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedSchedule.map(ws => {
                                                    const dayLock = getLockForDay(ws.dayOfWeek)
                                                    const locked = !!dayLock
                                                    const isLocker = isCurrentUserLocker(dayLock)

                                                    return (
                                                        <tr key={ws.dayOfWeek}>
                                                            <td>{ws.dayOfWeek}</td>
                                                            <td>{ws.center}</td>
                                                            <td className={getCellClass(ws.a)}>{renderTooltipCell(ws.a)}</td>
                                                            <td className={getCellClass(ws.b)}>{renderTooltipCell(ws.b)}</td>
                                                            <td className={getCellClass(ws.c)}>{renderTooltipCell(ws.c)}</td>
                                                            <td className={getCellClass(ws.d)}>{renderTooltipCell(ws.d)}</td>
                                                            <td className={getCellClass(ws.e)}>{renderTooltipCell(ws.e)}</td>
                                                            <td>
                                                                {hasRole('teacher') && (
                                                                    <div>
                                                                        {locked ? (
                                                                            <div className="text-muted small">
                                                                                <div>قفل شده</div>
                                                                                <div>توسط: {dayLock.fullName}</div>
                                                                                <div>مرکز: {dayLock.centerCode}</div>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-sm btn-primary"
                                                                                onClick={() => setEditItem(ws)}
                                                                            >
                                                                                ویرایش
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {hasRole('programmer') && (
                                                                    <div>
                                                                        {locked ? (
                                                                            <div>
                                                                                <div className="small text-muted">
                                                                                    قفل توسط: {dayLock.fullName} ({dayLock.centerCode})
                                                                                </div>
                                                                                {isLocker && (
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-danger mt-1"
                                                                                        onClick={() => handleUnlockDay(dayLock.id)}
                                                                                    >
                                                                                        🔓 باز کردن
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-sm btn-warning"
                                                                                onClick={() => handleLockDay(ws.dayOfWeek)}
                                                                            >
                                                                                🔒 قفل این روز
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {(hasRole('admin') || hasRole('centerAdmin')) && (
                                                                    <div>
                                                                        {locked ? (
                                                                            <div>
                                                                                <div className="small text-muted">
                                                                                    قفل توسط: {dayLock.fullName} ({dayLock.centerCode})
                                                                                </div>
                                                                                { (
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-danger mt-1"
                                                                                        onClick={() => handleUnlockDay(dayLock.id)}
                                                                                    >
                                                                                        🔓 باز کردن
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-sm btn-warning"
                                                                                onClick={() => handleLockDay(ws.dayOfWeek)}
                                                                            >
                                                                                🔒 قفل این روز
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {canEditTerm && termForm && (
                                        <div className="mt-4 p-3 border rounded">
                                            <h5>ویرایش اطلاعات ترم</h5>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>حداکثر ساعات هفتگی</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={termForm.maxWeeklyHours || ''}
                                                        onChange={(e) => handleTermChange('maxWeeklyHours', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label>نوع قرارداد</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={termForm.contractType || ''}
                                                        onChange={(e) => handleTermChange('contractType', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label>وضعیت ترم</label>
                                                    <select
                                                        className="form-control"
                                                        value={termForm.status || ''}
                                                        onChange={(e) => handleTermChange('status', e.target.value)}
                                                    >
                                                        <option value="فعال">فعال</option>
                                                        <option value="غیرفعال">غیرفعال</option>
                                                        <option value="اتمام یافته">اتمام یافته</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3 d-flex align-items-end">
                                                    <button className="btn btn-primary w-100" onClick={handleTermSubmit}>
                                                        ذخیره اطلاعات ترم
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editItem && (
                <EditScheduleModal
                    item={editItem}
                    onClose={() => setEditItem(null)}
                    onSave={async (updatedItem) => {
                        try {
                            await api.put(`/api/teachers/schedule/${updatedItem.id}`, updatedItem)
                            setData(prev => ({
                                ...prev,
                                weeklySchedule: prev.weeklySchedule.map(item =>
                                    item.id === updatedItem.id ? updatedItem : item
                                )
                            }))
                            setEditItem(null)
                            alert('✅ تغییرات با موفقیت ذخیره شد')
                        } catch (err) {
                            alert('❌ خطا در ذخیره تغییرات')
                        }
                    }}
                />
            )}
        </PersianDigitsProvider>
    )
}