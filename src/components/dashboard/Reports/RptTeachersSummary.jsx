import React, { useState, useMemo } from "react";
import api from "../../../utils/apiClient";
import { useTerms } from "../../../context/TermContext";
import { useCenters } from "../../../context/CenterContext"; // ایمپورت کانتکست مراکز

const TeachersSummary = () => {
  const { allTerms, selectedTerm, setSelectedTerm, loading: termLoading } = useTerms();
  const { centers } = useCenters(); // لیست مراکز [{centerCode:"C1", title:"مرکز تهران"}, ...]

  const [cooperationType, setCooperationType] = useState("عضو هیات علمی");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 جستجو
  const pageSize = 30;

  const handleSearch = async () => {
    if (!selectedTerm) return;
    setLoading(true);
    setError(null);
    try {
      let url = `/api/reports/TeachersSummary/${selectedTerm}`;
      if (cooperationType !== "all") {
        url += `/${cooperationType}`;
      }
      const data = await api.get(url);
      setTeachers(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // فیلتر بر اساس جستجو
  const filteredTeachers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return teachers.filter(
      (t) =>
        t.code.toLowerCase().includes(search) ||
        t.fname.toLowerCase().includes(search) ||
        t.lname.toLowerCase().includes(search)
    );
  }, [teachers, searchTerm]);

  // صفحه‌بندی
  const totalPages = Math.ceil(filteredTeachers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentTeachers = filteredTeachers.slice(startIndex, startIndex + pageSize);

  // پیدا کردن نام مرکز از کانتکست
  const getCenterTitle = (centerCode) => {
    const center = centers.find((c) => c.centerCode === centerCode);
    return center ? center.title : centerCode;
  };

  return (
    <div className="mt-4">
      <h4 className="mb-4 text-primary fw-bold">📊 گزارش خلاصه وضعیت اساتید</h4>

      {/* فیلترها در یک خط */}
      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-4">
          <label className="form-label">ترم:</label>
          <select
            className="form-select"
            value={selectedTerm || ""}
            onChange={(e) => setSelectedTerm(e.target.value)}
            disabled={termLoading}
          >
            {allTerms.map((t) => (
              <option key={t.term} value={t.term}>
                {t.term} {t.active ? "(فعال)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">نوع همکاری:</label>
          <select
            className="form-select"
            value={cooperationType}
            onChange={(e) => setCooperationType(e.target.value)}
          >
            <option value="all">همه اساتید</option>
            <option value="عضو هیات علمی">عضو هیات علمی</option>
            <option value="مدرس مدعو">مدرس مدعو</option>
          </select>
        </div>

        <div className="col-md-4 d-grid">
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "در حال جستجو..." : "🔍 جستجو"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* کادر جستجو بالای جدول */}
      {teachers.length > 0 && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="جستجو بر اساس کد، نام یا نام خانوادگی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* جدول نتایج */}
      {filteredTeachers.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>کد</th>
                  <th>نام خانوادگی و نام</th>
                  <th>مرکز</th>
                  <th>نوع همکاری</th>
                  <th>موبایل</th>
                  <th>ساعات تدریس</th>
                  <th>ساعات پژوهشی</th>
                  <th>پژوهشی در ساعات اداری</th>
                  <th>کل حضور</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map((t) => (
                  <tr key={t.code}>
                    <td>{t.code}</td>
                    <td>{t.lname} {t.fname}</td>
                    <td>{getCenterTitle(t.center)}</td> {/* نمایش معادل مرکز */}
                    <td>{t.cooperationType}</td>
                    <td>{t.mobile}</td>
                    <td className="text-center">{t.teachingSessions}</td>
                    <td className="text-center">{t.researchSessions}</td>
                    <td className="text-center">{t.researchOfficeSessions}</td>
                    <td className="text-center fw-bold">{t.totalPresence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* صفحه‌بندی */}
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
};

export default TeachersSummary;
