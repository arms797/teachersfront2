import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/apiClient.js'
import axios from 'axios';


const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [userRoles, setUserRoles] = useState([])
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await api.get('/api/auth/me') // اینجا user داده‌ی اصلیه
                //console.log("اطلاعات کاربر:", user)
                if (user && user.roles) {
                    setUserRoles(user.roles.map(r => r.toLowerCase()))
                    setUserInfo({
                        id: user.id,
                        username: user.username,
                        fullName: user.fullName,
                        centerCode: user.centerCode
                    })
                } else {
                    setUserRoles([])
                    setUserInfo(null)
                }
            } catch (err) {
                console.error('خطا در دریافت اطلاعات کاربر:', err)
                setUserRoles([])
                setUserInfo(null)
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
