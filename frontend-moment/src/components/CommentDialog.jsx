import { Heart, Send, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { toast } from "react-toastify";

const CommentDialog = ({ openComment, setOpenComment }) => {

  /* ================= Redux & Context ================= */
  const { selectedPost } = useSelector((state) => state.post);
  const { axios } = useAppContext();
  const dispatch = useDispatch();

  /* ================= States ================= */
  const [myComment, setMyComment] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const menuRef = useRef(null);

  /* ================= Sync comments when post changes ================= */
  useEffect(() => {
    if (selectedPost?.comments) {
      setMyComment(selectedPost.comments);
    }
  }, [selectedPost]);

  /* ================= Input change handler ================= */
  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  /* ================= Send Comment ================= */
  const sendCommentHandler = async () => {
    if (!text.trim()) return;

    try {
      const response = await axios.post(
        `/api/v1/post/${selectedPost._id}/comment`,
        { textMsg: text.trim() }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // reload posts so comments update everywhere
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

  /* ================= Close menu outside click ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= Follow / Unfollow ================= */
  const toggleFollow = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `/api/v1/user/followunfollow/${selectedPost.author._id}`
      );

      if (response.data.success) {
        setIsFollowing(prev => !prev);
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  /* ================= Guard return ================= */
  if (!openComment || !selectedPost) return null;

  /* ================= UI ================= */
  return (
    <div
      className="fixed max-sm:w-[80%] max-sm:ml-4 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2 sm:p-4"
      onClick={() => setOpenComment(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          flex flex-col md:flex-row
          w-full max-w-4xl
          h-[95vh] md:h-[85vh]
          bg-gray-800 rounded-lg overflow-hidden text-white
        "
      >
        {/* ================= LEFT IMAGE SIDE ================= */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-gray-700">
          <img
            className="w-full max-sm:max-h-64 max-h-[80%] object-cover"
            src={selectedPost.image || null}
            alt={selectedPost.caption}
          />

          <div className="p-3">
            <Link className="flex flex-col  gap-2 items-center">
              <img
                className="w-10 h-10 rounded-full border object-cover"
                src={selectedPost.author.profilePicture || selectedPost.image || null}
                alt={selectedPost.author.username}
              />
              <h2 className="font-semibold text-amber-300">
                {selectedPost.author.username}
              </h2>
              <p className="font-semibold text-sm text-slate-100">{selectedPost.bio} || Bio here... </p>
            </Link>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0">

          {/* ===== Header ===== */}
          <div className="flex justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold">Comments</h3>

            <div className="relative flex gap-3">
              <button
                ref={menuRef}
                onClick={() => setMenuOpen(s => !s)}
                className="p-2 hover:bg-gray-600 rounded"
              >
                ⋯
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 bg-gray-500 rounded flex flex-col w-36">
                  <button
                    onClick={toggleFollow}
                    className="px-4 py-2 flex gap-2 hover:bg-gray-600"
                  >
                    <Heart size={16} />
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>

                  <button className="px-4 py-2 flex gap-2 hover:bg-gray-600">
                    <Star size={16} />
                    Favourite
                  </button>
                </div>
              )}

              <button
                onClick={() => setOpenComment(false)}
                className="hover:bg-gray-600 rounded p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ===== Scrollable Comments ===== */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {myComment.length > 0 ? (
              myComment.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={c.author.profilePicture}
                    alt={c.author.username}
                  />

                  <div>
                    <span className="font-semibold text-amber-200">
                      @{c.author.username}
                    </span>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">
                No comments yet.
              </div>
            )}
          </div>

          {/* ===== Input ===== */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              value={text}
              onChange={changeEventHandler}
              className="flex-1 bg-gray-700 px-3 py-2 rounded outline-none"
              placeholder="Add comment..."
            />

            <button onClick={sendCommentHandler}>
              <Send className="text-amber-300 cursor-pointer" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
