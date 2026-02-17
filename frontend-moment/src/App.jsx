import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Home from "./pages/Home";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Layout from "./components/Layout";
import ExploreUsers from "./components/ExploreUser";
import { EditProfile } from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocketIo } from "./redux/socketChatSlice";
import { setOnlineUsers } from "./redux/chatSlice";

const App = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Variable to store socket instance
    // Declared outside so cleanup can access it
    let socketio;

    // Run only if user exists (user logged in)
    if (user) {

      // Connect to socket server
      socketio = io("http://localhost:8000", {

        // Send userId while connecting
        // Server uses this to track online users
        query: {
          userId: user?._id,
        },

        // Force websocket transport
        // (faster & avoids polling fallback)
        transports: ["websocket"],
      });

      // Store socket instance in Redux
      // so other components can use it
      dispatch(setSocketIo(socketio));

      // Listen to event sent by server
      // Server sends list of online users
      socketio.on("getOnlineUsers", (onlineuser) => {

        // Save online users in Redux store
        dispatch(setOnlineUsers(onlineuser));
      });
    }
    
    return () => {
      if (socketio) {

        // Disconnect socket connection
        socketio.close();

        // Remove socket from Redux store
        dispatch(setSocketIo(null));
      }
    };

    // Effect runs again if user or dispatch changes
  }, [user, dispatch]);


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        style={{ zIndex: 9999 }}
      />


      <div className="w-full min-h-screen bg-gradient-to-r from-gray-600  to-gray-800 ">
        <Routes>

          <Route element={<Layout />} >
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/exploreUsers" element={<ExploreUsers />} />
            <Route path="/account/edit" element={<EditProfile />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </>

  )

}

export default App