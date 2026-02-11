import { Heart, Send, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const CommentDialog = ({ openComment, setOpenComment, postAuthorId, postAuthor }) => {
  if (!openComment) return null;

  const { axios } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuref = useRef(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [text, setText] = useState('');

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }
    else {
      setText('');
    }
  }

  const sendMessageHandler = async () => {
    alert(text);
  }

  // Check if currentUser is following the post author
  useEffect(() => {
    if (postAuthor?.followers && postAuthor.followers.length > 0) {
      // This would be set from parent component with current user info
      // For now, we'll rely on the API response
    }
  }, [postAuthor]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuref.current && !menuref.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFollow = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!postAuthorId) {
        setError("Unable to perform this action");
        setLoading(false);
        return;
      }

      const response = await axios.post(`/api/v1/user/followunfollow/${postAuthorId}`);

      if (response.data.success) {
        setIsFollowing(!isFollowing);
      } else {
        setError(response.data.message || "Failed to update follow status");
      }
    } catch (err) {
      console.error("Follow/Unfollow Error:", err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  }

  return (
    <div
      className="flex items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-60 p-2 sm:p-4"
      onClick={() => setOpenComment(false)}
    >
      <div
        className="flex flex-col md:flex-row w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[80vh] bg-gray-800 rounded-lg overflow-hidden text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col">
          <img
            className="w-full h-40 sm:h-56 md:h-full object-cover cursor-pointer"
            src="https://th.bing.com/th/id/OIP.84UOxylaHnK5msu2i1JECwHaE8?w=239&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
            alt="Post"
          />

          {/* User Info */}
          <div className="p-3 sm:p-4">
            <Link className="flex gap-2 items-center">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer"
                src="https://img.freepik.com/premium-photo/love-bird-logo-design-template-abstract-love-bird-logo-design-concept_1308172-107908.jpg"
                alt="User"
              />
              <div>
                <h2 className="font-semibold text-sm sm:text-base text-amber-300">username</h2>
                <p className="font-semibold text-xs text-gray-400">Bio here...</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Comments Section */}
        <div className="w-full md:w-1/2 flex flex-col h-[45vh] md:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold">Comments</h3>

            <div className=" relative flex items-center justify-center gap-4">

              <button ref={menuref}
                className="p-2 rounded-full hover:bg-gray-500"
                onClick={() => setMenuOpen((s) => !s)}
                aria-label="menu"
              >
                <span className="text-2xl">⋯</span>
              </button>

              {
                menuOpen && (
                  <div className="absolute top-8 flex flex-col right-0 mt-2 w-52 bg-gray-400 shadow-md rounded z-10">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={toggleFollow}
                      disabled={loading}
                    >
                      <Heart className={isFollowing ? "text-red-500 fill-pink-600" : "text-gray-700"} size={18} />
                      <span className="font-semibold text-white">
                        {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
                      </span>                      
                    </button>

                    <button className="w-full border-t border-amber-200 text-left px-4 py-2 hover:bg-gray-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Star size={18} /> 
                      <p className="font-semibold text-white">Add to favourite... </p>
                    </button>

                    {error && (
                      <div className="px-4 py-2 text-xs text-red-500 border-t border-gray-300">
                        {error}
                      </div>
                    )}
                  </div>
                )
              }

              <button
                onClick={() => setOpenComment(false)}
                className="p-1 rounded hover:bg-gray-700 transition"
                aria-label="close"
              >
                <X className="w-5 h-5" />
              </button>

            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 p-3 sm:p-4 overflow-auto">
            <p className="text-xs sm:text-sm text-gray-400">No comments yet — be the first!</p>
          </div>

          {/* Input Section */}
          <div className="p-3 sm:p-4 border-t border-gray-700">
            <form className="flex gap-2">
              <input onChange={changeEventHandler} value={text}
                className="flex-1 bg-gray-700 placeholder-gray-400 text-xs sm:text-sm text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Add a comment..."
              />
              <button onClick={sendMessageHandler}  disabled={!text.trim()}
                type="button"
                className="font-semibold flex justify-center items-center px-2 sm:px-3 py-2 rounded text-white hover:bg-gray-700 transition"
              >
                <Send className="text-amber-300 hover:text-amber-400" size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;

/*
 disabled={!text.trim()} means make it disabled when it is empty
*/