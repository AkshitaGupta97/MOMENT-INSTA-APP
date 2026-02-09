import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, UserRound, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import CreatePost from './CreatePost';

const Sidebar = () => {
  const {axios} = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [iscreateOpen, setiscreateOpen] = useState(false);

  const dispatch = useDispatch();


  const user = useSelector(store => store.auth); // to get value from store we use useSelector

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: user?.profilePicture ? <img src={user?.profilePicture} alt="Profile" className="w-6 h-6 rounded-full object-cover" /> : <UserRound />, text: "Profile" },
    { icon: <LogOut />, text: "Logout" },
  ]

  const logOutHandler = async () => {
    try {
      const response = await axios.get('/api/v1/user/logout');
      if(response.data.success){
        dispatch(setAuthUser(null));
        navigate('/login');
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Sidebar-logout", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  const createPostHandler = () => {
   // navigate('/create-post');
   setiscreateOpen(true);
    // Close sidebar on mobile after clicking
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
    console.log("Create Post Clicked");
  }
  
  const sidebarHandler = (textType) => {
    if(textType === 'Logout'){
      logOutHandler();
    } 
    else if (textType === 'Home') {
      navigate('/');
    } 
    else if (textType === 'Profile') {
      navigate('/profile');
    }
    else if (textType === 'Create') {
      // Trigger file input for story creation
     // document.getElementById('story-input').click();
     createPostHandler();
     setiscreateOpen(true);
    }
    // Close sidebar on mobile after clicking
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }

  /*const handleStoryUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); /* key: image, value: selected file 

    try {
      const response = await axios.post('/api/v1/story/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  //This request contains a file.
        },
      });

      console.log('Sidebar handleStoryUpload response:', response?.data);
      if (response.data.success) {
        toast.success('Story added successfully!');
        // Refresh the page to show the new story
        window.location.reload();
      }
    } catch (error) {
      console.log("Error uploading story:", error);
      toast.error("Failed to add story");
    }

    // Reset input
    event.target.value = '';
  }; */

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-6 right-2 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-700 text-white p-2 rounded-lg shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        border-r border-yellow-300 fixed top-0  h-screen left-0 p-2 py-3 flex flex-col space-y-6 bg-gradient-to-b from-gray-600 to-gray-800 text-white transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:w-1/5 w-64
      `}>
        <div className='flex flex-col font-semibold space-y-5 text-md'>
          <Logo />
          {
            sidebarItems.map((item, index) => {
              return (
                <div onClick={() => sidebarHandler(item.text)}
                  className='relative flex items-center justify-center space-x-2 hover:bg-gray-600 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out'
                  key={index}>
                  <p>{item.icon}</p>
                  <span>{item.text}</span>
                </div>
              )
            })
          }
        </div>
      </div>

      <CreatePost iscreateOpen={iscreateOpen} setiscreateOpen={setiscreateOpen} />

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Hidden file input for story upload 
      <input
        id="story-input"
        type="file"
        accept="image/*"
        onChange={handleStoryUpload}
        className="hidden"
      />
      */}
    </>
  )
}

export default Sidebar