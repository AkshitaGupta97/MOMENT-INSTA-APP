import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, UserRound } from 'lucide-react';
import Logo from './Logo';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const {axios} = useAppContext();
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <UserRound />, text: "Profile" },
    { icon: <LogOut />, text: "Logout" },
  ]

  const logOutHandler = async () => {
    try {
      const response = await axios.get('/api/v1/user/logout');
      if(response.data.success){
        navigate('/login');
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Sidebar-logout", error);
      toast.error(response.data.message);
    }
  }
  
  const sidebarHandler = (textType) => {
    if(textType === 'Logout'){
      logOutHandler();
    }
  }

  return (
    <div className='
      border-r-2 border-yellow-300 fixed top-0 left-0 p-2 py-3 w-1/5 h-full flex flex-col space-y-6 bg-gradient-to-b from-gray-600 to-gray-800 text-white'>
      <div className='flex flex-col font-semibold space-y-5 text-md '>
        <Logo />
        {
          sidebarItems.map((item, index) => {
            return (
              <div onClick={() => sidebarHandler(item.text)}
                className=' relative flex items-center justify-center space-x-2 hover:bg-gray-600 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out'
                key={index}>
                <p>{item.icon}</p>
                <span>{item.text}</span>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default Sidebar