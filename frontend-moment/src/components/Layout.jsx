import { Outlet } from "react-router-dom"
import SidebarRightSide from "./SidebarRightSide";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col h-screen">
            <Outlet />
        </div>

        <SidebarRightSide />
    </div>
  )
}

export default Layout