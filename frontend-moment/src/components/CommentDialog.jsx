import { Heart, Send, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { toast } from "react-toastify";

const CommentDialog = ({ openComment, setOpenComment }) => {
  /* ---------------- Redux & Context ---------------- */
  const { selectedPost } = useSelector((state) => state.post);
  const { axios } = useAppContext();
  const dispatch = useDispatch();

  /* ---------------- States ---------------- */
  const [myComment, setMyComment] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const menuref = useRef(null);

  /* ---------------- Sync comments when post changes ---------------- */
  useEffect(() => {
    if (selectedPost?.comments) {
      setMyComment(selectedPost.comments);
    }
  }, [selectedPost]);

  /* ---------------- Input handler ---------------- */
  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  /* ---------------- Send Comment ---------------- */
  const sendCommentHandler = async () => {
    if (!text.trim()) return;

    try {
      const response = await axios.post(
        `/api/v1/post/${selectedPost._id}/comment`,
        { textMsg: text.trim() }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // refresh posts so every page updates
        const allPostResponse = await axios.get("/api/v1/post/all");

        if (allPostResponse.data.success) {
          dispatch(setPosts(allPostResponse.data.post));
        }

        setText("");
      }
    } catch (error) {
      console.log("Send comment error:", error);
      toast.error("Failed to add comment");
    }
  };

  /* ---------------- Close menu outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuref.current && !menuref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Follow toggle ---------------- */
  const toggleFollow = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `/api/v1/user/followunfollow/${selectedPost.author._id}`
      );

      if (response.data.success) {
        setIsFollowing((prev) => !prev);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  /* ---------------- Guard return ---------------- */
  if (!openComment || !selectedPost) return null;

  /* ---------------- UI ---------------- */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2 sm:p-4"
      onClick={() => setOpenComment(false)}
    >
      <div
        className="flex flex-col md:flex-row w-full max-w-4xl h-[90vh] md:max-h-[80vh] bg-gray-800 rounded-lg overflow-hidden text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 border-r border-gray-700 flex flex-col">
          <img
            className="w-full h-[85%] object-cover"
            src={selectedPost.image}
            alt={selectedPost.caption}
          />

          <div className="p-4">
            <Link className="flex gap-2 items-center">
              <img
                className="w-10 h-10 rounded-full border p-1 object-cover"
                src={selectedPost.author.profilePicture}
                alt={selectedPost.author.username}
              />

              <div>
                <h2 className="font-semibold text-amber-300">
                  {selectedPost.author.username}
                </h2>
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Header */}
          <div className="flex justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold">Comments</h3>

            <div className="relative flex gap-3">
              <button
                ref={menuref}
                onClick={() => setMenuOpen((s) => !s)}
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

              <button
                onClick={() => setOpenComment(false)}
                className="hover:bg-slate-500 rounded p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="flex flex-col p-3 overflow-y-auto flex-1">
            {myComment.length > 0 ? (
              myComment.map((c) => (
                <div
                  key={c._id}
                  className="text-sm mb-3 flex gap-3 items-center"
                >
                  <img
                    className="w-9 h-9 rounded-full object-cover"
                    src={c.author.profilePicture}
                    alt={c.author.username}
                  />

                  <div>
                    <span className="font-semibold text-amber-200">
                      @{c.author.username}
                    </span>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">
                No comments yet.
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700 flex gap-2">
            <input
              value={text}
              onChange={changeEventHandler}
              className="flex-1 bg-gray-700 px-3 py-2 rounded"
              placeholder="Add comment..."
            />

            <button onClick={sendCommentHandler}>
              <Send className="text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
