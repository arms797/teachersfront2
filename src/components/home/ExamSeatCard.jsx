import React, { useState } from 'react'
import api from '../../utils/apiClient'

export default function ExamSeatCard() {
    const [studentId, setStudentId] = useState('')
    const [examSeat, setExamSeat] = useState(null)
    const [error, setError] = useState(null)

    const handleSearch = async () => {
        setError(null)
        setExamSeat(null)
        if (!studentId.match(/^\d+$/)) {
            setError('شماره دانشجویی باید فقط عدد باشد.')
            return
        }
        try {
            const res = await api.get(`/api/examSeat/${studentId}`)
            if (res && res.seatNumber) {
                setExamSeat(`شماره صندلی شما: ${res.seatNumber} - حوزه: ${res.examCenter}`)
            } else {
                setError('اطلاعاتی برای این شماره دانشجویی یافت نشد.')
            }
        } catch (err) {
            setError('خطا در جستجو. لطفاً دوباره تلاش کنید.')
        }
    }

    return (
        <div className="card mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card-body">
                <h5 className="card-title mb-3">مشاهده شماره صندلی آزمون پایان ترم</h5>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: '200px' }}
                        placeholder="شماره دانشجویی"
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>جستجو</button>
                </div>

                {error && <div className="alert alert-danger small mt-2">{error}</div>}
                {examSeat && (
                    <div className="alert alert-success small mt-2">
                        {examSeat}
                    </div>
                )}
            </div>
        </div>
    )
}
