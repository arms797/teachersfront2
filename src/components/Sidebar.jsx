import React, { useState } from 'react'
import { useUser } from '../context/UserContext.jsx'
import TeacherSchedule from './dashboard/Teachers/TeacherSchedule.jsx'
import { useTerms } from '../context/TermContext.jsx'

export default function Sidebar({ onSelectPage, onLogout }) {
  const [openGroups, setOpenGroups] = useState({ users: false, teachers: true, home: false })
  const { hasRole, loading, userInfo } = useUser()
  const { activeTerm } = useTerms()
  const [scheduleCode, setScheduleCode] = useState(null)

  function toggleGroup(key) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <aside className="sidebar">
        <div className="loading">در حال بارگذاری...</div>
      </aside>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h6>داشبورد</h6>
        {/*<small>مدیریت سامانه</small>*/}
      </div>

      <nav className="sidebar-nav">

        {hasRole('teacher') && (
          <div className="nav-item" onClick={() => setScheduleCode(userInfo.username)}>
            <i className="fa fa-calendar"></i>
            <span>برنامه حضور هفتگی</span>
          </div>
        )}

        {(hasRole('admin') || hasRole('centerAdmin') || hasRole('programmer')) && (
          <div className="nav-group">
            <div className="nav-group-header" onClick={() => toggleGroup('teachers')}>
              <i className="fa fa-users"></i>
              <span>اساتید</span>
              <i className={`fa ${openGroups.teachers ? 'fa-chevron-down' : 'fa-chevron-right'} ms-auto`}></i>
            </div>
            {openGroups.teachers && (
              <div className="nav-sub">
                <div className="nav-item" onClick={() => onSelectPage('teachers')}>
                  <i className="fa fa-user"></i>
                  <span>لیست اساتید</span>
                </div>
                <div className="nav-item" onClick={() => onSelectPage('rptFormCompletion')}>
                  <i className="fa fa-file-alt"></i>
                  <span>گزارش تکمیل فرم برنامه هفتگی</span>
                </div>
                <div className="nav-item" onClick={() => onSelectPage('rptDaily')}>
                  <i className="fa fa-file-alt"></i>
                  <span> گزارش برنامه روزانه اساتید</span>
                </div>
              </div>
            )}
          </div>
        )}

        {(hasRole('admin')) && (
          <div className="nav-group">
            <div className="nav-group-header" onClick={() => toggleGroup('home')}>
              <i className="fa fa-cogs"></i>
              <span>مدیریت صفحه نخست</span>
              <i className={`fa ${openGroups.home ? 'fa-chevron-down' : 'fa-chevron-right'} ms-auto`}></i>
            </div>
            {openGroups.home && (
              <div className="nav-sub">
                <div className="nav-item" onClick={() => onSelectPage('exam')}>
                  <i className="fa fa-calendar-alt"></i>
                  <span>حوزه آزمونی دانشجو</span>
                </div>
                <div className="nav-item" onClick={() => onSelectPage('announcement')}>
                  <i className="fa fa-calendar-alt"></i>
                  <span>اطلاعیه ها</span>
                </div>
                <div className="nav-item" onClick={() => onSelectPage('manageComponents')}>
                  <i className="fa fa-calendar-alt"></i>
                  <span>مدیریت کامپوننت ها</span>
                </div>
              </div>
            )}
          </div>
        )}

        {hasRole('admin') && (
          <div className="nav-group">
            <div className="nav-group-header" onClick={() => toggleGroup('users')}>
              <i className="fa fa-cogs"></i>
              <span>عملیات سیستمی</span>
              <i className={`fa ${openGroups.users ? 'fa-chevron-down' : 'fa-chevron-right'} ms-auto`}></i>
            </div>
            {openGroups.users && (
              <div className="nav-sub">
                <div className="nav-item" onClick={() => onSelectPage('termCalender')}>
                  <i className="fa fa-calendar-alt"></i>
                  <span>تقویم ترمی</span>
                </div>
                <div className="nav-item" onClick={() => onSelectPage('sarTerm')}>
                  <i className="fa fa-layer-group"></i>
                  <span>سرترم</span>
                </div>
                <div className="nav-item" onClick={() => onSelectPage('users')}>
                  <i className="fa fa-user-cog"></i>
                  <span>کاربران</span>
                </div>
                <div className="nav-item" onClick={() => onSelectPage('roles')}>
                  <i className="fa fa-id-badge"></i>
                  <span>نقش‌ها</span>
                </div>
              </div>
            )}
          </div>
        )}

        <hr />

        <div className="nav-item" onClick={() => onSelectPage('changePassword')}>
          <i className="fa fa-key"></i>
          <span>تغییر رمز عبور</span>
        </div>
        <div className="nav-item" onClick={() => onSelectPage('updateContact')}>
          <i className="fa fa-envelope"></i>
          <span>تغییر موبایل/ایمیل</span>
        </div>
        <div className="nav-item logout" onClick={onLogout}>
          <i className="fa fa-sign-out-alt"></i>
          <span>خروج</span>
        </div>
      </nav>

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
