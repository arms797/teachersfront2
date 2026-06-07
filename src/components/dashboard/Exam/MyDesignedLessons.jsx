import React, { useState, useEffect, useCallback } from 'react'
import api from '../../../utils/apiClient.js'
import { useUser } from '../../../context/UserContext.jsx'
import fontAddress from '../../../assets/fonts/Vazir/Vazir-Regular.woff2'
import logo from '../../../assets/logo.png'
import { useTerms } from '../../../context/TermContext.jsx'

export default function MyDesignedLessons() {
    const { hasRole, userInfo } = useUser()
    const { activeTerm } = useTerms()

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

    // تابع دریافت دروسی که استاد جاری طراح سوال است
    const fetchMyDesignedLessons = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            // جستجو بر اساس نام استاد جاری (طراح سوال)
            if (userInfo?.fullName) {
                params.append('questionDesigner', userInfo.fullName)
            } else if (userInfo?.username) {
                params.append('questionDesigner', userInfo.username)
            }

            const res = await api.get(`/api/exams/paged?${params.toString()}`)

            let sortedItems = res.items || []
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
    }, [userInfo?.fullName, userInfo?.username, sortField, sortOrder])

    // تابع مرتب‌سازی
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

    // تابع تبدیل اعداد به فارسی
    function toPersianDigits(str) {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
        return str.toString().replace(/\d/g, d => persianDigits[d])
    }

    // تابع چاپ
    const handlePrint = () => {
        const win = window.open('', '_blank')

        // ساخت HTML برای چاپ
        const rows = exams.map(exam => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.questionDesigner || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.lesson || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.center || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.lessonNoGrp || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.examType || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.sourceNo || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.attachNo || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.examDate || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.start || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.dayOfWeek || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.questionType || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.teacher || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${exam.mobile || '—'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${exam.registered}</td>
            </tr>
        `).join('')

        const html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                @font-face {
                    font-family: 'Vazirmatn';
                    src: url(${fontAddress}) format('woff2');
                }
                body {
                    font-family: 'Vazirmatn', sans-serif;
                    direction: rtl;
                    text-align: right;
                    padding: 40px;
                    background-color: #fff;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header img {
                    width: 80px;
                    height: auto;
                    margin-bottom: 10px;
                }
                .header h2 {
                    font-size: 18px;
                    margin: 5px 0;
                    color: #002864;
                }
                .info-text {
                    margin: 20px 0;
                    line-height: 1.8;
                    font-size: 14px;
                }
                .info-text p {
                    margin: 8px 0;
                }
                .info-text ul {
                    margin: 10px 0;
                    padding-right: 20px;
                }
                .info-text li {
                    margin: 5px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 12px;
                }
                th, td {
                    border: 1px solid #333;
                    padding: 8px;
                    text-align: center;
                    vertical-align: middle;
                }
                th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                }
                .signatures {
                    margin-top: 40px;
                    width: 100%;
                    border: none;
                }
                .signatures td {
                    border: none;
                    text-align: center;
                    font-weight: bold;
                }
                @media print {
                    body {
                        padding: 20px;
                    }
                    button {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="${logo}" alt="آرم دانشگاه" />
                <h2>لیست دروس جهت طراحی سوال در نیمسال ${toPersianDigits(activeTerm)}</h2>                
            </div>

            <div class="info-text">
                <p><strong>استاد محترم (سرکارخانم/جناب آقای) ${userInfo?.fullName || userInfo?.username}</strong></p>
                <p>با سلام و احترام</p>
                <p>پیرو مصوبه ستاد امتحانات استان، مسئولیت طراحی سؤالات دروس مندرج در جدول ذیل به جنابعالی محول شده است.
                مقتضی است به‌منظور فراهم‌سازی بستر بررسی، پشتیبانی و انجام اقدامات تکمیلی، نسبت به طراحی و بارگذاری سؤالات
                مطابق ضوابط ابلاغی، حداکثر تا ۷۲ ساعت پیش از زمان برگزاری آزمون، در سامانه VC به نشانی vc.farspnu.ac.ir اقدام فرمایید.</p>
                <p>همچنین در تنظیم ویژگی‌های آزمون، رعایت موارد زیر ضروری است:</p>
                <ul>
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
                <p>شایان ذکر است هدف از تقسیم‌بندی و توزیع طراحی سؤالات میان اساتید، کاهش بار کاری و ایجاد وحدت رویه در شیوه‌های ارزیابی در سطح استان است.
                پیشاپیش از همکاری و دقت‌ نظر جنابعالی قدردانی می‌شود.</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>نام طراح سوال</th>
                        <th>نام درس</th>
                        <th>مرکز و واحد درس</th>
                        <th>شماره درس و گروه</th>
                        <th>نوع امتحان</th>
                        <th>شماره منبع</th>
                        <th>شرح پیوست</th>
                        <th>تاریخ امتحان</th>
                        <th>ساعت شروع</th>
                        <th>روز هفته</th>
                        <th>نوع طراحی سوال</th>
                        <th>استاد درس</th>
                        <th>شماره همراه استاد</th>
                        <th>تعداد ثبت نام</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>

            
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
        `
        win.document.write(html)
        win.document.close()
    }

    // بارگذاری داده‌ها
    useEffect(() => {
        fetchMyDesignedLessons()
    }, [fetchMyDesignedLessons])

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        <i className="fa fa-pen-ruler fa-2x text-primary ml-2"></i>
                        <h4 className="card-title mb-0">دروسی که طراح سوال هستم</h4>
                    </div>
                    <button className="btn btn-outline-success" onClick={handlePrint}>
                        <i className="fa fa-print ml-2"></i>
                        چاپ فرم
                    </button>
                </div>

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
                                    exams.map((exam) => (
                                        <tr key={exam.id}>
                                            <td>{exam.questionDesigner || '—'}</td>
                                            <td>{exam.lesson || '—'}</td>
                                            <td>{exam.center || '—'}</td>
                                            <td>{exam.lessonNoGrp || '—'}</td>
                                            <td>{exam.examType || '—'}</td>
                                            <td>{exam.sourceNo || '—'}</td>
                                            <td>{exam.attachNo || '—'}</td>
                                            <td>{exam.examDate || '—'}</td>
                                            <td>{exam.start || '—'}</td>
                                            <td>{exam.dayOfWeek || '—'}</td>
                                            <td>{exam.questionType || '—'}</td>
                                            <td>{exam.teacher || '—'}</td>
                                            <td>{exam.mobile || '—'}</td>
                                            <td>{exam.registered}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}