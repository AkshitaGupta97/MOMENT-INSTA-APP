import { useState, useRef, useEffect } from "react";
import { Bookmark, Heart, LucideSquareChevronDown, MessageCircle, Send, Trash2 } from "lucide-react";
//import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { setPosts, setSelectedPost } from "../redux/postSlice";

export const Posts = ({ post, setOpenComment }) => {

    console.log("POst message", post)

    // follow state for menu
    const [isFollowing, setIsFollowing] = useState(false);

    // menu open/close
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // redux posts
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    // logged in user
    const { user } = useSelector(store => store.auth);

    // check if current user already liked post
    const [liked, setLiked] = useState(
        post.likes.includes(user?._id) || false
    );

    const { axios } = useAppContext();

    // initial like count
    const [postLike, setPostLike] = useState(post.likes.length);

    // comments from backend
    const [comment, setComment] = useState(post.comments);
    const [showComment, setShowComment] = useState(false);

    // comment text input
    const [text, setText] = useState('');

    // comment input toggle
    const [open, setOpen] = useState(false);

    // dialog open
    // const [openComment, setOpenComment] = useState(false);

    // remove extra spaces from comment input
    const changeEventHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    };

    //console.log("checking post ", post, post.image);

    // close menu when clicked outside
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

    // follow toggle
    const toggleFollow = () => {
        setIsFollowing(p => !p);
        setMenuOpen(false);
    };

    // delete post
    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `/api/v1/post/delete/${post._id}`
            );

            if (response.data.success) {
                const updatedPosts = posts.filter(
                    postItem => postItem._id !== post._id
                );

                dispatch(setPosts(updatedPosts));
                toast.success(response.data.message);
                setMenuOpen(false);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete post"
            );
        }
    };

    // like / dislike handler
    const likeDislikeHandler = async (postId) => {
        try {
            const action = liked ? 'dislike' : 'like';

            const response = await axios.get(
                `/api/v1/post/${postId}/${action}`
            );

            if (response.data.success) {
                const updatedLikes = liked
                    ? postLike - 1
                    : postLike + 1;

                setPostLike(updatedLikes);
                setLiked(!liked);

                toast.success(response.data.message);

                // refresh posts
                const allPostsResponse =
                    await axios.get('/api/v1/post/all');

                if (allPostsResponse.data.success) {
                    dispatch(setPosts(allPostsResponse.data.post));
                }
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to like/dislike post"
            );
        }
    };

    // add comment
    const commentHandler = async (text) => {
        try {
            const response = await axios.post(
                `/api/v1/post/${post._id}/comment`,
                { textMsg: text },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {

                // add new comment locally
                const updatedCommentData = [
                    ...comment,
                    response.data.comment
                ];

                setComment(updatedCommentData);

                toast.success(response.data.message);

                // refresh posts
                const allPostsResponse =
                    await axios.get('/api/v1/post/all');

                if (allPostsResponse.data.success) {
                    dispatch(setPosts(allPostsResponse.data.post));
                }

                setText('');
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        }
    };

    return (
        <div className="my-2 max-sm:w-[80%] max-w-lg p-1 mx-auto bg-gray-600 rounded-lg">

            {/* Header */}
            <div className="flex items-center justify-between p-1">

                <div className="flex items-center gap-2">
                    <img
                        className="w-8 h-8 rounded-full border-amber-300 border p-1 object-cover "
                        src={post.author.profilePicture || post.image || null}
                        alt={post.author.username}
                    />
                    <h1 className="text-amber-200 font-semibold">
                        {post.author.username}
                    </h1>
                </div>

                {/* menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        className="p-2 rounded-full hover:bg-gray-500"
                        onClick={() => setMenuOpen(s => !s)}
                    >
                        <span className="text-2xl">⋯</span>
                    </button>

                    {menuOpen && (
                        <div className="absolute font-semibold right-0 mt-2 w-44 bg-gray-500 rounded">

                            <button
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-600"
                                onClick={toggleFollow}
                            >
                                <Heart size={16} />
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>

                            {/* Delete Post */}
                            {user?._id === post.author._id && (
                                <button
                                    className="flex items-center border-t-amber-200 gap-2 w-full px-4 py-2 hover:bg-gray-600 hover:text-red-500"
                                    onClick={handleDelete}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* Image */}
            <img
                onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpenComment(true);
                }}
                className="rounded-lg w-full max-h-[50vh] object-cover cursor-pointer"
                src={post.image}
                alt={post.caption}
            />

            {/*  <CommentDialog
                openComment={openComment}
                setOpenComment={setOpenComment}
            /> */}

            {/* Actions */}
            <div className="flex justify-between p-2">

                <div className="flex gap-4">
                    <Heart
                        onClick={() =>
                            likeDislikeHandler(post._id)
                        }
                        className={`cursor-pointer text-white ${liked ? 'fill-pink-600' : ''}`}
                    />

                    <MessageCircle 
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer text-white hover:text-amber-700"
                    />

                    <Send className="cursor-pointer text-white hover:text-green-400" />
                </div>

                <Bookmark className="cursor-pointer text-white hover:text-amber-300" />
            </div>

            <span className="text-white font-semibold">
                {postLike} likes
            </span>

            {/* caption */}
            <div className="text-white font-semibold">
                <p className="text-slate-300"><span className="text-amber-200 text-sm">@-</span> {post.author.username}</p>
                <p>{post.caption}</p>
                <p className="text-amber-300">{comment.length} comments</p>
            </div>

            {
                comment.length > 0 ? 
                    (<div className="mt-2">
                        <div className="flex justify-center items-center gap-4">
                            <p className="text-blue-300 font-semibold text-sm ">View all comments...</p> 
                            <LucideSquareChevronDown className="text-pink-300 hover:text-slate-300 cursor-pointer" size={22} onClick={() => setShowComment(!showComment)} /> 
                        </div>
                        { showComment &&  comment.map((c) => (
                            <div key={c._id} className="text-white text-sm">
                                <span className="text-amber-200">@{c.author.username}</span> {c.text}
                            </div>
                        ))}
                    </div>
                ): (
                    <div className="text-sm font-semibold text-gray-400 mt-2">
                        No comments yet. Be the first to comment!
                    </div>
                )
            }

            {/* comment box */}
            {open && (
                <div className="relative mt-2">

                    <input
                        value={text}
                        onChange={changeEventHandler}
                        className="w-full bg-slate-300 text-gray-800 rounded-md py-2 px-3"
                        type="text"
                        placeholder="add a comment..."
                    />

                    {text && (
                        <Send
                            onClick={() => {
                                commentHandler(text);
                                setOpen(false);
                            }}
                            className="absolute right-4 top-2 cursor-pointer text-blue-600"
                        />
                    )}
                </div>
            )}
        </div>
    );
};
