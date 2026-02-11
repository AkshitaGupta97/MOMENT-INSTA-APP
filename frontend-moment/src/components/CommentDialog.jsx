import { Heart, Send, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useSelector } from "react-redux";

const CommentDialog = ({ openComment, setOpenComment }) => {

  // hooks ALWAYS first
  const { selectedPost } = useSelector(state => state.post);
  const { axios } = useAppContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuref = useRef(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [text, setText] = useState('');

  // input handler
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
  };

  // send comment
  const sendMessageHandler = async () => {
    alert(text);
    setText('');
  };

  // close menu outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuref.current && !menuref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // follow toggle
  const toggleFollow = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `/api/v1/user/followunfollow/${selectedPost.author._id}`
      );

      if (response.data.success) {
        setIsFollowing(prev => !prev);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  /* ---------- SAFE RETURN AFTER HOOKS ---------- */
  if (!openComment || !selectedPost) return null;

  return (
    <div
      className="max-sm:h-[70%] max-sm:w-[80%] max-sm:mt-20 flex items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-60 p-2 sm:p-4"
      onClick={() => setOpenComment(false)}
    >
      <div
        className="flex flex-col md:flex-row w-full max-w-4xl h-[90vh] md:max-h-[80vh] bg-gray-800 rounded-lg overflow-hidden text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* LEFT SIDE */}
        <div className="w-full max-sm:h-[50%] md:w-1/2 border-r border-gray-700 flex flex-col">
          <img
            className="w-full h-[84%] object-cover"
            src={selectedPost.image}
            alt={selectedPost.caption}
          />

          <div className="p-4">
            <Link className="flex gap-2 items-center">
              <img
                className="w-10 h-10 rounded-full border-amber-300 border p-1 object-cover"
                src={selectedPost.author.profilePicture || selectedPost.image || null}
                alt={selectedPost.author.username}
              />

              <div>
                <h2 className="font-semibold text-amber-300">
                  {selectedPost.author.username}
                </h2>
                <p className="text-xs text-gray-400">
                  {selectedPost.author.bio || "No bio"}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col max-sm:border-t-slate-200">

          <div className="flex justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold">Comments</h3>

            <div className="relative flex gap-3">
              <button
                ref={menuref}
                onClick={() => setMenuOpen(s => !s)}
                className="p-2 hover:bg-gray-600 rounded"
              >
                ⋯
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 bg-gray-400 rounded flex flex-col">

                  <button
                    onClick={toggleFollow}
                    className="px-4 py-2 flex gap-2 hover:bg-gray-500"
                  >
                    <Heart size={18} />
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>

                  <button className="px-4 py-2 flex gap-2 hover:bg-gray-500">
                    <Star size={18} />
                    Favourite
                  </button>
                </div>
              )}

              <button onClick={() => setOpenComment(false)} className="hover:bg-slate-500 rounded p-1">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-auto text-gray-400">
            No comments yet
          </div>

          <div className="p-4 border-t border-gray-700 flex gap-2">
            <input
              value={text}
              onChange={changeEventHandler}
              className="flex-1 bg-gray-700 px-3 py-2 rounded"
              placeholder="Add comment..."
            />

            <button
              disabled={!text.trim()}
              onClick={sendMessageHandler}
            >
              <Send />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
