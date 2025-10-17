import { UserProvider } from '../context/UserContext.jsx'
import DashboardContent from './DashboardContent.jsx'

export default function Dashboard({ onLogout }) {
    return (
        <UserProvider>
            <DashboardContent onLogout={onLogout} />
        </UserProvider>
    )
}
