import React, { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import Roles from '../components/dashboard/Roles.jsx'
import ResetPassword from '../components/dashboard/ResetPassword.jsx'
import ChangePassword from '../components/dashboard/ChangePassword.jsx'
import UpdateContact from '../components/dashboard/UpdateContact.jsx'
import UserList from '../components/dashboard/UserList.jsx'

import api from '../utils/apiClient.js'
import { useNavigate } from 'react-router-dom'

export default function Dashboard({ onLogout }) {
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('welcome')
    const [message, setMessage] = useState(null)

    async function handleLogout() {
        try {
            await api.post('/api/auth/logout')
            onLogout?.()
            navigate('/', { replace: true })
        } catch (err) {
            setMessage(err.message)
        }
    }

    function renderContent() {
        switch (activePage) {
            case 'users': return <UserList />
            case 'roles': return <Roles />
            case 'reset': return <ResetPassword />
            case 'changePassword': return <ChangePassword />
            case 'updateContact': return <UpdateContact />
            case 'users': return <UserList />

            default:
                return (
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">خوش آمدید</h6>
                            <p className="text-muted m-0">
                                از منوی سمت راست یک بخش را انتخاب کنید تا محتوای آن در اینجا نمایش داده شود.
                            </p>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <Sidebar
                onSelectPage={setActivePage}
                onLogout={handleLogout}
            />

            <main className="flex-grow-1">
                <Header />
                <div className="container-fluid p-3">
                    {message && <div className="alert alert-info">{message}</div>}
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
