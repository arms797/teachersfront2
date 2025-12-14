import React, { useState } from 'react'
import api from '../../utils/apiClient'

export default function ExamSeatCard() {
    const [studentId, setStudentId] = useState('')
    const [examRecords, setExamRecords] = useState([])
    const [error, setError] = useState(null)

    const handleSearch = async () => {
        setError(null)
        setExamRecords([])
        if (!studentId.match(/^\d{9}$/)) {
            setError('شماره دانشجویی باید دقیقاً ۹ رقم عددی باشد.')
            return
        }
        try {
            console.log('test ok')
            const res = await api.get(`/api/examSeat/${studentId}`)
            if (res && Array.isArray(res) && res.length > 0) {
                setExamRecords(res)
            } else {
                setError('هیچ اطلاعاتی برای این شماره دانشجویی یافت نشد.')
            }
        } catch (err) {
            setError('خطا در جستجو. لطفاً دوباره تلاش کنید.')
        }
    }

    return (
        <div className="card mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-body">
                <h5 className="card-title mb-3">شماره دانشجویی</h5>
                <div className="d-flex justify-content-center mb-3" style={{ gap: '1rem' }}>
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: '200px' }}
                        placeholder="شماره دانشجویی"
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleSearch()
                            }
                        }}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>جستجو</button>
                </div>

                {error && <div className="alert alert-warning small mt-2">{error}</div>}

                {examRecords.map((rec, idx) => (
                    <div key={idx} className="card mb-2 shadow-sm">
                        <div className="card-body">
                            <h6 className="fw-bold text-primary mb-2">{rec.lessonTitle} ({rec.lessonCode})</h6>
                            <p className="mb-1"><strong>نام دانشجو:</strong> {rec.lName} {rec.fName}</p>
                            <p className="mb-1"><strong>تاریخ:</strong> {rec.examDate}</p>
                            <p className="mb-1"><strong>ساعت:</strong> {rec.examTime}</p>
                            <p className="mb-1"><strong>ساختمان:</strong> {rec.buildingNo}</p>
                            <p className="mb-1"><strong>کلاس:</strong> {rec.classroom}</p>
                            <p className="mb-1"><strong>شماره صندلی:</strong> {rec.seatNumber}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
