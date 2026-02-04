
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Posts from '../components/Posts';
import Stories from '../components/Stories';

const Home = () => {
  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <Outlet />
        <div className="flex-1 flex-col flex-grow">
          <Stories />
          <Posts />
        </div>
        
    </div>
  )
}

export default Home