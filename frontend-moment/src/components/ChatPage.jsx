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

      console.log("messages type:", messages);

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
        flex-1 flex flex-col h-screen
        ${selectedUser ? "flex" : "hidden sm:flex"}
      `}
      >
        {selectedUser ? (
          <>
            {/* ================= HEADER ================= */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
              <button
                onClick={() => dispatch(setSelectedUser(null))}
                className="sm:hidden text-gray-300 text-xl mr-2"
              >
                <MoveLeft fill="yellow" />
              </button>

              <img
                src={selectedUser?.profilePicture || ""}
                className="w-9 h-9 rounded-full object-cover"
                alt={selectedUser?.username || null}
              />

              <div className="flex flex-col">
                <h2 className="font-semibold">{selectedUser?.username}</h2>
                <Link
                  to={`/profile/${selectedUser?._id}`}
                  className="text-blue-400 text-xs"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* ================= CHAT BODY ================= */}
            <div className="flex flex-col overflow-y-auto flex-1 bg-gray-950">

              {/* Messages */}
              <ChatMessages selectedUser={selectedUser} />

              {/* ================= INPUT ================= */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-t border-gray-800">
                <input
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  type="text"
                  placeholder="Message..."
                  className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-purple-600"
                />

                <button
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full transition active:scale-95"
                >
                  <Send size={18} />
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
