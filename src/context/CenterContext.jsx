import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/apiClient.js'

const CenterContext = createContext(null)

export function CenterProvider({ children }) {
    const [centers, setCenters] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCenters() {
            try {
                const res = await api.get('/api/center')
                setCenters(res) // هر مرکز شامل CenterCode و Title است
            } catch (err) {
                console.error('خطا در دریافت مراکز دانشگاهی:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchCenters()
    }, [])

    return (
        <CenterContext.Provider value={{ centers, loading }}>
            {children}
        </CenterContext.Provider>
    )
}

export function useCenters() {
    const context = useContext(CenterContext)
    if (!context) throw new Error('useCenters باید داخل CenterProvider استفاده شود')
    return context
}
