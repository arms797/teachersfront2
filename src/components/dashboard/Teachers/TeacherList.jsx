import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'
import UploadTeacherExcel from './UploadTeacherExcel.jsx'
import UploadSchedulExcel from './UploadSchedulExcel.jsx'
import AddTeacherForm from './AddTeacherForm.jsx'
import EditTeacherForm from './EditTeacherForm.jsx'
import { useCenters } from '../../../context/CenterContext.jsx'
import { useTerms } from '../../../context/TermContext.jsx'
import TeacherSchedule from './TeacherSchedule.jsx'


export default function TeacherList() {
    const { hasRole } = useUser()
    const [teachers, setTeachers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [cooperationType, setCooperationType] = useState('')
    const [center, setCenter] = useState('')
    const [fieldOfStudy, setFieldOfStudy] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize] = useState(30)
    const [totalPages, setTotalPages] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const { centers } = useCenters()
    const { activeTerm } = useTerms()
    const [scheduleCode, setScheduleCode] = useState(null)


    useEffect(() => {
        fetchTeachers()
    }, [searchTerm, cooperationType, center, fieldOfStudy, page])

    async function fetchTeachers() {
        try {
            const res = await api.get('/api/teachers/paged', {
                params: {
                    page,
                    pageSize,
                    search: searchTerm,
                    cooperationType,
                    center,
                    fieldOfStudy
                }
            })
            setTeachers(res.items)
            setTotalPages(Math.ceil(res.totalCount / pageSize))
        } catch (err) {
            console.error('خطا در دریافت لیست صفحه‌بندی‌شده:', err)
        }
    }

    function handleDelete(id) {
        if (!window.confirm('آیا از حذف مطمئن هستید؟')) return
        if (!window.confirm('با حذف استاد اطلاعات دیگر این استاد نیز حذف خواهد شد . آیا مطمئنید ؟')) return
        api.delete(`/api/teachers/${id}`).then(() => fetchTeachers())
    }
    function handleResetPass(id) {
        if (!window.confirm('آیا از بازیابی رمز عبور مطمئن هستید؟')) return
        api.post(`/api/teachers/${id}/reset-password`).then(() => fetchTeachers())
    }

    return (
        <div className="card">
            <div className="card-body">
                {/* هدر و دکمه‌ها */}
                <div className='row'>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="m-0 col-3">اساتید دانشگاه</h4>
                        <div className="d-flex align-items-center col-3">
                            <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
                                ➕ افزودن استاد
                            </button>
                        </div>
                        <UploadTeacherExcel onSuccess={fetchTeachers} className="col-3" />
                        <UploadSchedulExcel className="col-3" />
                    </div>
                </div>

                {/* فیلترها */}
                <div className="row g-2 mb-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="جستجو بر اساس کد، نام یا نام خانوادگی"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={cooperationType}
                            onChange={e => {
                                setCooperationType(e.target.value)
                                setPage(1)
                            }}
                        >
                            <option value="">همه اساتید</option>
                            <option value="عضو هیات علمی">عضو هیات علمی</option>
                            <option value="مدرس مدعو">مدرس مدعو</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="مرکز (مثلاً شیراز)"
                            value={center}
                            onChange={e => {
                                setCenter(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="رشته (مثلاً مهندسی برق)"
                            value={fieldOfStudy}
                            onChange={e => {
                                setFieldOfStudy(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                </div>

                {/* جدول */}
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>کد</th>
                                <th>نام استاد</th>
                                <th>رشته</th>
                                <th>مرکز</th>
                                <th>نوع همکاری</th>
                                <th>موبایل</th>
                                <th>مرتبه علمی/مدرک</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(t => (
                                <tr key={t.id}>
                                    <td>{t.code}</td>
                                    <td>{t.fname} {t.lname}</td>
                                    <td>{t.fieldOfStudy}</td>
                                    <td>
                                        {
                                            centers.find(c => c.centerCode === t.center)?.title || t.center
                                        }
                                    </td>
                                    <td>{t.cooperationType}</td>
                                    <td>{t.mobile}</td>
                                    <td className="text-muted">
                                        <span className={t.cooperationType === 'عضو هیات علمی' ? 'text-primary' : 'text-success'}>
                                            {t.academicRank}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button className="btn btn-sm btn-outline-success" onClick={() => setScheduleCode(t.code)}>
                                                📅 برنامه حضور هفتگی
                                            </button>
                                            {(hasRole('admin') || hasRole('centerAdmin')) && (
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setSelectedTeacher(t)
                                                        setEditModal(true)
                                                    }}
                                                >
                                                    ✏️ ویرایش
                                                </button>
                                            )}
                                            {(hasRole('admin') || hasRole('centerAdmin')) && (
                                                <button className="btn btn-sm btn-outline-info" onClick={() => handleResetPass(t.id)}>
                                                    بازیابی رمز عبور
                                                </button>
                                            )}
                                            {hasRole('admin') && (
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>
                                                    🗑️ حذف
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                {/* صفحه‌بندی بهینه */}
                <nav className="mt-3">
                    <ul className="pagination justify-content-center flex-wrap">
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
                            // صفحه اول + سه‌نقطه
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
                            // صفحات میانی
                            for (let i = start; i <= end; i++) {
                                nodes.push(
                                    <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(i)}>{i}</button>
                                    </li>
                                )
                            }

                            // سه‌نقطه + صفحه آخر
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

                        {/* بعدی */}
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>بعدی</button>
                        </li>
                    </ul>
                </nav>

            </div>
            {/*مودال های استاد جدید و ویرایش استاد */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" >
                        <div className="modal-content" >
                            <div className="modal-header">
                                <h5 className="modal-title">افزودن استاد جدید</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body" >
                                <AddTeacherForm onSuccess={() => {
                                    setShowModal(false)
                                    fetchTeachers()
                                }} />

                            </div>
                        </div>
                    </div>
                </div>
            )}
            {editModal && selectedTeacher && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">ویرایش استاد</h5>
                                <button type="button" className="btn-close" onClick={() => setEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <EditTeacherForm
                                    teacher={selectedTeacher}
                                    onSuccess={() => {
                                        setEditModal(false)
                                        fetchTeachers()
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {scheduleCode && (
                <TeacherSchedule
                    code={scheduleCode}
                    term={activeTerm}
                    //email={email}
                    onClose={() => setScheduleCode(null)}
                />
            )}

        </div>
    )
}
