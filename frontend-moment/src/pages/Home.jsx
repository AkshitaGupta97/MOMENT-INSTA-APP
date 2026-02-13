
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Stories from '../components/Stories';
//import { Posts } from '../components/Posts';
import UseGetAllPost from '../hooks/useGetAllPost';
import PostAll from '../components/PostAll';
import SidebarRightSide from '../components/SidebarRightSide';

const Home = () => {
  UseGetAllPost();
  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <Outlet />
        <div className="flex-1 flex flex-col h-screen">
          {/* Fixed Stories Section */}
          <div className="flex-shrink-0 pt-2">
            <Stories />
          </div>
          
          {/* Scrollable Posts Section */}
          <div className="overflow-y-auto">
            <PostAll />
          </div>
        </div>

        <SidebarRightSide />
        
    </div>
  )
}

export default Home