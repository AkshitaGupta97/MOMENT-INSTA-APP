import { useSelector } from "react-redux";
import UseGetAllMessage from "../hooks/UseGetAllMessage";

const ChatMessages = ({ selectedUser }) => {
  UseGetAllMessage();

  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  const safeMessages = Array.isArray(messages) ? messages : [];

  // Show only messages between logged-in user and selectedUser
  const userMessages = safeMessages.filter(
    msg =>
      (msg.senderId === selectedUser?._id && msg.receiverId === user._id) ||
      (msg.receiverId === selectedUser?._id && msg.senderId === user._id)
  );

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex flex-col gap-3">
        {userMessages.map(msg => (
          <div key={msg._id} className="flex">
            <div>{msg.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;