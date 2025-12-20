import React, { useState } from 'react'
import api from '../../../utils/apiClient' // همون کلاینتی که برای لاگین استفاده کردی

export default function NormalizeTeachersButton() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    async function handleNormalize() {
        setLoading(true)
        setMessage(null)
        try {
            await api.get('/api/teachers/normalize') // چون اکشنت [HttpGet("normalize")] هست
            setMessage('نرمال‌سازی با موفقیت انجام شد ✅')
        } catch (err) {
            console.error(err)
            setMessage('خطا در نرمال‌سازی ❌')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="text-center my-3">
            <button
                className="btn btn-warning"
                onClick={handleNormalize}
                disabled={loading}
            >
                {loading ? 'در حال نرمال‌سازی...' : 'نرمال‌سازی اطلاعات اساتید'}
            </button>
            {message && <div className="mt-2 alert alert-info">{message}</div>}
        </div>
    )
}
