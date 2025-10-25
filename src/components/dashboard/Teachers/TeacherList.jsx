import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'
import UploadTeacherExcel from './UploadTeacherExcel.jsx'
import AddTeacherForm from './AddTeacherForm.jsx'


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

    function handleWeeklySchedule(code) {
        alert(`نمایش برنامه هفتگی برای استاد با کد: ${code}`)
    }

    return (
        <div className="card">
            <div className="card-body">
                {/* هدر و دکمه‌ها */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0">اساتید دانشگاه</h5>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
                            ➕ افزودن استاد
                        </button>
                    </div>
                    <UploadTeacherExcel onSuccess={fetchTeachers} />
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
                                    <td>{t.center}</td>
                                    <td>{t.cooperationType}</td>
                                    <td>{t.mobile}</td>
                                    <td className="text-muted">
                                        <span className={t.cooperationType === 'عضو هیات علمی' ? 'text-primary' : 'text-success'}>
                                            {t.academicRank}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="d-flex gap-1">
                                            <button className="btn btn-sm btn-outline-success" onClick={() => handleWeeklySchedule(t.code)}>
                                                📅 برنامه حضور هفتگی
                                            </button>
                                            <button className="btn btn-sm btn-outline-primary">✏️ ویرایش</button>
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

                {/* صفحه‌بندی */}
                <nav className="mt-3">
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">افزودن استاد جدید</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <AddTeacherForm onSuccess={() => {
                                    setShowModal(false)
                                    fetchTeachers()
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
