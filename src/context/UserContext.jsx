import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/apiClient.js'

const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [userRoles, setUserRoles] = useState([])
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get('/api/auth/me')

                //console.log('اطلاعات دریافتی از /api/account/me:', res)

                setUserRoles(res.roles.map(r => r.toLowerCase()))
                setUserInfo({ id: res.id, username: res.username })

                // console.log('نقش‌های نهایی:', res.roles.map(r => r.toLowerCase()))

            } catch (err) {
                console.error('خطا در دریافت اطلاعات کاربر:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    function hasRole(roleName) {
        return userRoles.includes(roleName.toLowerCase())
    }

    return (
        <UserContext.Provider value={{ userRoles, userInfo, hasRole, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
