import React, { useState, useEffect } from "react";
import api from "../../../utils/apiClient";

const TeacherChangesModal = ({ show, onClose, term, teacherCode, teacherName }) => {
    const [changes, setChanges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChanges = async () => {
            if (!show || !term || !teacherCode) return;
            setLoading(true);
            setError(null);
            try {
                const data = await api.get(`/api/reports/TeacherChanges/${term}/${teacherCode}`);
                setChanges(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChanges();
    }, [show, term, teacherCode]);

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    {/* هدر مودال */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            تغییرات استاد: {teacherName} <span className="text-muted">({teacherCode})</span>
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* بدنه مودال */}
                    <div className="modal-body">
                        {loading && <p>در حال بارگذاری...</p>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {changes.length > 0 ? (
                            <table className="table table-sm table-bordered table-striped">
                                <thead className="table-light">
                                    <tr>
                                        <th>ستون تغییر یافته</th>
                                        <th>مقدار قبلی</th>
                                        <th>مقدار جدید</th>
                                        <th>توسط</th>
                                        <th>زمان تغییر</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {changes.map((ch) => (
                                        <tr key={ch.id}>
                                            <td>{ch.columnName}</td>
                                            <td>{ch.oldValue}</td>
                                            <td>{ch.newValue}</td>
                                            <td>{ch.changedBy}</td>
                                            <td>{new Date(ch.changedAt).toLocaleString("fa-IR")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            !loading && <p>هیچ تغییری یافت نشد.</p>
                        )}
                    </div>

                    {/* فوتر مودال */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            بستن
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherChangesModal;
