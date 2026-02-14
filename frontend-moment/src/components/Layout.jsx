import { Outlet, useLocation } from "react-router-dom";
import UseGetAllPost from "../hooks/useGetAllPost";
import UseGetSuggestedUser from "../hooks/UseSuggestedUsers";
import Sidebar from "./Sidebar"
import SidebarRightSide from "./SidebarRightSide";

const Layout = () => {
  UseGetAllPost();
  UseGetSuggestedUser();

  const location = useLocation();
  const isExplorePage = location.pathname === "/exploreUsers";

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Outlet />
      </div>

      {!isExplorePage && <SidebarRightSide />}
    </div>
  );
};

export default Layout;