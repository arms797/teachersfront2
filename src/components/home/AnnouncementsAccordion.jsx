import React, { useEffect, useState } from 'react'
import api from '../../utils/apiClient'

export default function AnnouncementsAccordion() {
    const [announcements, setAnnouncements] = useState([])

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const res = await api.get('/api/announcement/active') // فقط اطلاعیه‌های فعال
                setAnnouncements(res || [])
            } catch (err) {
                console.error('خطا در دریافت اطلاعیه‌ها:', err)
            }
        }
        fetchAnnouncements()
    }, [])

    return (
        <>
            <h5 className="mb-3">اطلاعیه‌های مهم</h5>
            <div className="accordion" id="announcementsAccordion">
                {announcements.map((a, idx) => (
                    <div className="accordion-item" key={a.id}>
                        <h2 className="accordion-header" id={`heading-${idx}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${idx}`}
                                aria-expanded="false"
                                aria-controls={`collapse-${idx}`}
                            >
                                {a.title}
                            </button>
                        </h2>
                        <div
                            id={`collapse-${idx}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${idx}`}
                            data-bs-parent="#announcementsAccordion"
                        >
                            <div className="accordion-body">
                                {a.body}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
