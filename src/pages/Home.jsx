import React from 'react'
import { Link } from 'react-router-dom'
import ExamSeatCard from '../components/home/ExamSeatCard.jsx'
import AnnouncementsAccordion from '../components/home/AnnouncementsAccordion.jsx'

export default function HomePage() {
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">برنامه ریزی دانشگاه پیام نور شیراز</h2>
        <Link to="/login" className="text-muted small">ورود به سایت</Link>
      </div>

      {/* Exam Seat Card */}
      <ExamSeatCard />

      {/* Announcements Accordion */}
      <AnnouncementsAccordion />
    </div>
  )
}
