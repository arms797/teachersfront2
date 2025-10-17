import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'
import RoleModal from './RoleModal.jsx'

export default function RoleList() {
    const [roles, setRoles] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)

    useEffect(() => {
        fetchRoles()
    }, [])

    async function fetchRoles() {
        const res = await api.get('/api/roles')
        setRoles(res)
    }

    function openAddModal() {
        setSelectedRole(null)
        setShowModal(true)
    }

    function openEditModal(role) {
        setSelectedRole(role)
        setShowModal(true)
    }
    async function handleDelete(roleId) {
        if (!window.confirm('آیا از حذف این نقش مطمئن هستید؟')) return
        try {
            await api.delete(`/api/roles/${roleId}`)
            fetchRoles()
        } catch (err) {
            console.error('خطا در حذف نقش:', err)
        }
    }


    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
                <h6 className="mb-0">مدیریت نقش‌ها</h6>
                <button className="btn btn-success btn-sm ms-auto" onClick={openAddModal}>
                    افزودن نقش جدید
                </button>
            </div>

            <table className="table table-bordered table-sm text-center">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>عنوان</th>
                        <th>توضیحات</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role, index) => (
                        <tr key={role.id}>
                            <td>{index + 1}</td>
                            <td>{role.title}</td>
                            <td>{role.description}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(role)}>
                                    ویرایش
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(role.id)}>
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <RoleModal
                    role={selectedRole}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchRoles}
                />
            )}
        </div>
    )
}
