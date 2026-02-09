import React, { useState, useEffect } from "react";
import api from "../../../utils/apiClient";
import { useUser } from "../../../context/UserContext";
import { useTerms } from "../../../context/TermContext";

const CooperationLockManager = () => {
    const { userInfo, loading: userLoading } = useUser();
    const { activeTerm, selectedTerm, setSelectedTerm, allTerms, loading: termLoading } = useTerms();

    const [cooperationType, setCooperationType] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // وقتی کانتکست ترم لود شد، ترم پیش‌فرض را ست کن
    useEffect(() => {
        if (activeTerm && !selectedTerm) {
            setSelectedTerm(activeTerm);
        }
    }, [activeTerm, selectedTerm, setSelectedTerm]);

    const handleLock = async () => {
        if (!userInfo || !selectedTerm) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const payload = {
                cooperationType,
                term: selectedTerm,
                description,
                username: userInfo.username,
                fullName: userInfo.fullName,
                centerCode: userInfo.centerCode
            };

            const res = await api.post("/api/ScheduleLock/lock-by-cooperation", payload);
            //setMessage(`استاد تعداد ${res.count} قفل‌گذاری انجام شد برای تعداد ${res.teachersCount}`);
            setMessage(`برای تعداد ${res.teachersCount} استاد ، قفل گذاری صورت گرفت`)
        } catch (err) {
            setError(err.response?.data?.message || "خطا در قفل‌گذاری");
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async () => {
        if (!userInfo || !selectedTerm) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const payload = {
                cooperationType,
                term: selectedTerm
            };

            const res = await api.post("/api/ScheduleLock/unlock-by-cooperation", payload);
            //setMessage(`استاد حذف قفل‌ انجام شد. برای تعداد: ${res.count / 7}`);
            setMessage(`برای تعداد ${res.count / 7} استاد ، قفل باز شد`)
        } catch (err) {
            setError(err.response?.data?.message || "خطا در حذف قفل‌ها");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-3 shadow-sm">
            <h5 className="mb-3">مدیریت قفل گروهی اساتید</h5>

            {/* انتخاب نوع همکاری و ترم */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <label>نوع همکاری</label>
                    <select
                        className="form-select"
                        value={cooperationType}
                        onChange={(e) => setCooperationType(e.target.value)}
                    >
                        
                        <option value="همه اساتید">همه اساتید</option>
                        <option value="عضو هیات علمی">عضو هیات علمی</option>
                        <option value="مدرس مدعو">مدرس مدعو</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label>ترم</label>
                    <select
                        className="form-select"
                        value={selectedTerm || ""}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        disabled={termLoading}
                    >
                        <option value="">انتخاب کنید...</option>
                        {allTerms.map((t) => (
                            <option key={t.term} value={t.term}>
                                {t.term} {t.active ? "(فعال)" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label>توضیحات (اختیاری)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            {/* دکمه‌ها */}
            <div className="d-flex gap-2">
                <button
                    className="btn btn-danger"
                    disabled={loading || userLoading || termLoading}
                    onClick={handleLock}
                >
                    قفل کردن گروهی برنامه هفتگی اساتید
                </button>

                <button
                    className="btn btn-success"
                    disabled={loading || userLoading || termLoading}
                    onClick={handleUnlock}
                >
                    باز کردن گروهی قفل برنامه هفتگی اساتید
                </button>
            </div>

            {/* پیام‌ها */}
            {loading && <p className="text-info mt-3">در حال انجام عملیات...</p>}
            {message && <p className="text-success mt-3">{message}</p>}
            {error && <p className="text-danger mt-3">{error}</p>}
        </div>
    );
};

export default CooperationLockManager;
