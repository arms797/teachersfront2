import{b as D,c as k,r as a,j as e,a as C,f as z,l as T}from"./index-BS0D0uCv.js";function E(){const{hasRole:f,userInfo:r}=D(),{activeTerm:u}=k(),[p,b]=a.useState([]),[y,g]=a.useState(!1),[c,N]=a.useState(null),[o,m]=a.useState("asc");if(!f("teacher"))return e.jsx("div",{className:"card shadow-sm",children:e.jsx("div",{className:"card-body",children:e.jsxs("div",{className:"alert alert-danger text-center",children:[e.jsx("i",{className:"fa fa-ban ml-2"}),"شما مجاز به دسترسی به این بخش نیستید."]})})});const j=a.useCallback(async()=>{g(!0);try{const t=new URLSearchParams;r?.fullName?t.append("questionDesigner",r.fullName):r?.username&&t.append("questionDesigner",r.username);let i=(await C.get(`/api/exams/paged?${t.toString()}`)).items||[];c&&(i=v(i,c,o)),b(i)}catch(t){console.error("خطا در دریافت دروس:",t),alert("❌ خطا در دریافت لیست دروس")}finally{g(!1)}},[r?.fullName,r?.username,c,o]),v=(t,d,i)=>[...t].sort((s,S)=>{let l=s[d]||"",n=S[d]||"";return d==="registered"&&(l=parseInt(l)||0,n=parseInt(n)||0),i==="asc"?l>n?1:l<n?-1:0:l<n?1:l>n?-1:0}),h=t=>{c===t?m(o==="asc"?"desc":"asc"):(N(t),m("asc"))},x=t=>c!==t?e.jsx("i",{className:"fa fa-sort text-muted ms-1",style:{fontSize:"12px"}}):o==="asc"?e.jsx("i",{className:"fa fa-sort-asc text-primary ms-1",style:{fontSize:"12px"}}):e.jsx("i",{className:"fa fa-sort-desc text-primary ms-1",style:{fontSize:"12px"}});function w(t){const d=["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];return t.toString().replace(/\d/g,i=>d[i])}const $=()=>{const t=window.open("","_blank"),d=p.map(s=>`
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.questionDesigner||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.lesson||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.center||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.lessonNoGrp||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.examType||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.sourceNo||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.attachNo||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.examDate||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.start||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.dayOfWeek||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.questionType||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.teacher||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${s.mobile||"—"}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${s.registered}</td>
            </tr>
        `).join(""),i=`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                @font-face {
                    font-family: 'Vazirmatn';
                    src: url(${z}) format('woff2');
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
                <img src="${T}" alt="آرم دانشگاه" />
                <h2>لیست دروس جهت طراحی سوال در نیمسال ${w(u)}</h2>                
            </div>

            <div class="info-text">
                <p><strong>استاد محترم (سرکارخانم/جناب آقای) ${r?.fullName||r?.username}</strong></p>
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
                    ${d}
                </tbody>
            </table>

            
            <script>
                window.onload = function() {
                    window.print();
                }
            <\/script>
        </body>
        </html>
        `;t.document.write(i),t.document.close()};return a.useEffect(()=>{j()},[j]),e.jsx("div",{className:"card shadow-sm",children:e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("i",{className:"fa fa-pen-ruler fa-2x text-primary ml-2"}),e.jsx("h4",{className:"card-title mb-0",children:"دروسی که طراح سوال هستم"})]}),e.jsxs("button",{className:"btn btn-outline-success",onClick:$,children:[e.jsx("i",{className:"fa fa-print ml-2"}),"چاپ فرم"]})]}),e.jsx("div",{className:"card mb-4 border-info bg-light",children:e.jsx("div",{className:"card-body",children:e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"mb-2",children:e.jsxs("strong",{children:["استاد محترم (سرکارخانم/جناب آقای) ",r?.fullName||r?.username]})}),e.jsx("p",{className:"mb-2",children:"با سلام و احترام"}),e.jsxs("p",{className:"mb-2",children:["پیرو مصوبه ستاد امتحانات استان، مسئولیت طراحی سؤالات دروس مندرج در جدول ذیل به جنابعالی محول شده است. مقتضی است به‌منظور فراهم‌سازی بستر بررسی، پشتیبانی و انجام اقدامات تکمیلی، نسبت به طراحی و بارگذاری سؤالات مطابق ضوابط ابلاغی، حداکثر تا ۷۲ ساعت پیش از زمان برگزاری آزمون، در سامانه VC به نشانی ",e.jsx("a",{href:"http://vc.farspnu.ac.ir",target:"_blank",rel:"noopener noreferrer",children:"vc.farspnu.ac.ir"})," اقدام فرمایید."]}),e.jsx("p",{className:"mb-2",children:"همچنین در تنظیم ویژگی‌های آزمون، رعایت موارد زیر ضروری است:"}),e.jsxs("ul",{className:"mb-2",children:[e.jsx("li",{children:"عنوان آزمون به‌صورت کامل درج شود (برای نمونه: «آزمون پایان‌ترم درس زبان تخصصی مدیریت»)."}),e.jsx("li",{children:"تاریخ و زمان شروع آزمون مطابق با زمان‌بندی اعلام‌شده تنظیم و زمان تأخیر مجاز ورود به آزمون حداقل ۵ دقیقه تعیین شود."}),e.jsx("li",{children:"در بخش توضیحات آزمون تصریح شود که امکان بازگشت به سؤالات قبلی و اصلاح پاسخ‌ها وجود ندارد."}),e.jsx("li",{children:"گزینه‌های «نمایش نمره»، «نمایش هر سؤال در یک صفحه»، «تصادفی سازی سوالات» و «تصادفی‌سازی ترتیب گزینه‌ها» فعال و گزینه «امکان بازگشت و ویرایش پاسخ پس از ثبت» غیرفعال باشد."}),e.jsx("li",{children:"مدت پاسخ‌گویی هر سؤال متناسب با سطح دشواری و نوع آن تعیین و برای هر سؤال حداقل یک دقیقه در نظر گرفته شود."}),e.jsx("li",{children:"در طراحی سؤالات، منبع درسی، مفاد پیوست (حذفیات) و نوع آزمون به‌دقت لحاظ شود."}),e.jsx("li",{children:"سؤالات با توزیع منطقی و متوازن از کلیه مباحث منبع درسی تدوین شود."}),e.jsx("li",{children:"حتی‌الامکان، چینش سؤالات و گزینه‌ها به‌صورت تصادفی تنظیم شود."}),e.jsx("li",{children:"در مواردی که پاسخ هر سؤال مستقل از سایر سؤالات است، امکان بازگشت به سؤالات قبلی غیرفعال شود (به‌منظور کاهش احتمال تقلب و اشتراک‌گذاری سؤالات)."}),e.jsx("li",{children:"در آزمون‌های تستی، حداقل ۳۰ سؤال و در آزمون‌های تشریحی، حداقل ۱۰ سؤال طراحی شود؛ به‌نحوی‌که به‌ترتیب ۲۴ سؤال تستی و ۴ سؤال تشریحی به‌صورت تصادفی برای هر دانشجو نمایش داده شود. (افزایش تعداد سؤالات در بانک، به ارتقای امنیت و سلامت آزمون کمک می‌کند.)"})]}),e.jsx("p",{className:"mb-0",children:"شایان ذکر است هدف از تقسیم‌بندی و توزیع طراحی سؤالات میان اساتید، کاهش بار کاری و ایجاد وحدت رویه در شیوه‌های ارزیابی در سطح استان است. پیشاپیش از همکاری و دقت‌ نظر جنابعالی قدردانی می‌شود."})]})})}),y?e.jsxs("div",{className:"text-center py-5",children:[e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"در حال بارگذاری..."})}),e.jsx("p",{className:"mt-2 text-muted",children:"در حال دریافت اطلاعات..."})]}):e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-bordered table-hover table-striped",children:[e.jsx("thead",{className:"table-light",children:e.jsxs("tr",{children:[e.jsx("th",{children:"نام طراح سوال"}),e.jsxs("th",{style:{cursor:"pointer"},onClick:()=>h("lesson"),children:["نام درس ",x("lesson")]}),e.jsx("th",{children:"مرکز و واحد درس"}),e.jsx("th",{children:"شماره درس و گروه"}),e.jsx("th",{children:"نوع امتحان"}),e.jsxs("th",{style:{cursor:"pointer"},onClick:()=>h("sourceNo"),children:["شماره منبع ",x("sourceNo")]}),e.jsx("th",{children:"شرح پیوست"}),e.jsxs("th",{style:{cursor:"pointer"},onClick:()=>h("examDate"),children:["تاریخ امتحان ",x("examDate")]}),e.jsx("th",{children:"ساعت شروع"}),e.jsx("th",{children:"روز هفته"}),e.jsx("th",{children:"نوع طراحی سوال"}),e.jsx("th",{children:"استاد درس"}),e.jsx("th",{children:"شماره همراه استاد"}),e.jsxs("th",{style:{cursor:"pointer"},onClick:()=>h("registered"),children:["تعداد ثبت نام ",x("registered")]})]})}),e.jsx("tbody",{children:p.length===0?e.jsx("tr",{children:e.jsxs("td",{colSpan:"14",className:"text-center text-muted py-4",children:[e.jsx("i",{className:"fa fa-info-circle ml-1"}),"هیچ درسی یافت نشد"]})}):p.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.questionDesigner||"—"}),e.jsx("td",{children:t.lesson||"—"}),e.jsx("td",{children:t.center||"—"}),e.jsx("td",{children:t.lessonNoGrp||"—"}),e.jsx("td",{children:t.examType||"—"}),e.jsx("td",{children:t.sourceNo||"—"}),e.jsx("td",{children:t.attachNo||"—"}),e.jsx("td",{children:t.examDate||"—"}),e.jsx("td",{children:t.start||"—"}),e.jsx("td",{children:t.dayOfWeek||"—"}),e.jsx("td",{children:t.questionType||"—"}),e.jsx("td",{children:t.teacher||"—"}),e.jsx("td",{children:t.mobile||"—"}),e.jsx("td",{children:t.registered})]},t.id))})]})})]})})}export{E as default};
