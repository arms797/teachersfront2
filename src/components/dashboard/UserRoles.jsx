import React, { useEffect, useState } from 'react'
import api from '../../utils/apiClient.js'

export default function UserRoles({ user, onBack }) {
    const [roles, setRoles] = useState([])
    const [assigned, setAssigned] = useState([])
    const [message, setMessage] = useState(null)

    useEffect(() => {
        fetchRoles()
    }, [])

    async function fetchRoles() {
        try {
            const all = await api.get('/api/roles')
            const userRoles = await api.get(`/api/users/${user.id}/roles`)
            setRoles(all)
            setAssigned(userRoles.map(r => r.id))
        } catch (err) {
            setMessage('خطا در دریافت نقش‌ها')
        }
    }

    function toggleRole(roleId) {
        setAssigned(prev =>
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        )
    }

    async function handleSave() {
        try {
            await api.post(`/api/users/${user.id}/roles`, assigned)
            setMessage('نقش‌ها با موفقیت ذخیره شدند')
        } catch (err) {
            setMessage('خطا در ذخیره نقش‌ها')
        }
    }

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title">نقش‌های کاربر: {user.fullName}</h6>
                {message && <div className="alert alert-info">{message}</div>}

                <ul className="list-group mb-3">
                    {roles.map(role => (
                        <li key={role.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{role.name}</span>
                            <input
                                type="checkbox"
                                checked={assigned.includes(role.id)}
                                onChange={() => toggleRole(role.id)}
                            />
                        </li>
                    ))}
                </ul>

                <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={handleSave}>
                        ذخیره نقش‌ها
                    </button>
                    <button className="btn btn-secondary" onClick={onBack}>
                        بازگشت
                    </button>
                </div>
            </div>
        </div>
    )
}
