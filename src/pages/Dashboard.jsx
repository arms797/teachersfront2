import { UserProvider } from '../context/UserContext.jsx'
import { TermProvider } from '../context/TermContext.jsx'
import { CenterProvider } from '../context/CenterContext.jsx'
import DashboardContent from './DashboardContent.jsx'

export default function Dashboard({ onLogout }) {
    return (
        <UserProvider>
            <TermProvider>
                <CenterProvider>
                    <DashboardContent onLogout={onLogout} />
                </CenterProvider>
            </TermProvider>
        </UserProvider>
    )
}
