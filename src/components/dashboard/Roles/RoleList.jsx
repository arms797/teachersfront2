import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'

export default function RoleList() {
    const [roles, setRoles] = useState([])

    useEffect(() => {
        fetchRoles()
    }, [])

    async function fetchRoles() {
        const res = await api.get('/api/roles')
        setRoles(res)
    }

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
                <h6 className="mb-0">مدیریت نقش‌ها</h6>
                <button className="btn btn-success btn-sm ms-auto" disabled>
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
                                <button className="btn btn-warning btn-sm me-2" disabled>
                                    ویرایش
                                </button>
                                <button className="btn btn-danger btn-sm" disabled>
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
