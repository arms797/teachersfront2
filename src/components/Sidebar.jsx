import React, { useState } from 'react'
import { useUser } from '../context/UserContext.jsx'

export default function Sidebar({ onSelectPage, onLogout }) {
    const [openGroups, setOpenGroups] = useState({ users: false, teachers: true })
    const { hasRole, loading } = useUser()

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
                <h6 className="m-0">داشبورد</h6>
                <small className="text-muted">مدیریت سامانه</small>
            </div>

            <div className="p-1">
                {/*فقط توسط استادی که لاگین کرده نمایش داده میشود */}
                {(hasRole('teacher')) && (
                    <button className="btn btn-outline-secondary w-100 mb-2" onClick={() => onSelectPage('weeklyTT')}>
                        برنامه زمانبندی هفتگی
                    </button>
                )}

                {/* گروه اساتید */}
                {(hasRole('admin') || hasRole('centerAdmin') || hasRole('programmer')) && (
                    <div className="mb-2">
                        <button className="btn btn-light w-100 text-start" onClick={() => toggleGroup('teachers')}>
                            <span className="ms-2">اساتید</span>
                            <span className="float-end">{openGroups.teachers ? '▾' : '▸'}</span>
                        </button>
                        {openGroups.teachers && (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <button className="btn btn-outline-secondary w-100 mb-1" onClick={() => onSelectPage('teachers')}>
                                        اساتید
                                    </button>
                                </li>
                                <li className="list-group-item">
                                    <button className="btn btn-outline-secondary w-100 mb-1">
                                        گزارشات
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                )}

                {/* تنظیمات سیستمی*/}
                {hasRole('admin') && (
                    <div className="mb-2">
                        <button className="btn btn-light w-100 text-start" onClick={() => toggleGroup('users')}>
                            <span className="ms-2">عملیات سیستمی</span>
                            <span className="float-end">{openGroups.users ? '▾' : '▸'}</span>
                        </button>
                        {openGroups.users && (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <button className="btn btn-outline-secondary w-100 mb-1" onClick={() => onSelectPage('termCalender')}>
                                        تقویم ترمی
                                    </button>
                                </li>
                                <li className="list-group-item">
                                    <button className="btn btn-outline-secondary w-100 mb-1" onClick={() => onSelectPage('sarTerm')}>
                                        سرترم
                                    </button>
                                </li>
                                <li className="list-group-item">
                                    <button className="btn btn-outline-secondary w-100 mb-1" onClick={() => onSelectPage('users')}>
                                        کاربران
                                    </button>
                                </li>
                                <li className="list-group-item">
                                    <button className="btn btn-outline-secondary w-100 mb-1" onClick={() => onSelectPage('roles')}>
                                        نقش‌ها
                                    </button>
                                </li>

                            </ul>
                        )}
                    </div>
                )}

                <hr />

                {/* عملیات کاربر حاضر */}
                <div className="mt-3">
                    <button className="btn btn-outline-secondary w-100 mb-2" onClick={() => onSelectPage('changePassword')}>
                        تغییر رمز عبور
                    </button>

                    <button className="btn btn-outline-secondary w-100 mb-2" onClick={() => onSelectPage('updateContact')}>
                        تغییر موبایل/ایمیل
                    </button>

                    <button className="btn btn-outline-danger w-100" onClick={onLogout}>
                        خروج
                    </button>
                </div>
            </div>
        </aside>
    )
}
