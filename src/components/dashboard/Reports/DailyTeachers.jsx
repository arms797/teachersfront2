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

    const [centerCode, setCenterCode] = useState("6293");
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [cooperationType, setCooperationType] = useState("عضو هیات علمی");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInfo, setSearchInfo] = useState(null);

    // صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 30; // تعداد رکورد در هر صفحه

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
            setCurrentPage(1); // بعد از هر جستجو برگرد به صفحه اول

            const centerTitle =
                centers.find((c) => String(c.centerCode) === String(centerCode))?.title || "";
            setSearchInfo({ cooperationType, centerTitle, dayOfWeek });
        } catch (err) {
            console.error(err);
            setError("در دریافت نتایج مشکلی رخ داد");
        } finally {
            setLoading(false);
        }
    }

    // محاسبه رکوردهای صفحه جاری
    const totalPages = Math.ceil(results.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentResults = results.slice(startIndex, startIndex + pageSize);

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
                    <label className="form-label d-block mb-2">نوع همکاری</label>
                    <div className="d-flex">
                        <div className="form-check me-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="faculty"
                                name="cooperationType"
                                value="عضو هیات علمی"
                                checked={cooperationType === "عضو هیات علمی"}
                                onChange={(e) => setCooperationType(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="faculty">
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
                            <label className="form-check-label" htmlFor="guest">
                                مدرس مدعو
                            </label>
                        </div>
                    </div>
                </div>

            </div>

            {/* دکمه جستجو */}
            <div className="mb-3">
                <button className="btn btn-primary" onClick={handleSearch}>
                    جستجو
                </button>
            </div>

            {loading && <p>در حال بارگذاری...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {currentResults.length > 0 && searchInfo && (
                <>
                    <h5 className="mb-3">
                        لیست حضور اساتید {searchInfo.cooperationType} {searchInfo.centerTitle} در روز{" "}
                        {searchInfo.dayOfWeek}
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
                            {currentResults.map((r) => (
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

                    {/* صفحه‌بندی بهینه */}
                    <nav>
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    قبلی
                                </button>
                            </li>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 2 && page <= currentPage + 2)
                                )
                                .map((page, idx, arr) => {
                                    const prevPage = arr[idx - 1];
                                    const showDots = prevPage && page - prevPage > 1;
                                    return (
                                        <React.Fragment key={page}>
                                            {showDots && (
                                                <li className="page-item disabled">
                                                    <span className="page-link">…</span>
                                                </li>
                                            )}
                                            <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(page)}>
                                                    {page}
                                                </button>
                                            </li>
                                        </React.Fragment>
                                    );
                                })}

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    بعدی
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
}
``