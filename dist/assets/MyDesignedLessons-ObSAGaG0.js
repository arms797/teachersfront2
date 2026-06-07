import{b as k,c as D,r as a,j as t,a as z,f as C,l as T}from"./index-BBFfA_zy.js";function I(){const{hasRole:b,userInfo:i}=k(),{activeTerm:g}=D(),[p,u]=a.useState([]),[y,m]=a.useState(!1),[h,N]=a.useState(null),[c,j]=a.useState("asc");if(!b("teacher"))return t.jsx("div",{className:"card shadow-sm",children:t.jsx("div",{className:"card-body",children:t.jsxs("div",{className:"alert alert-danger text-center",children:[t.jsx("i",{className:"fa fa-ban ml-2"}),"شما مجاز به دسترسی به این بخش نیستید."]})})});const f=a.useCallback(async()=>{m(!0);try{const e=new URLSearchParams;i?.fullName?e.append("questionDesigner",i.fullName):i?.username&&e.append("questionDesigner",i.username);let r=(await z.get(`/api/exams/paged?${e.toString()}`)).items||[];h&&(r=w(r,h,c)),u(r)}catch(e){console.error("خطا در دریافت دروس:",e),alert("❌ خطا در دریافت لیست دروس")}finally{m(!1)}},[i?.fullName,i?.username,h,c]),w=(e,d,r)=>[...e].sort((s,S)=>{let n=s[d]||"",l=S[d]||"";return d==="registered"&&(n=parseInt(n)||0,l=parseInt(l)||0),r==="asc"?n>l?1:n<l?-1:0:n<l?1:n>l?-1:0}),o=e=>{h===e?j(c==="asc"?"desc":"asc"):(N(e),j("asc"))},x=e=>h!==e?t.jsx("i",{className:"fa fa-sort text-muted ms-1",style:{fontSize:"12px"}}):c==="asc"?t.jsx("i",{className:"fa fa-sort-asc text-primary ms-1",style:{fontSize:"12px"}}):t.jsx("i",{className:"fa fa-sort-desc text-primary ms-1",style:{fontSize:"12px"}});function v(e){if(e==null)return"";const d=e.toString(),r=["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];return d.replace(/\d/g,s=>r[parseInt(s)])}const $=()=>{const e=window.open("","_blank"),d=p.map(s=>`
            <tr>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.questionDesigner||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.lesson||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.center||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.lessonNoGrp||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.examType||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.sourceNo||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.attachNo||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.examDate||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.start||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.dayOfWeek||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.questionType||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.teacher||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: right;">${s.mobile||"—"}</td>
                <td style="border: 1px solid #999; padding: 6px; text-align: center;">${s.registered}</td>
            </tr>
        `).join(""),r=`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>لیست دروس جهت طراحی سوال - نیمسال ${g}</title>
            <style>
                @page {
                    size: landscape;  /* ✅ تنظیم حالت Landscape برای چاپ */
                    margin: 10mm;
                }
                @font-face {
                    font-family: 'Vazirmatn';
                    src: url(${C}) format('woff2');
                }
                body {
                    font-family: 'Vazirmatn', sans-serif;
                    direction: rtl;
                    text-align: right;
                    padding: 20px;
                    background-color: #fff;
                }
                .header {
                    text-align: center;
                    margin-bottom: 25px;
                }
                .header img {
                    width: 70px;
                    height: auto;
                    margin-bottom: 8px;
                }
                .header h2 {
                    font-size: 16px;
                    margin: 5px 0;
                    color: #002864;
                }
                .header h3 {
                    font-size: 14px;
                    margin: 5px 0;
                    color: #555;
                }
                .info-text {
                    margin: 15px 0;
                    line-height: 1.6;
                    font-size: 12px;
                }
                .info-text p {
                    margin: 6px 0;
                }
                .info-text ul {
                    margin: 8px 0;
                    padding-right: 20px;
                }
                .info-text li {
                    margin: 4px 0;
                }
                .info-text span {
                    display: block;
                    margin-right: 20px;
                    margin-bottom: 5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                    font-size: 11px;
                    table-layout: fixed;
                }
                th, td {
                    border: 1px solid #999;
                    padding: 5px;
                    text-align: center;
                    vertical-align: middle;
                    word-wrap: break-word;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                /* عرض ثابت برای ستون‌ها */
                th:nth-child(1), td:nth-child(1) { width: 7%; }
                th:nth-child(2), td:nth-child(2) { width: 10%; }
                th:nth-child(3), td:nth-child(3) { width: 8%; }
                th:nth-child(4), td:nth-child(4) { width: 8%; }
                th:nth-child(5), td:nth-child(5) { width: 7%; }
                th:nth-child(6), td:nth-child(6) { width: 6%; }
                th:nth-child(7), td:nth-child(7) { width: 6%; }
                th:nth-child(8), td:nth-child(8) { width: 8%; }
                th:nth-child(9), td:nth-child(9) { width: 6%; }
                th:nth-child(10), td:nth-child(10) { width: 6%; }
                th:nth-child(11), td:nth-child(11) { width: 7%; }
                th:nth-child(12), td:nth-child(12) { width: 9%; }
                th:nth-child(13), td:nth-child(13) { width: 7%; }
                th:nth-child(14), td:nth-child(14) { width: 5%; }
                .signatures {
                    margin-top: 30px;
                    width: 100%;
                    border: none;
                }
                .signatures td {
                    border: none;
                    text-align: center;
                    font-weight: bold;
                    width: 33%;
                }
                @media print {
                    body {
                        padding: 10px;
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
                <h2>لیست دروس جهت طراحی سوال در نیمسال ${v(g)}</h2>
            </div>

            <div class="info-text">
                <p><strong>استاد محترم (سرکارخانم/جناب آقای) ${i?.fullName||i?.username}</strong></p>
                <p>با سلام و احترام</p>
                <p>پیرو مصوبه ستاد امتحانات استان، مسئولیت طراحی سؤالات دروس مندرج در جدول ذیل به جنابعالی محول شده است.
                مقتضی است به‌منظور فراهم‌سازی بستر بررسی، پشتیبانی و انجام اقدامات تکمیلی، نسبت به طراحی و بارگذاری سؤالات
                مطابق ضوابط ابلاغی، حداکثر تا ۷۲ ساعت پیش از زمان برگزاری آزمون، در سامانه VC به نشانی vc.farspnu.ac.ir اقدام فرمایید.</p>
                <p>همچنین در تنظیم ویژگی‌های آزمون، رعایت موارد زیر ضروری است:</p>
                <ul>
                    <li>عنوان آزمون به‌صورت کامل درج شود (برای نمونه: «آزمون پایان‌ترم درس زبان تخصصی مدیریت»).</li>
                    <li>تاریخ و زمان شروع آزمون مطابق با زمان‌بندی اعلام‌شده تنظیم و زمان تأخیر مجاز ورود به آزمون حداقل ۱۰ دقیقه تعیین شود.</li>
                    <li>در بخش توضیحات آزمون تصریح شود که امکان بازگشت به سؤالات قبلی و اصلاح پاسخ‌ها وجود ندارد.</li>
                    <li>گزینه‌های «نمایش نمره»، «نمایش هر سؤال در یک صفحه»، «تصادفی سازی سوالات» و «تصادفی‌سازی ترتیب گزینه‌ها» فعال و گزینه «امکان بازگشت و ویرایش پاسخ پس از ثبت» غیرفعال باشد.</li>
                    <li>مدت پاسخ‌گویی هر سؤال متناسب با سطح دشواری و نوع آن تعیین و برای هر سؤال حداقل یک دقیقه در نظر گرفته شود.</li>
                    <li>در طراحی سؤالات، منبع درسی، مفاد پیوست (حذفیات) و نوع آزمون به‌دقت لحاظ شود.</li>
                    <li>سؤالات با توزیع منطقی و متوازن از کلیه مباحث منبع درسی تدوین شود.</li>
                    <li>حتی‌الامکان، چینش سؤالات و گزینه‌ها به‌صورت تصادفی تنظیم شود.</li>
                    <li>در مواردی که پاسخ هر سؤال مستقل از سایر سؤالات است، امکان بازگشت به سؤالات قبلی غیرفعال شود (به‌منظور کاهش احتمال تقلب و اشتراک‌گذاری سؤالات).</li>
                    <li>در آزمون‌های تستی، حداقل ۳۰ سؤال و در آزمون‌های تشریحی، حداقل ۱۰ سؤال طراحی شود؛ به‌نحوی‌که به‌ترتیب ۲۴ سؤال تستی و ۴ سؤال تشریحی به‌صورت تصادفی برای هر دانشجو نمایش داده شود. (افزایش تعداد سؤالات در بانک، به ارتقای امنیت و سلامت آزمون کمک می‌کند.)</li>
                    <li><strong>تذکر مهم:</strong> در ستون «نوع طراحی سؤال»، سه عنوان به شرح ذیل درج گردیده است:</li>
                </ul>
                <span><strong>استانی:</strong> دروسی که تعداد دانشجویان آن‌ها در مقطع کارشناسی بیش از ۷۰ نفر و در مقطع کارشناسی ارشد بیش از ۳۰ نفر در سطح استان می‌باشد. طراحی سؤالات این دروس توسط ستاد امتحانات استان تعیین و ابلاغ شده و پیگیری امور مربوطه از طریق تیم پشتیبانی استان (جناب آقای یزدانی) انجام می‌پذیرد. </span>
                <span><strong>مرکز/واحد:</strong> دروسی که تعداد دانشجویان آن‌ها کمتر از حد نصاب بند فوق است. طراحی سؤالات این دروس توسط استاد مربوطه انجام شده و برگزاری آزمون الزامی می‌باشد. مسئولیت پیگیری این بخش بر عهده مرکز/واحد ارائه‌دهنده درس است. </span>
                <span><strong>استادمحور:</strong> دروسی که تعداد دانشجویان آن‌ها در مقطع کارشناسی کمتر از ۱۰ نفر و در مقطع کارشناسی ارشد کمتر از ۶ نفر می‌باشد. در این موارد، شیوه ارزشیابی به استاد درس واگذار شده و پیگیری آن بر عهده مرکز/واحد ارائه‌دهنده درس است.</span>
                <p className="mb-0 mt-2">
                    شایان ذکر است هدف از تقسیم‌بندی و توزیع طراحی سؤالات میان اساتید، کاهش بار کاری و ایجاد وحدت رویه در شیوه‌های ارزیابی در سطح استان است.
                    پیشاپیش از همکاری و دقت‌ نظر جنابعالی قدردانی می‌شود.
                </p>
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

            <table class="signatures">
                <tr>          
                    <td></td> 
                    <td></td>          
                    <td style="border: none; text-align: center; font-weight: bold;"> معاونت آموزش و تحصیلات تکمیلی </td}
                </tr>
                <tr>          
                    <td></td> 
                    <td></td>          
                    <td style="border: none; text-align: center; font-weight: bold;">دکتر خلیلی صفری</td}
                </tr>
                
            </table>

            <script>
                window.onload = function() {
                    window.print();
                }
            <\/script>
        </body>
        </html>
        `;e.document.write(r),e.document.close()};return a.useEffect(()=>{f()},[f]),t.jsx("div",{className:"card shadow-sm",children:t.jsxs("div",{className:"card-body",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[t.jsxs("div",{className:"d-flex align-items-center",children:[t.jsx("i",{className:"fa fa-pen-ruler fa-2x text-primary ml-2"}),t.jsx("h4",{className:"card-title mb-0",children:"دروسی که طراح سوال هستم"})]}),t.jsxs("button",{className:"btn btn-outline-success",onClick:$,children:[t.jsx("i",{className:"fa fa-print ml-2"}),"چاپ فرم"]})]}),t.jsx("div",{className:"card mb-4 border-info bg-light",children:t.jsx("div",{className:"card-body",children:t.jsxs("div",{className:"text-right",children:[t.jsx("p",{className:"mb-2",children:t.jsxs("strong",{children:["استاد محترم (سرکارخانم/جناب آقای) ",i?.fullName||i?.username]})}),t.jsx("p",{className:"mb-2",children:"با سلام و احترام"}),t.jsxs("p",{className:"mb-2",children:["پیرو مصوبه ستاد امتحانات استان، مسئولیت طراحی سؤالات دروس مندرج در جدول ذیل به جنابعالی محول شده است. مقتضی است به‌منظور فراهم‌سازی بستر بررسی، پشتیبانی و انجام اقدامات تکمیلی، نسبت به طراحی و بارگذاری سؤالات مطابق ضوابط ابلاغی، حداکثر تا ۷۲ ساعت پیش از زمان برگزاری آزمون، در سامانه VC به نشانی ",t.jsx("a",{href:"http://vc.farspnu.ac.ir",target:"_blank",rel:"noopener noreferrer",children:"vc.farspnu.ac.ir"})," اقدام فرمایید."]}),t.jsx("p",{className:"mb-2",children:"همچنین در تنظیم ویژگی‌های آزمون، رعایت موارد زیر ضروری است:"}),t.jsxs("ul",{className:"mb-2",children:[t.jsx("li",{children:"عنوان آزمون به‌صورت کامل درج شود (برای نمونه: «آزمون پایان‌ترم درس زبان تخصصی مدیریت»)."}),t.jsx("li",{children:"تاریخ و زمان شروع آزمون مطابق با زمان‌بندی اعلام‌شده تنظیم و زمان تأخیر مجاز ورود به آزمون حداقل ۱۰ دقیقه تعیین شود."}),t.jsx("li",{children:"در بخش توضیحات آزمون تصریح شود که امکان بازگشت به سؤالات قبلی و اصلاح پاسخ‌ها وجود ندارد."}),t.jsx("li",{children:"گزینه‌های «نمایش نمره»، «نمایش هر سؤال در یک صفحه»، «تصادفی سازی سوالات» و «تصادفی‌سازی ترتیب گزینه‌ها» فعال و گزینه «امکان بازگشت و ویرایش پاسخ پس از ثبت» غیرفعال باشد."}),t.jsx("li",{children:"مدت پاسخ‌گویی هر سؤال متناسب با سطح دشواری و نوع آن تعیین و برای هر سؤال حداقل یک دقیقه در نظر گرفته شود."}),t.jsx("li",{children:"در طراحی سؤالات، منبع درسی، مفاد پیوست (حذفیات) و نوع آزمون به‌دقت لحاظ شود."}),t.jsx("li",{children:"سؤالات با توزیع منطقی و متوازن از کلیه مباحث منبع درسی تدوین شود."}),t.jsx("li",{children:"حتی‌الامکان، چینش سؤالات و گزینه‌ها به‌صورت تصادفی تنظیم شود."}),t.jsx("li",{children:"در مواردی که پاسخ هر سؤال مستقل از سایر سؤالات است، امکان بازگشت به سؤالات قبلی غیرفعال شود (به‌منظور کاهش احتمال تقلب و اشتراک‌گذاری سؤالات)."}),t.jsx("li",{children:"در آزمون‌های تستی، حداقل ۳۰ سؤال و در آزمون‌های تشریحی، حداقل ۱۰ سؤال طراحی شود؛ به‌نحوی‌که به‌ترتیب ۲۴ سؤال تستی و ۴ سؤال تشریحی به‌صورت تصادفی برای هر دانشجو نمایش داده شود. (افزایش تعداد سؤالات در بانک، به ارتقای امنیت و سلامت آزمون کمک می‌کند.)"}),t.jsxs("li",{children:[t.jsx("strong",{children:"تذکر مهم:"})," در ستون «نوع طراحی سؤال»، سه عنوان به شرح ذیل درج گردیده است:"]})]}),t.jsxs("span",{children:[t.jsx("strong",{children:"استانی:"})," دروسی که تعداد دانشجویان آن‌ها در مقطع کارشناسی بیش از ۷۰ نفر و در مقطع کارشناسی ارشد بیش از ۳۰ نفر در سطح استان می‌باشد. طراحی سؤالات این دروس توسط ستاد امتحانات استان تعیین و ابلاغ شده و پیگیری امور مربوطه از طریق تیم پشتیبانی استان (جناب آقای یزدانی) انجام می‌پذیرد. "]}),t.jsx("br",{}),t.jsxs("span",{children:[t.jsx("strong",{children:"مرکز/واحد:"})," دروسی که تعداد دانشجویان آن‌ها کمتر از حد نصاب بند فوق است. طراحی سؤالات این دروس توسط استاد مربوطه انجام شده و برگزاری آزمون الزامی می‌باشد. مسئولیت پیگیری این بخش بر عهده مرکز/واحد ارائه‌دهنده درس است. "]}),t.jsx("br",{}),t.jsxs("span",{children:[t.jsx("strong",{children:"استادمحور:"})," دروسی که تعداد دانشجویان آن‌ها در مقطع کارشناسی کمتر از ۱۰ نفر و در مقطع کارشناسی ارشد کمتر از ۶ نفر می‌باشد. در این موارد، شیوه ارزشیابی به استاد درس واگذار شده و پیگیری آن بر عهده مرکز/واحد ارائه‌دهنده درس است."]}),t.jsx("p",{className:"mb-0 mt-2",children:"شایان ذکر است هدف از تقسیم‌بندی و توزیع طراحی سؤالات میان اساتید، کاهش بار کاری و ایجاد وحدت رویه در شیوه‌های ارزیابی در سطح استان است. پیشاپیش از همکاری و دقت‌ نظر جنابعالی قدردانی می‌شود."})]})})}),y?t.jsxs("div",{className:"text-center py-5",children:[t.jsx("div",{className:"spinner-border text-primary",role:"status",children:t.jsx("span",{className:"visually-hidden",children:"در حال بارگذاری..."})}),t.jsx("p",{className:"mt-2 text-muted",children:"در حال دریافت اطلاعات..."})]}):t.jsx("div",{className:"table-responsive",children:t.jsxs("table",{className:"table table-bordered table-hover table-striped",children:[t.jsx("thead",{className:"table-light",children:t.jsxs("tr",{children:[t.jsx("th",{children:"نام طراح سوال"}),t.jsxs("th",{style:{cursor:"pointer"},onClick:()=>o("lesson"),children:["نام درس ",x("lesson")]}),t.jsx("th",{children:"مرکز و واحد درس"}),t.jsx("th",{children:"شماره درس و گروه"}),t.jsx("th",{children:"نوع امتحان"}),t.jsxs("th",{style:{cursor:"pointer"},onClick:()=>o("sourceNo"),children:["شماره منبع ",x("sourceNo")]}),t.jsx("th",{children:"شرح پیوست"}),t.jsxs("th",{style:{cursor:"pointer"},onClick:()=>o("examDate"),children:["تاریخ امتحان ",x("examDate")]}),t.jsx("th",{children:"ساعت شروع"}),t.jsx("th",{children:"روز هفته"}),t.jsx("th",{children:"نوع طراحی سوال"}),t.jsx("th",{children:"استاد درس"}),t.jsx("th",{children:"شماره همراه استاد"}),t.jsxs("th",{style:{cursor:"pointer"},onClick:()=>o("registered"),children:["تعداد ثبت نام ",x("registered")]})]})}),t.jsx("tbody",{children:p.length===0?t.jsx("tr",{children:t.jsxs("td",{colSpan:"14",className:"text-center text-muted py-4",children:[t.jsx("i",{className:"fa fa-info-circle ml-1"}),"هیچ درسی یافت نشد"]})}):p.map(e=>t.jsxs("tr",{children:[t.jsx("td",{children:e.questionDesigner||"—"}),t.jsx("td",{children:e.lesson||"—"}),t.jsx("td",{children:e.center||"—"}),t.jsx("td",{children:e.lessonNoGrp||"—"}),t.jsx("td",{children:e.examType||"—"}),t.jsx("td",{children:e.sourceNo||"—"}),t.jsx("td",{children:e.attachNo||"—"}),t.jsx("td",{children:e.examDate||"—"}),t.jsx("td",{children:e.start||"—"}),t.jsx("td",{children:e.dayOfWeek||"—"}),t.jsx("td",{children:e.questionType||"—"}),t.jsx("td",{children:e.teacher||"—"}),t.jsx("td",{children:e.mobile||"—"}),t.jsx("td",{children:e.registered})]},e.id))})]})})]})})}export{I as default};
