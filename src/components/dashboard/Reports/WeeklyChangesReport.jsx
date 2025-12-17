import React, { useState } from "react";
import { useTerms } from "../../../context/TermContext";
import api from "../../../utils/apiClient";
import RptTeachersList from "./RptTeachersList"; // ایمپورت کامپوننت لیست اساتید

const WeeklyChangesReport = () => {
    const { selectedTerm, setSelectedTerm, allTerms, loading } = useTerms();
    const [reportData, setReportData] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);

    // state برای نگه داشتن انتخاب کاربر
    const [selectedCooperation, setSelectedCooperation] = useState(null);
    const [showCompleted, setShowCompleted] = useState(null);

    const handleSearch = async () => {
        setFetching(true);
        setError(null);

        try {
            const data = await api.get(`/api/reports/WeeklyChangesByTerm/${selectedTerm}`);
            setReportData(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    if (loading) {
        return <p>در حال بارگذاری لیست ترم‌ها...</p>;
    }

    return (
        <div className="container my-4">
            <h3 className="mb-3">گزارش تغییرات برنامه هفتگی اساتید</h3>

            {/* انتخاب ترم و دکمه جستجو */}
            <div className="d-flex align-items-center mb-3 gap-2">
                <label>نیمسال مورد نظر را انتخاب کنید</label>
                <select
                    className="form-select form-select-md"
                    style={{ width: "150px" }}
                    value={selectedTerm || ""}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                >
                    {allTerms.map((t) => (
                        <option key={t.term} value={t.term}>
                            {t.term}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn-md btn-primary"
                    onClick={handleSearch}
                    disabled={fetching || !selectedTerm}
                >
                    {fetching ? "در حال جستجو..." : "جستجو"}
                </button>
            </div>

            {/* نمایش خطا */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* جدول اصلی */}
            <div>
                {reportData.length > 0 ? (
                    <table className="table table-bordered">
                        <thead className="table-secondary">
                            <tr>
                                <th>نوع همکاری</th>
                                <th>تعداد تغییر داده</th>
                                <th>تعداد کل اساتید</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.cooperationType}</td>
                                    <td>{row.changedCount}</td>
                                    <td>{row.totalCount}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-info"
                                                onClick={() => {
                                                    setSelectedCooperation(row.cooperationType);
                                                    setShowCompleted(true);
                                                }}
                                            >
                                                مشاهده تکمیل کرده‌اند
                                            </button>
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => {
                                                    setSelectedCooperation(row.cooperationType);
                                                    setShowCompleted(false);
                                                }}
                                            >
                                                مشاهده تکمیل نکرده‌اند
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !fetching && <p>هنوز گزارشی برای نمایش وجود ندارد.</p>
                )}
            </div>

            {/* نمایش لیست اساتید در پایین صفحه */}
            {selectedCooperation && (
                <RptTeachersList
                    term={selectedTerm}
                    cooperationType={selectedCooperation}
                    completed={showCompleted}
                />
            )}
        </div>
    );
};

export default WeeklyChangesReport;
