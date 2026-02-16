import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const { user, suggestedUser } = useSelector((store) => store.auth);

  const [selectedUser, setSelectedUser] = useState(null);

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
              src={user?.profilePicture}
              alt={user?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
          </div>

          <div>
            <h1 className="font-semibold text-lg username-gradient">
              {user?.username}
            </h1>
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {suggestedUser?.map((suggUser) => (
            <div
              key={suggUser._id}
              onClick={() => setSelectedUser(suggUser)}
              className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition"
            >
              <img
                src={suggUser?.profilePicture}
                alt={suggUser?.username}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <h2 className="font-medium">{suggUser?.username}</h2>
                <span className="text-xs text-gray-400">
                  Start conversation
                </span>
              </div>
            </div>
          ))}
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
                src={selectedUser.profilePicture}
                className="w-9 h-9 rounded-full object-cover"
              />

              <h2 className="font-semibold">
                {selectedUser.username}
              </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Chat coming soon 💬
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
