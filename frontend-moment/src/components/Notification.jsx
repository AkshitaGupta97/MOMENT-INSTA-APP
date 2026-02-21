import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notification = () => {

    const navigate = useNavigate();
    const {likeNotification} = useSelector(state=> state.realTimeNotification);
    console.log("likenotification", likeNotification);
    

return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-600 to-gray-800 text-white p-6">

      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {likeNotification.length === 0 ? (
        <p className="text-gray-300 font-semibold">No notifications yet</p>
      ) : (
        <div className="space-y-4">
          {likeNotification.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/profile/${item?._id}`)}
              className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-4 rounded-xl cursor-pointer transition duration-200"
            >
              {/* Left Side */}
              <div className="flex items-center space-x-4">

                <img
                  src={item?.profilePicture || null}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">
                    {item.username}
                  </p>
                  <p className="text-sm text-gray-300">
                    liked your post ❤️
                  </p>
                </div>
              </div>

              {/* Optional Post Preview 
                {item.image && (
                    <img
                    src={item.image}
                    alt="post"
                    className="w-10 h-10 object-cover rounded-md"
                    />
                )}
                */}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;