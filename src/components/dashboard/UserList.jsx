import React, { useEffect, useState } from 'react'
import api from '../../utils/apiClient.js'

export default function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        setLoading(true)
        try {
            const res = await api.get('/api/users')
            setUsers(res)
        } catch (err) {
            setError('خطا در دریافت کاربران')
        } finally {
            setLoading(false)
        }
    }

    async function toggleActive(userId) {
        try {
            await api.post(`/api/users/${userId}/toggle-active`)
            fetchUsers()
        } catch (err) {
            alert('خطا در تغییر وضعیت کاربر')
        }
    }

    function handleEdit(user) {
        alert(`ویرایش کاربر: ${user.username}`)
        // اینجا می‌تونی فرم ویرایش را باز کنی
    }

    function handleRoles(user) {
        alert(`مدیریت نقش‌های کاربر: ${user.username}`)
        // اینجا می‌تونی مودال نقش‌ها را باز کنی
    }

    function handleAddUser() {
        alert('افزودن کاربر جدید')
        // اینجا می‌تونی فرم افزودن را باز کنی
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">لیست کاربران</h6>
                <button className="btn btn-success btn-sm" onClick={handleAddUser}>
                    افزودن کاربر جدید
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div>در حال بارگذاری...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>نام کاربری</th>
                                <th>نام کامل</th>
                                <th>ایمیل</th>
                                <th>موبایل</th>
                                <th>مرکز</th> {/* ستون جدید */}
                                <th>وضعیت</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, index) => (
                                <tr key={u.id}>
                                    <td>{index + 1}</td>
                                    <td>{u.username}</td>
                                    <td>{u.fullName}</td>
                                    <td>{u.email}</td>
                                    <td>{u.mobile}</td>
                                    <td>{u.centerName || '—'}</td> {/* مقدار مرکز */}
                                    <td>
                                        <span className={`badge bg-${u.isActive ? 'success' : 'secondary'}`}>
                                            {u.isActive ? 'فعال' : 'غیرفعال'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1 justify-content-center">
                                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleRoles(u)}>
                                                نقش‌ها
                                            </button>
                                            <button className="btn btn-outline-warning btn-sm" onClick={() => handleEdit(u)}>
                                                ویرایش
                                            </button>
                                            <button
                                                className={`btn btn-sm ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                onClick={() => toggleActive(u.id)}
                                            >
                                                {u.isActive ? 'غیرفعال' : 'فعال'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="8">هیچ کاربری یافت نشد.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            )}
        </div>
    )
}
