import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ExamSeatCard from '../components/home/ExamSeatCard.jsx'
import AnnouncementsAccordion from '../components/home/AnnouncementsAccordion.jsx'
import api from '../utils/apiClient.js'

export default function HomePage() {
  const [activeFeatures, setActiveFeatures] = useState([])

  useEffect(() => {
    async function fetchActiveFeatures() {
      try {
        const res = await api.get('/api/componentfeature/active')
        setActiveFeatures(res.data || [])
      } catch (err) {
        console.error("خطا در دریافت کامپوننت‌های فعال:", err)
      }
    }
    fetchActiveFeatures()
  }, [])

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">برنامه ریزی دانشگاه پیام نور شیراز</h2>
        <Link to="/login" className="text-muted small">ورود به سایت</Link>
      </div>

      {/* Exam Seat Card */}
      {activeFeatures.some(f => f.name === "examSeat") && <ExamSeatCard />}

      {/* Announcements Accordion */}
      {activeFeatures.some(f => f.name === "announcementsAccordion") && <AnnouncementsAccordion />}
    </div>
  )
}
