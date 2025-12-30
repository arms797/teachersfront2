import React, { useState, useEffect } from "react";
import api from "../../../utils/apiClient";
import TeacherChangesModal from "./TeacherChangesModal"; // ایمپورت مودال
import { useUser } from "../../../context/UserContext"; // ایمپورت کانتکست

const RptTeachersList = ({ term, cooperationType, completed }) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 30;

    // state مرتب‌سازی
    const [sortConfig, setSortConfig] = useState({ key: "lname", direction: "asc" });

    // state مودال
    const [showModal, setShowModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // state جستجو
    const [searchTerm, setSearchTerm] = useState("");

    // گرفتن نقش کاربر از کانتکست
    const { hasRole, loading: userLoading } = useUser();

    useEffect(() => {
        const fetchTeachers = async () => {
            if (!term || !cooperationType) return;
            setLoading(true);
            setError(null);
            try {
                const data = await api.get(
                    `/api/reports/TeachersByCooperation/${term}/${cooperationType}/${completed}`
                );
                setTeachers(data);
                setCurrentPage(1);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [term, cooperationType, completed]);

    // فیلتر بر اساس جستجو
    const filteredTeachers = React.useMemo(() => {
        return teachers.filter((t) => {
            const search = searchTerm.toLowerCase();
            return (
                t.code.toLowerCase().includes(search) ||
                t.fname.toLowerCase().includes(search) ||
                t.lname.toLowerCase().includes(search)
            );
        });
    }, [teachers, searchTerm]);

    // مرتب‌سازی داده‌ها بر اساس sortConfig
    const sortedTeachers = React.useMemo(() => {
        let sortable = [...filteredTeachers];
        if (sortConfig !== null) {
            sortable.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortable;
    }, [filteredTeachers, sortConfig]);

    // صفحه‌بندی
    const startIndex = (currentPage - 1) * pageSize;
    const currentTeachers = sortedTeachers.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(sortedTeachers.length / pageSize);

    // هندل کلیک روی هدر برای تغییر مرتب‌سازی
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // هندل کلیک روی دکمه مشاهده تغییرات
    const handleOpenModal = (teacher) => {
        setSelectedTeacher(teacher);
        setShowModal(true);
    };

    return (
        <div className="mt-4">
            <h5>
                لیست اساتید ({cooperationType}) -{" که فرم حضور هفتگی را  "}
                {completed ? "تکمیل کرده‌اند" : "تکمیل نکرده‌اند"}
            </h5>

            {/* فیلد جستجو */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="جستجو بر اساس کد، نام یا نام خانوادگی..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading && <p>در حال بارگذاری...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {teachers.length > 0 && (
                <>
                    <table className="table table-sm table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th onClick={() => requestSort("code")}>کد</th>
                                <th onClick={() => requestSort("fname")}>نام</th>
                                <th onClick={() => requestSort("lname")}>نام خانوادگی</th>
                                <th onClick={() => requestSort("mobile")}>موبایل</th>
                                <th onClick={() => requestSort("centerTitle")}>مرکز</th>
                                <th onClick={() => requestSort("cooperationType")}>نوع همکاری</th>
                                <th>مشاهده تغییرات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTeachers.map((t) => (
                                <tr key={t.code}>
                                    <td>{t.code}</td>
                                    <td>{t.fname}</td>
                                    <td>{t.lname}</td>
                                    <td>{t.mobile}</td>
                                    <td>{t.centerTitle}</td>
                                    <td>{t.cooperationType}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleOpenModal(t)}
                                            disabled={!(hasRole("admin") || hasRole("centerAdmin"))}
                                        >
                                            مشاهده تغییرات
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* صفحه‌بندی */}
                    <nav>
                        <ul className="pagination justify-content-center">
                            {/* دکمه قبلی */}
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    قبلی
                                </button>
                            </li>

                            {/* شماره صفحات با ... */}
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
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        </React.Fragment>
                                    );
                                })}

                            {/* دکمه بعدی */}
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

            {/* مودال تغییرات استاد */}
            {showModal && selectedTeacher && (
                <TeacherChangesModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    term={term}
                    teacherCode={selectedTeacher.code}
                    teacherName={`${selectedTeacher.fname} ${selectedTeacher.lname}`}
                />
            )}
        </div>
    );
};

export default RptTeachersList;
