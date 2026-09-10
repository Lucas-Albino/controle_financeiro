import { Outlet } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar.jsx'
import './AppLayout.css'

function AppLayout() {
    return (
        <div className="flex min-h-screen max-[720px]:flex-col">
            <Sidebar />

            <main className="min-w-0 flex-1 bg-[#f8fafc] p-8 max-[720px]:p-5">
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout
