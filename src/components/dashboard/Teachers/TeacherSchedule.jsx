import React, { useState, useEffect } from 'react'
import api from '../../../utils/apiClient.js'
import { useCenters } from '../../../context/CenterContext.jsx'
import EditScheduleModal from './EditScheduleModal.jsx'
import { useUser } from '../../../context/UserContext.jsx'
import EditTermModal from './EditTermModal.jsx'


export default function TeacherSchedule({ code, term, onClose }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { centers } = useCenters()
    const [editItem, setEditItem] = useState(null)
    const weekOrder = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
    const { hasRole } = useUser()
    const [editTerm, setEditTerm] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/api/teachers/teacherTermSchedule/${code}/${term}`)
                setData(res)
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


    return (
        <div className="fullscreen-overlay">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="w-100 text-center mb-4">
                        <h4 className="fw-bold text-primary">
                            فرم برنامه حضور هفتگی اساتید محترم دانشگاه پیام نور استان فارس
                        </h4>
                    </div>
                    <button className="btn btn-danger" onClick={onClose}>بستن</button>
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
                    <h6>برنامه هفتگی</h6>
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
                                        <td>{ws.a}</td>
                                        <td>{ws.b}</td>
                                        <td>{ws.c}</td>
                                        <td>{ws.d}</td>
                                        <td>{ws.e}</td>
                                        <td>{renderTooltipCell(ws.description)}</td>
                                        <td>{renderTooltipCell(ws.alternativeHours)}</td>
                                        <td>{renderTooltipCell(ws.forbiddenHours)}</td>

                                        <td>
                                            {(hasRole('admin') || hasRole('centerAdmin' || hasRole('teacher'))) && (
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

                {/* اطلاعات تکمیلی ترم استاد */}
                <div className="mt-5">
                    <h6>اطلاعات تکمیلی ترم</h6>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label className="form-label">متقاضی تدریس در مراکز همجوار هستم</label>
                            <input
                                className="form-control"
                                value={data.termInfo.isNeighborTeaching ? 'بله' : 'خیر'}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">دلایل تدریس در مراکز همجوار</label>
                            <input
                                className="form-control"
                                value={data.termInfo.neighborTeaching || ''}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">مراکز همجوار که تقاضای تدریس دارم</label>
                            <input
                                className="form-control"
                                value={data.termInfo.neighborCenters || ''}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">پیشنهادات</label>
                            <input
                                className="form-control"
                                value={data.termInfo.suggestion || ''}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label className="form-label">برای تدریس نیاز به استفاده از ویدئو پروژکتور دارم</label>
                            <input
                                className="form-control"
                                value={data.termInfo.projector ? 'دارد' : 'ندارد'}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">برای تدریس نیاز به وایت بورد بزرگ دارم</label>
                            <input
                                className="form-control"
                                value={data.termInfo.whiteboard2 ? 'دارد' : 'ندارد'}
                                readOnly
                            />
                        </div>
                        <div className="col-md-6 d-flex align-items-end justify-content-end">
                            {(hasRole('teacher') || hasRole('admin') || hasRole('centerAdmin')) && (
                                <button className="btn btn-outline-primary" onClick={() => setEditItem(true)}>
                                    ✏️ ویرایش اطلاعات ترم
                                </button>
                            )}
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
                            w.id === updated.id ? updated : w
                        )
                        setData(prev => ({ ...prev, weeklySchedule: updatedList }))
                    }}
                />
            )}
            {editTerm && (
                <EditTermModal
                    termInfo={data.termInfo}
                    onClose={() => setEditTerm(false)}
                    onSave={(updatedTerm) => {
                        setData(prev => ({ ...prev, termInfo: updatedTerm }))
                    }}
                />
            )}


        </div>
    )
}
