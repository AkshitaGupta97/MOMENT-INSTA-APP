import { MoveLeft, MoveRightIcon, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatMessages from "./ChatMessages";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from 'react-toastify';
import { setMessages } from "../redux/chatSlice";
import { useEffect } from "react";
import { setSelectedUser } from "../redux/authSlice";

const ChatPage = () => {
  const { user, suggestedUser, selectedUser } = useSelector((store) => store.auth);
  const [textMessage, setTextMessage] = useState('');
  const { axios } = useAppContext();
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();
  //const [selectedUser, setSelectedUser] = useState(null);


  const sendMessageHandler = async (receiverId) => {
    try {
      const response = await axios.post(`/api/v1/message/send/${receiverId}`, { textMessage }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        dispatch(setMessages([...messages, response.data.newMessage]));
        setTextMessage("");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Message failed");
      console.log("error from sendMessage", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    }
  }, []);

  return (
    <div className="flex h-screen font-semibold bg-gray-950 text-white">

      {/* Sidebar */}
      <div
        className={`
          flex flex-col border-r border-gray-800
          w-full sm:w-80
          ${selectedUser ? "hidden sm:flex" : "flex"}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-900 shadow-md">
          <div className="relative">
            <img
              src={user?.profilePicture || null}
              alt={user?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-gray-900 rounded-full`}></span>
          </div>

          <div>
            <h1 className="font-semibold text-lg username-gradient">
              {user?.username}
            </h1>
            {/*<span className="text-xs text-gray-400">{isOnline ? 'Online' : 'Offline'}</span>*/}
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {suggestedUser?.map((suggUser) => {
            const isOnline = onlineUsers.includes(suggUser?._id);
            return (
              <div
                key={suggUser._id}
                onClick={() => dispatch(setSelectedUser(suggUser))}
                className="flex  items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition"
              >
                <div className="relative">
                  <img
                    src={suggUser?.profilePicture || null}
                    alt={suggUser?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? 'bg-green-400 border-2' : 'bg-red-600 border-2'} border-gray-900 rounded-full`}></span>
                </div>

                <div>
                  <h2 className="font-semibold">{suggUser?.username}</h2>
                  <p className="text-xs text-gray-400">
                    <span className="text-xs text-gray-400">{isOnline ? 'Online' : 'Offline'}</span>
                  </p>
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`
          flex-1 flex flex-col
          ${selectedUser ? "flex" : "hidden sm:flex"}
        `}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
              {/* Back button mobile */}
              <button
                onClick={() => setSelectedUser(null)}
                className="sm:hidden text-gray-300 text-xl mr-2"
              >
                <MoveLeft fill="yellow" />
              </button>

              <img
                src={selectedUser.profilePicture || null}
                className="w-9 h-9 rounded-full object-cover"
              />

              <h2 className="font-semibold">
                {selectedUser.username}
              </h2>
              <Link to={`/profile/${selectedUser?._id}`} className='flex items-center justify-center text-blue-400 text-xs'>
                View Profile <button> <MoveRightIcon size={16} /> </button>
              </Link>
            </div>

            {/* Messages Area  Chat coming soon 💬 */}
            <div className="flex flex-col flex-1 bg-gray-950">

              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className='flex flex-col justify-start items-center p-2 bg-gray-900 rounded-md shadow-lg'>
                  <div className="flex justify-center items-center gap-2">
                    <img className="w-12 h-12 rounded-full p-2 border border-amber-200 " src={selectedUser?.profilePicture || null} alt={selectedUser?.username} />
                    <p>{selectedUser.username}</p>
                  </div>
                  <Link to={`/profile/${selectedUser?._id}`} className='flex items-center justify-center text-blue-400 text-xs'>
                    View Profile <button> <MoveRightIcon size={16} /> </button>
                  </Link>
                </div>
              </div>

              <ChatMessages selectedUser={selectedUser} />

              {/* Message Input */}
              <div className="flex items-center gap-2 p-3 border-t border-gray-800 bg-gray-900">
                <input
                  value={textMessage} onChange={(e) => setTextMessage(e.target.value)}
                  type="text"
                  placeholder="Message..."
                  className="flex-1 bg-gray-800 text-gray-200 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-purple-600 transition"
                />

                <button onClick={() => sendMessageHandler(selectedUser?._id)} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full transition active:scale-95">
                  <Send size={20} />
                </button>
              </div>

            </div>

          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
