import React, { useState } from "react";
import api from "../../../utils/apiClient";
import { useCenters } from "../../../context/CenterContext";
import { useTerms } from "../../../context/TermContext";

export default function DailyTeachers() {
    const { centers, loading: centersLoading } = useCenters();
    const {
        allTerms,
        selectedTerm,
        setSelectedTerm,
        activeTerm,
        loading: termsLoading,
    } = useTerms();

    // پیش‌فرض مرکز شیراز؛ اگر کد دیگری برای شیراز داری، همین را جایگزین کن
    const [centerCode, setCenterCode] = useState("6293");
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [cooperationType, setCooperationType] = useState("عضو هیات علمی");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // متن توضیحی فقط پس از جستجو تغییر کند
    const [searchInfo, setSearchInfo] = useState(null);

    const days = [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
    ];

    async function handleSearch() {
        if (!selectedTerm || !centerCode || !dayOfWeek) {
            setError("لطفاً ترم، مرکز و روز هفته را انتخاب کنید");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await api.get(
                `/api/reports/TeachersByCenterDay/${selectedTerm}/${centerCode}/${dayOfWeek}/${cooperationType}`
            );
            setResults(Array.isArray(data) ? data : []);

            // ذخیره شرایط جستجو برای متن توضیحی
            const centerTitle =
                centers.find((c) => String(c.centerCode) === String(centerCode))?.title ||
                "";
            setSearchInfo({
                cooperationType,
                centerTitle,
                dayOfWeek,
            });
        } catch (err) {
            console.error(err);
            setError("در دریافت نتایج مشکلی رخ داد");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4" dir="rtl">
            <h5 className="mb-3">جستجوی اساتید بر اساس ترم، مرکز و روز هفته</h5>

            <div className="row mb-3">
                {/* انتخاب ترم */}
                <div className="col-md-3">
                    <label className="form-label">ترم</label>
                    <select
                        className="form-select"
                        value={selectedTerm || ""}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        disabled={termsLoading}
                    >
                        <option value="">انتخاب کنید...</option>
                        {allTerms.map((t) => (
                            <option key={t.term} value={t.term}>
                                {t.term} {t.active ? "(ترم جاری)" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                {/* انتخاب مرکز */}
                <div className="col-md-3">
                    <label className="form-label">مرکز</label>
                    <select
                        className="form-select"
                        value={centerCode}
                        onChange={(e) => setCenterCode(e.target.value)}
                        disabled={centersLoading}
                    >
                        <option value="">انتخاب کنید...</option>
                        {centers.map((c) => (
                            <option key={c.centerCode} value={c.centerCode}>
                                {c.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* انتخاب روز هفته */}
                <div className="col-md-3">
                    <label className="form-label">روز هفته</label>
                    <select
                        className="form-select"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                    >
                        <option value="">انتخاب کنید...</option>
                        {days.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                {/* نوع همکاری */}
                <div className="col-md-3">
                    <label className="form-label">نوع همکاری</label>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="faculty"
                            name="cooperationType"
                            value="عضو هیات علمی"
                            checked={cooperationType === "عضو هیات علمی"}
                            onChange={(e) => setCooperationType(e.target.value)}
                        />
                        <label className="form-check-label ms-2" htmlFor="faculty">
                            عضو هیات علمی
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="guest"
                            name="cooperationType"
                            value="مدرس مدعو"
                            checked={cooperationType === "مدرس مدعو"}
                            onChange={(e) => setCooperationType(e.target.value)}
                        />
                        <label className="form-check-label ms-2" htmlFor="guest">
                            مدرس مدعو
                        </label>
                    </div>
                </div>
            </div>

            {/* دکمه جستجو */}
            <div className="mb-3">
                <button className="btn btn-primary" onClick={handleSearch}>
                    جستجو
                </button>
            </div>

            {/* نمایش وضعیت */}
            {loading && <p>در حال بارگذاری...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* متن توضیحی و جدول نتایج فقط پس از جستجو */}
            {results.length > 0 && searchInfo && (
                <>
                    <h5 className="mb-3">
                        لیست حضور اساتید  {searchInfo.cooperationType} {" "}
                        {searchInfo.centerTitle} در روز {searchInfo.dayOfWeek}
                    </h5>

                    <table className="table table-striped table-bordered mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>کد استاد</th>
                                <th>نام</th>
                                <th>نام خانوادگی</th>
                                <th>موبایل</th>
                                <th>A</th>
                                <th>B</th>
                                <th>C</th>
                                <th>D</th>
                                <th>E</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr key={r.code || `${r.fname}-${r.mobile}`}>
                                    <td>{r.code}</td>
                                    <td>{r.fname}</td>
                                    <td>{r.lname}</td>
                                    <td>{r.mobile}</td>
                                    <td>{r.a}</td>
                                    <td>{r.b}</td>
                                    <td>{r.c}</td>
                                    <td>{r.d}</td>
                                    <td>{r.e}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
