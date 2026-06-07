import React, { useState, useEffect, useCallback } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'

export default function MyLessons() {
    const { hasRole, userInfo } = useUser()

    // حالت‌ها
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(false)

    // برای مرتب‌سازی
    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')

    // بررسی دسترسی (فقط استاد)
    if (!hasRole('teacher')) {
        return (
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="alert alert-danger text-center">
                        <i className="fa fa-ban ml-2"></i>
                        شما مجاز به دسترسی به این بخش نیستید.
                    </div>
                </div>
            </div>
        )
    }

    // تابع دریافت دروس استاد (بدون فیلتر)
    const fetchMyLessons = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            // جستجو بر اساس کد استاد از اطلاعات کاربر جاری
            if (userInfo?.username) {
                params.append('teacherCode', userInfo.username)
            }

            const res = await api.get(`/api/exams/paged?${params.toString()}`)

            // مرتب‌سازی در فرانت‌اند: اول رکوردهایی که استاد جاری طراح سوال است، سپس بر اساس تاریخ
            let sortedItems = sortExamsByPriority(res.items || [])

            // اعمال مرتب‌سازی اضافی بر اساس کلیک کاربر
            if (sortField) {
                sortedItems = applySorting(sortedItems, sortField, sortOrder)
            }

            setExams(sortedItems)
        } catch (err) {
            console.error('خطا در دریافت دروس:', err)
            alert('❌ خطا در دریافت لیست دروس')
        } finally {
            setLoading(false)
        }
    }, [userInfo?.username, sortField, sortOrder])

    // تابع مرتب‌سازی بر اساس فیلد و جهت انتخاب شده
    const applySorting = (items, field, order) => {
        return [...items].sort((a, b) => {
            let valA = a[field] || ''
            let valB = b[field] || ''

            if (field === 'registered') {
                valA = parseInt(valA) || 0
                valB = parseInt(valB) || 0
            }

            if (order === 'asc') {
                return valA > valB ? 1 : valA < valB ? -1 : 0
            } else {
                return valA < valB ? 1 : valA > valB ? -1 : 0
            }
        })
    }

    // تابع مرتب‌سازی: اول رکوردهایی که استاد جاری طراح سوال است، سپس بر اساس تاریخ و ساعت
    const sortExamsByPriority = (items) => {
        return [...items].sort((a, b) => {
            const aIsDesigner = isTeacherAndDesignerSame(a)
            const bIsDesigner = isTeacherAndDesignerSame(b)

            if (aIsDesigner && !bIsDesigner) return -1
            if (!aIsDesigner && bIsDesigner) return 1

            const aDateValid = a.examDate && a.examDate.length >= 8
            const bDateValid = b.examDate && b.examDate.length >= 8

            if (aDateValid && !bDateValid) return -1
            if (!aDateValid && bDateValid) return 1

            if (a.examDate && b.examDate) {
                const dateCompare = b.examDate.localeCompare(a.examDate)
                if (dateCompare !== 0) return dateCompare
            }

            if (a.start && b.start) {
                return a.start.localeCompare(b.start)
            }

            return 0
        })
    }

    // تابع بررسی اینکه آیا استاد درس همان طراح سوال است
    const isTeacherAndDesignerSame = (exam) => {
        if (!exam.teacher || !exam.questionDesigner) return false
        const teacherName = exam.teacher.replace(/\s+/g, ' ').trim()
        const designerName = exam.questionDesigner.replace(/\s+/g, ' ').trim()
        return teacherName === designerName
    }

    // تابع مدیریت کلیک روی هدر ستون
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    // نمایش آیکون مرتب‌سازی
    const getSortIcon = (field) => {
        if (sortField !== field) return <i className="fa fa-sort text-muted ms-1" style={{ fontSize: '12px' }}></i>
        return sortOrder === 'asc'
            ? <i className="fa fa-sort-asc text-primary ms-1" style={{ fontSize: '12px' }}></i>
            : <i className="fa fa-sort-desc text-primary ms-1" style={{ fontSize: '12px' }}></i>
    }

    // بارگذاری داده‌ها
    useEffect(() => {
        fetchMyLessons()
    }, [fetchMyLessons])

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                {/* ================================ */}
                {/* متن راهنما و توضیحات */}
                {/* ================================ */}
                <div className="card mb-4 border-info bg-light">
                    <div className="card-body">
                        <div className="text-right">
                            <p className="mb-2">
                                <strong>استاد محترم (سرکارخانم/جناب آقای) {userInfo?.fullName || userInfo?.username}</strong>
                            </p>
                            <p className="mb-2">
                                با سلام و احترام
                            </p>
                            <p className="mb-2">
                                پیرو مصوبه ستاد امتحانات استان، مسئولیت طراحی سؤالات دروس مندرج در جدول ذیل به جنابعالی محول شده است.
                                مقتضی است به‌منظور فراهم‌سازی بستر بررسی، پشتیبانی و انجام اقدامات تکمیلی، نسبت به طراحی و بارگذاری سؤالات
                                مطابق ضوابط ابلاغی، حداکثر تا ۷۲ ساعت پیش از زمان برگزاری آزمون، در سامانه VC به نشانی <a href="http://vc.farspnu.ac.ir" target="_blank" rel="noopener noreferrer">vc.farspnu.ac.ir</a> اقدام فرمایید.
                            </p>
                            <p className="mb-2">
                                همچنین در تنظیم ویژگی‌های آزمون، رعایت موارد زیر ضروری است:
                            </p>
                            <ul className="mb-2">
                                <li>عنوان آزمون به‌صورت کامل درج شود (برای نمونه: «آزمون پایان‌ترم درس زبان تخصصی مدیریت»).</li>
                                <li>تاریخ و زمان شروع آزمون مطابق با زمان‌بندی اعلام‌شده تنظیم و زمان تأخیر مجاز ورود به آزمون حداقل ۵ دقیقه تعیین شود.</li>
                                <li>در بخش توضیحات آزمون تصریح شود که امکان بازگشت به سؤالات قبلی و اصلاح پاسخ‌ها وجود ندارد.</li>
                                <li>گزینه‌های «نمایش نمره»، «نمایش هر سؤال در یک صفحه»، «تصادفی سازی سوالات» و «تصادفی‌سازی ترتیب گزینه‌ها» فعال و گزینه «امکان بازگشت و ویرایش پاسخ پس از ثبت» غیرفعال باشد.</li>
                                <li>مدت پاسخ‌گویی هر سؤال متناسب با سطح دشواری و نوع آن تعیین و برای هر سؤال حداقل یک دقیقه در نظر گرفته شود.</li>
                                <li>در طراحی سؤالات، منبع درسی، مفاد پیوست (حذفیات) و نوع آزمون به‌دقت لحاظ شود.</li>
                                <li>سؤالات با توزیع منطقی و متوازن از کلیه مباحث منبع درسی تدوین شود.</li>
                                <li>حتی‌الامکان، چینش سؤالات و گزینه‌ها به‌صورت تصادفی تنظیم شود.</li>
                                <li>در مواردی که پاسخ هر سؤال مستقل از سایر سؤالات است، امکان بازگشت به سؤالات قبلی غیرفعال شود (به‌منظور کاهش احتمال تقلب و اشتراک‌گذاری سؤالات).</li>
                                <li>در آزمون‌های تستی، حداقل ۳۰ سؤال و در آزمون‌های تشریحی، حداقل ۱۰ سؤال طراحی شود؛ به‌نحوی‌که به‌ترتیب ۲۴ سؤال تستی و ۴ سؤال تشریحی به‌صورت تصادفی برای هر دانشجو نمایش داده شود. (افزایش تعداد سؤالات در بانک، به ارتقای امنیت و سلامت آزمون کمک می‌کند.)</li>
                            </ul>
                            <p className="mb-0">
                                شایان ذکر است هدف از تقسیم‌بندی و توزیع طراحی سؤالات میان اساتید، کاهش بار کاری و ایجاد وحدت رویه در شیوه‌های ارزیابی در سطح استان است.
                                پیشاپیش از همکاری و دقت‌ نظر جنابعالی قدردانی می‌شود.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================================ */}
                {/* بخش جدول دروس */}
                {/* ================================ */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">در حال بارگذاری...</span>
                        </div>
                        <p className="mt-2 text-muted">در حال دریافت اطلاعات...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped">
                            <thead className="table-light">
                                <tr>
                                    <th>نام طراح سوال</th>
                                    <th
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('lesson')}
                                    >
                                        نام درس {getSortIcon('lesson')}
                                    </th>
                                    <th>مرکز و واحد درس</th>
                                    <th>شماره درس و گروه</th>
                                    <th>نوع امتحان</th>
                                    <th
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('sourceNo')}
                                    >
                                        شماره منبع {getSortIcon('sourceNo')}
                                    </th>
                                    <th>شرح پیوست</th>
                                    <th
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('examDate')}
                                    >
                                        تاریخ امتحان {getSortIcon('examDate')}
                                    </th>
                                    <th>ساعت شروع</th>
                                    <th>روز هفته</th>
                                    <th>نوع طراحی سوال</th>
                                    <th>استاد درس</th>
                                    <th>شماره همراه استاد</th>
                                    <th
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('registered')}
                                    >
                                        تعداد ثبت نام {getSortIcon('registered')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.length === 0 ? (
                                    <tr>
                                        <td colSpan="14" className="text-center text-muted py-4">
                                            <i className="fa fa-info-circle ml-1"></i>
                                            هیچ درسی یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    exams.map((exam) => {
                                        const isBold = isTeacherAndDesignerSame(exam)
                                        const rowStyle = isBold ? { fontWeight: 'bold', backgroundColor: '#f0f8ff' } : {}

                                        return (
                                            <tr key={exam.id} style={rowStyle}>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.questionDesigner || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.lesson || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.center || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.lessonNoGrp || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.examType || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.sourceNo || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.attachNo || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.examDate || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.start || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.dayOfWeek || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.questionType || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.teacher || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.mobile || '—'}</td>
                                                <td style={isBold ? { fontWeight: 'bold' } : {}}>{exam.registered}</td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}