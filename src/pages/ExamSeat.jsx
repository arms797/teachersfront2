import React from 'react'
import ExamSeatCard from '../components/home/ExamSeatCard.jsx'

export default function ExamSeat() {
    return (
        <div className="container mt-4 text-center">
            <h2 className="fw-bold text-primary mb-4">
                شماره صندلی امتحانات دانشجو
            </h2>
            <ExamSeatCard />
        </div>
    )
}
