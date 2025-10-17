import React, { useEffect, useState } from 'react'
import api from '../../utils/apiClient.js'

export default function UserRolesModal({ user, onClose, onSuccess }) {
    const [roles, setRoles] = useState([])
    const [userRoles, setUserRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const allRoles = await api.get('/api/roles')
                const assignedRoles = await api.get(`/api/users/${user.id}/roles`)
                setRoles(allRoles)
                setUserRoles(assignedRoles.map(r => r.roleId))
                //console.log('نقش‌های کاربر:', assignedRoles)
                //console.log('شناسه نقش‌ها:', assignedRoles.map(r => r.roleId))

            } catch (err) {
                setMessage('خطا در دریافت نقش‌ها')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user.id])

    async function assignRole(roleId) {
        try {
            await api.post(`/api/users/${user.id}/roles/${roleId}`)
            setUserRoles(prev => [...prev, roleId])
        } catch (err) {
            setMessage('خطا در تخصیص نقش')
        }
    }

    async function removeRole(roleId) {
        try {
            await api.delete(`/api/users/${user.id}/roles/${roleId}`)
            setUserRoles(prev => prev.filter(id => id !== roleId))
        } catch (err) {
            setMessage('خطا در حذف نقش')
        }
    }

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: '#00000066' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content text-end" style={{ direction: 'rtl' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">نقش‌های کاربر: {user.firstName} {user.lastName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {message && <div className="alert alert-info">{message}</div>}

                        {loading ? (
                            <div>در حال بارگذاری نقش‌ها...</div>
                        ) : (
                            <table className="table table-bordered table-sm text-center">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>عنوان نقش</th>
                                        <th>عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((role, index) => {
                                        const hasRole = userRoles.includes(role.id)
                                        return (
                                            <tr key={role.id}>
                                                <td>{index + 1}</td>
                                                <td>{role.title}</td>
                                                <td>
                                                    {hasRole ? (
                                                        <button className="btn btn-danger btn-sm" onClick={() => removeRole(role.id)}>
                                                            عدم تخصیص نقش
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-success btn-sm" onClick={() => assignRole(role.id)}>
                                                            تخصیص نقش
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {roles.length === 0 && (
                                        <tr>
                                            <td colSpan="3">هیچ نقشی یافت نشد.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
