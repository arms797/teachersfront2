import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'

export default function SartermCreator() {
    const [terms, setTerms] = useState([])
    const [term, setTerm] = useState('')
    const [reset, setReset] = useState(false)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTerms()
    }, [])

    async function fetchTerms() {
        try {
            const res = await api.get('/api/TermCalender')
            setTerms(res)
        } catch (err) {
            setMessage('خطا در دریافت لیست ترم‌ها')
        }
    }

    async function handleCreate() {
        if (!term) {
            setMessage('لطفاً یک ترم انتخاب کنید')
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const res = await api.post(`/api/teachers/sarterm/${term}/${reset}`)
            setMessage(res.message || 'سرترم ایجاد شد')
        } catch (err) {
            setMessage(err.message || 'خطا در ایجاد سرترم')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h6>ایجاد سرترم و برنامه هفتگی</h6>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="row g-2 align-items-center mb-3">
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={term}
                        onChange={e => setTerm(e.target.value)}
                    >
                        <option value="">انتخاب ترم</option>
                        {terms.map(t => (
                            <option key={t.term} value={t.term}>
                                {t.term} - {t.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-5 d-flex gap-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="resetOption"
                            id="preserve"
                            checked={!reset}
                            onChange={() => setReset(false)}
                        />
                        <label className="form-check-label" htmlFor="preserve">
                            ایجاد سرترم با حفظ سوابق
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="resetOption"
                            id="reset"
                            checked={reset}
                            onChange={() => setReset(true)}
                        />
                        <label className="form-check-label" htmlFor="reset">
                            ایجاد سرترم خام (حذف سوابق)
                        </label>
                    </div>
                </div>

                <div className="col-md-3">
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleCreate}
                        disabled={loading}
                    >
                        {loading ? 'در حال ایجاد...' : 'ایجاد سرترم'}
                    </button>
                </div>
            </div>
        </div>
    )
}
