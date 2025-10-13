import React, { useEffect, useState } from 'react'
import api from '../../utils/apiClient.js'
import UserModal from './UserModal.jsx'


export default function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('add')
    const [selectedUser, setSelectedUser] = useState(null)

    function openAddModal() {
        setModalMode('add')
        setSelectedUser(null)
        setShowModal(true)
    }

    function openEditModal(user) {
        setModalMode('edit')
        setSelectedUser(user)
        setShowModal(true)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        setLoading(true)
        try {
            const res = await api.get('/api/users')
            setUsers(res)
        } catch (err) {
            setMessage('خطا در دریافت کاربران')
        } finally {
            setLoading(false)
        }
    }

    async function toggleActive(userId) {
        try {
            await api.post(`/api/users/${userId}/toggle-active`)
            fetchUsers()
        } catch (err) {
            setMessage('خطا در تغییر وضعیت کاربر')
        }
    }

    function handleAddUser() {
        const username = prompt('نام کاربری:')
        const fullName = prompt('نام کامل:')
        const password = prompt('رمز عبور:')
        if (!username || !fullName || !password) return

        api.post('/api/users', { username, fullName, password })
            .then(() => {
                setMessage('کاربر جدید افزوده شد')
                fetchUsers()
            })
            .catch(err => setMessage(err.message))
    }

    function handleEdit(user) {
        const fullName = prompt('نام جدید:', user.fullName)
        if (!fullName) return

        api.put(`/api/users/${user.id}`, { ...user, fullName })
            .then(() => {
                setMessage('ویرایش انجام شد')
                fetchUsers()
            })
            .catch(err => setMessage(err.message))
    }

    function handleRoles(user) {
        alert(`نقش‌های کاربر ${user.fullName} هنوز پیاده‌سازی نشده`)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">لیست کاربران</h6>
                <button className="btn btn-success btn-sm" onClick={openAddModal}>
                    افزودن کاربر جدید
                </button>
            </div>

            {message && <div className="alert alert-info">{message}</div>}
            {loading ? (
                <div>در حال بارگذاری...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>نام کاربری</th>
                                <th>نام</th>
                                <th>نام خانوادگی</th>
                                <th>ایمیل</th>
                                <th>موبایل</th>
                                <th>وضعیت</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, index) => (
                                <tr key={u.id}>
                                    <td>{index + 1}</td>
                                    <td>{u.username}</td>
                                    <td>{u.firstName}</td>
                                    <td>{u.lastName}</td>
                                    <td>{u.email}</td>
                                    <td>{u.mobile}</td>
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
                                            <button className="btn btn-outline-warning btn-sm" onClick={() => openEditModal(u)}>
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
                                    <td colSpan="7">هیچ کاربری یافت نشد.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {showModal && (
                <UserModal
                    mode={modalMode}
                    user={selectedUser}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                />
            )}

        </div>
    )
}
