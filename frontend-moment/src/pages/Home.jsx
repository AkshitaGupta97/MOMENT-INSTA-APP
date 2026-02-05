
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Stories from '../components/Stories';
import { Posts } from '../components/Posts';

const Home = () => {
  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <Outlet />
        <div className="flex-1 flex flex-col h-screen">
          {/* Fixed Stories Section */}
          <div className="flex-shrink-0 pt-8">
            <Stories />
          </div>
          
          {/* Scrollable Posts Section */}
          <div className="flex-1 overflow-y-auto">
            <Posts />
          </div>
        </div>
        
    </div>
  )
}

export default Home