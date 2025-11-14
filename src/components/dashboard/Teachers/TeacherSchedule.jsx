import React, { useState, useEffect } from 'react'
import api from '../../../utils/apiClient.js'
import { useCenters } from '../../../context/CenterContext.jsx'
import EditScheduleModal from './EditScheduleModal.jsx'
import { useUser } from '../../../context/UserContext.jsx'

export default function TeacherSchedule({ code, term, onClose }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { centers } = useCenters()
    const [editItem, setEditItem] = useState(null)
    const weekOrder = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
    const { hasRole, userInfo } = useUser()
    const [termForm, setTermForm] = useState(null)
    const canEditTerm = hasRole('admin') || (hasRole('teacher')) || (hasRole('centerAdmin'))

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/api/teachers/teacherTermSchedule/${code}/${term}`)
                setData(res)
                setTermForm(res.termInfo) // مقداردهی اولیه فرم ترمی
            } catch (err) {
                console.error('خطا در دریافت اطلاعات برنامه هفتگی:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [code, term])

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
        return ''
    }
    const renderTooltipCell = (text) => {
        const short = text?.length > 15 ? text.slice(0, 25) + '...' : text
        return (
            <span title={text} style={{ cursor: 'help' }}>
                {short}
            </span>
        )
    }

    const sortedSchedule = [...data.weeklySchedule]
        .filter(w => w.dayOfWeek !== 'جمعه')
        .sort((a, b) => {
            return weekOrder.indexOf(a.dayOfWeek) - weekOrder.indexOf(b.dayOfWeek)
        })
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

    function handlePrintView(teacher, schedule, centers) {
        const win = window.open('', '_blank')

        const getCenterTitle = code =>
            centers.find(c => c.centerCode === code)?.title || code

        const rows = schedule.map(ws => `
    <tr>
      <td>${ws.dayOfWeek}</td>
      <td>${getCenterTitle(ws.center)}</td>
      <td>${ws.a}</td>
      <td>${ws.b}</td>
      <td>${ws.c}</td>
      <td>${ws.d}</td>
      <td>${ws.e}</td>
      <td>${ws.description}</td>
    </tr>
  `).join('')

        const html = `
    <html>
      <head>
        <title>چاپ برنامه هفتگی</title>
        <style>
          @font-face {
            font-family: 'Vazirmatn';
            src: url('/src/assets/fonts/Vazir/Vazir-Regular.woff2') format('woff2');
          }
          body {
            font-family: 'Vazirmatn', sans-serif;
            direction: rtl;
            text-align: right;
            padding: 50px 60px;
            background-color: #fff;
          }
          h2 {
            font-size: 20px;
            margin-bottom: 35px;
            text-align: center;
            color: #000;
          }
          .info {
            margin-bottom: 35px;
            font-size: 15px;
            line-height: 1.9;
          }
          .info-row {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 10px;
          }
          .info-item {
            width: 23%;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 15px;
            margin-top: 20px;
            table-layout: fixed;
          }
          th, td {
            border: 1px solid #444;
            padding: 6px 6px;
            vertical-align: top;
            height: 48px; /* ارتفاع ثابت برای دو خط */
            line-height: 1.4;
            overflow: hidden;
          }


          th {
            background-color: #f5f5f5;
            font-size: 16px;
          }

          /* عرض سفارشی ستون‌ها */
          th:nth-child(1), td:nth-child(1) { width: 7%; }     /* روز/ساعت */
          th:nth-child(2), td:nth-child(2) { width: 9%; }    /* مرکز */
          th:nth-child(3), td:nth-child(3),
          th:nth-child(4), td:nth-child(4),
          th:nth-child(5), td:nth-child(5),
          th:nth-child(6), td:nth-child(6),
          th:nth-child(7), td:nth-child(7) { width: 12%; }    /* A تا E */
          th:nth-child(8), td:nth-child(8) { width: 33%; }    /* توضیحات */
        </style>
      </head>
      <body>
        <h2>فرم برنامه حضور هفتگی اساتید محترم دانشگاه پیام نور استان فارس</h2>
        <div class="info">
          <div class="info-row">
            <div class="info-item">کد استادی: ${teacher.code}</div>
            <div class="info-item">نام و نام خانوادگی: ${teacher.fname} ${teacher.lname}</div>
            <div class="info-item">شماره تماس: ${teacher.mobile || '—'}</div>
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
              <th>08-10 (A)</th>
              <th>10-12 (B)</th>
              <th>12-14 (C)</th>
              <th>14-16 (D)</th>
              <th>16-18 (E)</th>
              <th>توضیحات</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `

        win.document.write(html)
        win.document.close()
    }



    return (
        <div className="fullscreen-overlay">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="w-100 text-center mb-4">
                        <h4 className="fw-bold text-primary">
                            فرم برنامه حضور هفتگی اساتید محترم دانشگاه پیام نور استان فارس
                        </h4>
                    </div>
                    <button className="btn btn-outline-success me-2" onClick={() => handlePrintView(data.teacher, sortedSchedule, centers)}>
                        📄برنامه هفتگی قابل چاپ
                    </button>

                    <button className="btn btn-outline-danger me-2" onClick={onClose}>بستن</button>
                </div>


                {/* اطلاعات استاد */}
                <div className="mb-4">
                    {/*<h6 className="text-secondary mb-3">اطلاعات استاد</h6>*/}
                    <div className="row mb-2">
                        <div className="col-md-3"><strong>کد استادی: {data.teacher.code}</strong></div>
                        <div className="col-md-3"><strong>نام و نام خانوادگی: {data.teacher.fname} {data.teacher.lname}</strong></div>
                        <div className="col-md-3"><strong>شماره تماس: {data.teacher.mobile}</strong></div>
                        <div className="col-md-3">
                            <strong>محل خدمت:{' '}
                                {centers.find(c => c.centerCode === data.teacher.center)?.title || data.teacher.center}</strong>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-3"><strong>رشته تحصیلی: {data.teacher.fieldOfStudy}</strong></div>
                        <div className="col-md-3"><strong>نوع همکاری: {data.teacher.cooperationType}</strong></div>
                        <div className="col-md-3"><strong>مرتبه علمی/مدرک: {data.teacher.academicRank}</strong></div>
                        <div className="col-md-3"><strong>پست اجرایی: {data.teacher.executivePosition}</strong></div>
                    </div>
                </div>


                {/* برنامه هفتگی */}
                <div>
                    {/*<h6>برنامه هفتگی</h6>*/}
                    {data.weeklySchedule.length > 0 ? (
                        <table className="table table-bordered text-center align-middle">
                            <colgroup>
                                <col />
                                <col />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>روز/ساعت</th>
                                    <th>مرکز</th>
                                    <th>08-10 (A)</th>
                                    <th>10-12 (B)</th>
                                    <th>12-14 (C)</th>
                                    <th>14-16 (D)</th>
                                    <th>16-18 (E)</th>
                                    <th>توضیحات</th>
                                    <th>ساعات جایگزین</th>
                                    <th>ساعات ممنوع</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedSchedule.map((ws, i) => (
                                    <tr key={i}>
                                        <td>{ws.dayOfWeek}</td>
                                        <td>{centers.find(c => c.centerCode === ws.center)?.title || ws.center}</td>
                                        <td className={getCellClass(ws.a)}>{ws.a}</td>
                                        <td className={getCellClass(ws.b)}>{ws.b}</td>
                                        <td className={getCellClass(ws.c)}>{ws.c}</td>
                                        <td className={getCellClass(ws.d)}>{ws.d}</td>
                                        <td className={getCellClass(ws.e)}>{ws.e}</td>
                                        <td>{renderTooltipCell(ws.description)}</td>
                                        <td>{renderTooltipCell(ws.alternativeHours)}</td>
                                        <td>{renderTooltipCell(ws.forbiddenHours)}</td>

                                        <td>
                                            {(hasRole('admin') || hasRole('centerAdmin') || hasRole('teacher')) && (
                                                <button className="btn btn-sm btn-outline-primary"
                                                    onClick={() => setEditItem({ ...ws, cooperationType: data.teacher.cooperationType })}
                                                >✏️ ویرایش</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    ) : <p>برنامه‌ای ثبت نشده</p>}
                </div>

                {/* ردیف اول: چک‌باکس + دلایل + مراکز */}
                <div className="mt-5">
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
                                <label className="form-check-label ms-2" htmlFor="chk-neighbor">
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
                                readOnly={!canEditTerm}
                            />
                        </div>

                        <div className="col-md-5">
                            <label className="form-label">مراکز همجوار که تقاضای تدریس دارم</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                value={termForm?.neighborCenters || ''}
                                onChange={e => canEditTerm && handleTermChange('neighborCenters', e.target.value)}
                                readOnly={!canEditTerm}
                            />
                        </div>
                    </div>

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



            </div>
            {editItem && (
                <EditScheduleModal
                    item={editItem}
                    term={term}
                    onClose={() => setEditItem(null)}
                    onSave={(updated) => {
                        const updatedList = data.weeklySchedule.map(w =>
                            w.id === updated.id ? updated : w
                        )
                        setData(prev => ({ ...prev, weeklySchedule: updatedList }))
                    }}
                />
            )}

        </div>
    )
}
