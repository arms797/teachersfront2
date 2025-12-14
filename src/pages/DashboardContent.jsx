import React, { useState, Suspense, lazy } from 'react'
import api from '../utils/apiClient.js'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext.jsx'
import Sidebar from '../components/Sidebar.jsx'

// همه کامپوننت‌ها lazy
const RoleList = lazy(() => import('../components/dashboard/Roles/RoleList.jsx'))
const ChangePassword = lazy(() => import('../components/dashboard/ChangePassword.jsx'))
const UpdateContact = lazy(() => import('../components/dashboard/UpdateContact.jsx'))
const UserList = lazy(() => import('../components/dashboard/Users/UserList.jsx'))
const TeacherList = lazy(() => import('../components/dashboard/Teachers/TeacherList.jsx'))
const TermCalendarList = lazy(() => import('../components/dashboard/TermSetting/TermCalendarList.jsx'))
const SartermCreator = lazy(() => import('../components/dashboard/TermSetting/SartermCreator.jsx'))
const AnnouncementsManager = lazy(() => import('../components/dashboard/ManageHome/AnnouncementsManager.jsx'))
const ComponentFeaturesManager = lazy(() => import('../components/dashboard/ManageHome/ComponentFeaturesManager.jsx'))
const ExamSeatManage = lazy(() => import('../components/dashboard/ManageHome/ExamSeatManage.jsx'))
// اگر WeeklyScheduleList داری، همینجا lazy کن
// const WeeklyScheduleList = lazy(() => import('../components/dashboard/WeeklySchedule/WeeklyScheduleList.jsx'))

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
                return (
                    <Suspense fallback={<div>در حال بارگذاری لیست کاربران...</div>}>
                        {hasRole('admin') ? <UserList /> : <AccessDenied />}
                    </Suspense>
                )
            case 'roles':
                return (
                    <Suspense fallback={<div>در حال بارگذاری نقش‌ها...</div>}>
                        {hasRole('admin') ? <RoleList /> : <AccessDenied />}
                    </Suspense>
                )
            case 'teachers':
                return (
                    <Suspense fallback={<div>در حال بارگذاری لیست اساتید...</div>}>
                        {hasRole('admin') || hasRole('centerAdmin') || hasRole('programmer')
                            ? <TeacherList /> : <AccessDenied />}
                    </Suspense>
                )
            case 'weeklySchedule':
                return (
                    <Suspense fallback={<div>در حال بارگذاری برنامه هفتگی...</div>}>
                        {hasRole('admin') || hasRole('centerAdmin') || hasRole('programmer')
                            ? <WeeklyScheduleList /> : <AccessDenied />}
                    </Suspense>
                )
            case 'termCalender':
                return (
                    <Suspense fallback={<div>در حال بارگذاری تقویم ترمی...</div>}>
                        {hasRole('admin') ? <TermCalendarList /> : <AccessDenied />}
                    </Suspense>
                )
            case 'sarTerm':
                return (
                    <Suspense fallback={<div>در حال بارگذاری سرترم...</div>}>
                        {hasRole('admin') ? <SartermCreator /> : <AccessDenied />}
                    </Suspense>
                )
            case 'changePassword':
                return (
                    <Suspense fallback={<div>در حال بارگذاری تغییر رمز...</div>}>
                        <ChangePassword />
                    </Suspense>
                )
            case 'updateContact':
                return (
                    <Suspense fallback={<div>در حال بارگذاری تغییر اطلاعات تماس...</div>}>
                        <UpdateContact />
                    </Suspense>
                )
            case 'exam':
                return (
                    <Suspense fallback={<div>در حال بارگزاری صفحه مدیریت NP...</div>}>
                        {hasRole('admin') || hasRole('centerAdmin') ?
                            <ExamSeatManage /> : <AccessDenied />}
                    </Suspense>
                )
            case 'announcement':
                return (
                    <Suspense fallback={<div>در حال بارگزاری صفحه مدیریت اطلاعیه ها...</div>}>
                        {hasRole('admin') || hasRole('centerAdmin') ? <AnnouncementsManager /> : <AccessDenied />}
                    </Suspense>
                )
            case 'manageComponents':
                return (
                    <Suspense fallback={<div>در حال بارگزاری صفحه مدیریت کامپوننت ها...</div>}>
                        {hasRole('admin') ? <ComponentFeaturesManager /> : <AccessDenied />}
                    </Suspense>
                )
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
                            بازگشت به صفحه اصلی
                        </button>
                    </div>
                    {message && <div className="alert alert-info">{message}</div>}
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
