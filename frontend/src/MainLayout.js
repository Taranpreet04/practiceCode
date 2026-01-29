import { Outlet } from "react-router-dom"
import Sidebar from "./common/Sidebar/Sidebar"
import "./MainLayout.css"

function MainLayout() {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
export default MainLayout