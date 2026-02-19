import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import UseGetAllMessage from "../hooks/UseGetAllMessage";
import UseGetRealTimeMessage from "../hooks/UseGetRealTimeMessage";

const ChatMessages = ({ selectedUser }) => {
  UseGetRealTimeMessage();
  UseGetAllMessage();

  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  const safeMessages = Array.isArray(messages) ? messages : [];

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages]);

  const userMessages = safeMessages.filter(
    msg =>
      (msg.senderId === selectedUser?._id && msg.receiverId === user?._id) ||
      (msg.receiverId === selectedUser?._id && msg.senderId === user?._id)
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-950">
      <div className="flex flex-col gap-3">
        {
        userMessages.map(msg => {
          const isMe = msg.senderId === user?._id;

          return (
            <div
              key={msg._id}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  px-4 py-2 rounded-2xl max-w-[70%] break-words text-sm
                  ${isMe
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-purple-600 text-white rounded-bl-md"}
                `}
              >
                {msg.message}
              </div>
            </div>
          );
        })
       }
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
