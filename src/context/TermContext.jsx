import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/apiClient.js'


const TermContext = createContext(null)

export function TermProvider({ children }) {
    const [activeTerm, setActiveTerm] = useState(null)
    const [selectedTerm, setSelectedTerm] = useState(null)
    const [allTerms, setAllTerms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTerms() {
            try {
                const res = await api.get('/api/termCalender') // res خودش آرایه‌ست

                if (Array.isArray(res)) {
                    setAllTerms(res)

                    const active = res.find(t => t.active)
                    setActiveTerm(active?.term || null)
                    setSelectedTerm(active?.term || null)
                } else {
                    console.error('داده دریافتی آرایه نیست:', res)
                }
            } catch (err) {
                console.error('خطا در دریافت لیست ترم‌ها:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchTerms()
    }, [])


    return (
        <TermContext.Provider value={{
            activeTerm,
            selectedTerm,
            setSelectedTerm,
            allTerms,
            loading
        }}>
            {children}
        </TermContext.Provider>
    )
}
export function useTerms() {
    return useContext(TermContext)
}
