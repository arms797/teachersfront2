import React, { useState } from 'react'
import { useUser } from '../context/UserContext.jsx'
import TeacherSchedule from './dashboard/Teachers/TeacherSchedule.jsx'
import { useTerms } from '../context/TermContext.jsx'

export default function Sidebar({ onSelectPage, onLogout }) {
    const [openGroups, setOpenGroups] = useState({ users: false, teachers: true })
    const { hasRole, loading, userInfo,userRoles } = useUser()
    const { activeTerm } = useTerms()
    const [scheduleCode, setScheduleCode] = useState(null)

    function toggleGroup(key) {
        setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }))
    }

    if (loading) {
        return (
            <aside className="bg-white border-start shadow-sm" style={{ width: 260, minHeight: '100vh' }}>
                <div className="p-3 text-center text-muted">در حال بارگذاری...</div>
            </aside>
        )
    }

    return (
        <aside className="bg-white border-start shadow-sm" style={{ width: 260, minHeight: '100vh' }}>
            <div className="p-3 border-bottom">
                {/*<h6 className="m-0">داشبورد</h6>
                <small className="text-muted">مدیریت سامانه</small>*/}
                <div>
                    {hasRole('admin')}
                </div>
            </div>

            <div className="p-2">

                {/* فقط استاد لاگین‌شده */}
                {hasRole('teacher') && (
                    <button className="btn btn-secondary w-100 text-start py-2 mb-2" onClick={() => setScheduleCode(userInfo.username)}>
                        📅 برنامه حضور هفتگی
                    </button>
                )}

                {/* گروه اساتید */}
                {(hasRole('admin') || hasRole('centerAdmin') || hasRole('programmer')) && (
                    <div className="mb-2">
                        <button className="btn btn-light w-100 text-start py-2" onClick={() => toggleGroup('teachers')}>
                            <span className="ms-2">اساتید</span>
                            <span className="float-end">{openGroups.teachers ? '▾' : '▸'}</span>
                        </button>
                        {openGroups.teachers && (
                            <div className="mt-1">
                                <button className="btn btn-outline-secondary w-100 text-start py-2 mb-1" onClick={() => onSelectPage('teachers')}>
                                    اساتید
                                </button>
                                <button className="btn btn-outline-secondary w-100 text-start py-2 mb-1">
                                    گزارشات
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* تنظیمات سیستمی */}
                {hasRole('admin') && (
                    <div className="mb-2">
                        <button className="btn btn-light w-100 text-start py-2" onClick={() => toggleGroup('users')}>
                            <span className="ms-2">عملیات سیستمی</span>
                            <span className="float-end">{openGroups.users ? '▾' : '▸'}</span>
                        </button>
                        {openGroups.users && (
                            <div className="mt-1">
                                <button className="btn btn-outline-secondary w-100 text-start py-2 mb-1" onClick={() => onSelectPage('termCalender')}>
                                    تقویم ترمی
                                </button>
                                <button className="btn btn-outline-secondary w-100 text-start py-2 mb-1" onClick={() => onSelectPage('sarTerm')}>
                                    سرترم
                                </button>
                                <button className="btn btn-outline-secondary w-100 text-start py-2 mb-1" onClick={() => onSelectPage('users')}>
                                    کاربران
                                </button>
                                <button className="btn btn-outline-secondary w-100 text-start py-2 mb-1" onClick={() => onSelectPage('roles')}>
                                    نقش‌ها
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <hr />

                {/* عملیات کاربر حاضر */}
                <div className="mt-3">
                    <button className="btn btn-outline-secondary w-100 text-start py-2 mb-2" onClick={() => onSelectPage('changePassword')}>
                        تغییر رمز عبور
                    </button>
                    <button className="btn btn-outline-secondary w-100 text-start py-2 mb-2" onClick={() => onSelectPage('updateContact')}>
                        تغییر موبایل/ایمیل
                    </button>
                    <button className="btn btn-outline-danger w-100 text-start py-2" onClick={onLogout}>
                        خروج
                    </button>
                </div>
            </div>

            {scheduleCode && (
                <TeacherSchedule
                    code={scheduleCode}
                    term={activeTerm}
                    onClose={() => setScheduleCode(null)}
                />
            )}
        </aside>
    )
}
