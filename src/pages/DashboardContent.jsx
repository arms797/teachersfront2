import React, { useState } from 'react'
import api from '../utils/apiClient.js'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import RoleList from '../components/dashboard/Roles/RoleList.jsx'
import ChangePassword from '../components/dashboard/ChangePassword.jsx'
import UpdateContact from '../components/dashboard/UpdateContact.jsx'
import UserList from '../components/dashboard/Users/UserList.jsx'
import TeacherList from '../components/dashboard/Teachers/TeacherList.jsx'
import TermCalendarList from '../components/dashboard/TermSetting/TermCalendarList.jsx'
import SartermCreator from '../components/dashboard/TermSetting/SartermCreator.jsx'

export default function DashboardContent({ onLogout }) {
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('welcome')
    const [message, setMessage] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(true)
    const user = useUser()

    if (!user || user.loading) {
        return <div className="text-center mt-5">در حال بارگذاری اطلاعات کاربر...</div>
    }

    const { hasRole } = user

    async function handleLogout() {
        try {
            await api.post('/api/auth/logout')
            onLogout?.()
            navigate('/', { replace: true })
        } catch (err) {
            setMessage(err.message)
        }
    }

    function AccessDenied() {
        return (
            <div className="alert alert-danger text-center m-4">
                شما مجاز به مشاهده این بخش نیستید.
            </div>
        )
    }

    function renderContent() {
        switch (activePage) {
            case 'users':
                return hasRole('admin') ? <UserList /> : <AccessDenied />
            case 'roles':
                return hasRole('admin') ? <RoleList /> : <AccessDenied />
            case 'teachers':
                return hasRole('admin') || hasRole('centerAdmin') || hasRole('programmer')
                    ? <TeacherList /> : <AccessDenied />
            case 'weeklySchedule':
                return hasRole('admin') || hasRole('centerAdmin') || hasRole('programmer')
                    ? <WeeklyScheduleList /> : <AccessDenied />
            case 'termCalender':
                return hasRole('admin') ? <TermCalendarList /> : <AccessDenied />
            case 'sarTerm':
                return hasRole('admin') ? <SartermCreator /> : <AccessDenied />
            case 'weeklyTT':
                return hasRole('teacher')
            case 'changePassword':
                return <ChangePassword />
            case 'updateContact':
                return <UpdateContact />
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
    function toggleSidebar() {
        setSidebarVisible(prev => !prev)
    }

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {sidebarVisible && (
                <Sidebar onSelectPage={setActivePage} onLogout={handleLogout} />
            )}
            <main className={`flex-grow-1 ${sidebarVisible ? 'with-sidebar' : 'full-width'}`}>
                <div className="container-fluid p-2">
                    {/* هدر داخلی با دکمه همبرگری */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={toggleSidebar}
                            style={{ fontSize: '1.4rem' }}
                        >
                            ☰
                        </button>
                        <h5 className="m-0"> زمانبندی برنامه هفتگی اساتید</h5>
                        <button className='btn btn-secondary'
                            onClick={() => setActivePage('welcome')}
                        >
                            بازگشت به صفحه اصلی</button>
                    </div>
                    {message && <div className="alert alert-info">{message}</div>}
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
