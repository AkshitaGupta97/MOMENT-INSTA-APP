import { useState, useRef, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { setPosts } from "../redux/postSlice";

export const Posts = ({post}) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const {posts} = useSelector(store => store.post);
    const dispatch = useDispatch();

    const {user} = useSelector(store=> store.auth);
    const [liked, setLiked] = useState(post.likes.includes(useSelector(store => store.auth.user._id)) || false); //[useSelector(store => store.auth.user._id)] or [user._id] both are same, we can use any one of them. We are checking whether the user id is present in post.likes array or not, if it is present then liked state will be true otherwise false. This will help us to set the color of like icon and also to toggle like/dislike functionality when user clicks on like icon.
    const {axios} = useAppContext();
    const [postLike, setPostLike] = useState(post.likes.length);  // inintial like count is set to length of post.likes array, which is coming from backend, and whenever user clicks on like/dislike icon we will update this like count based on the response from backend. This will help us to show the updated like count without refreshing the page.
    const [comment, setComment] = useState(post.comments); 

    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [openComment, setOpenComment] = useState(false);

    const changeEventHandler = (e) => {
        // remove extra space
        const inputText = e.target.value;
        if(inputText.trim()){  // if we are removing white space then we add it to setText
            setText(inputText);
        }
        else {
            setText('');
        }

    }

    useEffect(() => {   //Click ⋯ → menu opens,  Click outside → menu closes

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);   // If menu exists , AND click is NOT inside menu
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleFollow = () => {
        setIsFollowing((p) => !p);
        setMenuOpen(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/v1/post/delete/${post._id}`);
            if(response.data.success){
                const updatedPosts = posts.filter((postItem) => postItem._id !== post._id);
                dispatch(setPosts(updatedPosts));
                toast.success(response.data.message);
                setMenuOpen(false);
            }
            console.log("Delete Post Response => ", response);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    };

    const likeDislikeHandler = async (postId) => {
        try {
            const action = liked ? 'dislike' : 'like';
            const response = await axios.get(`/api/v1/post/${postId}/${action}`);
            if(response.data.success){
                const updatedLikes = liked ? postLike - 1 : postLike + 1; // if already liked then we are disliking it so we will decrease the like count by 1, otherwise we will increase the like count by 1
                setPostLike(updatedLikes);
                setLiked(!liked);
                toast.success(response.data.message);
                console.log("Like/Dislike Post Response => ", response);
                // After liking/disliking the post, we need to update the posts in redux store to reflect the changes in UI. So we will fetch all the posts again from backend and update the redux store with new posts data. This will help us to show the updated like count and also to toggle like/dislike icon color based on liked state.
                const allPostsResponse = await axios.get('/api/v1/post/all');
                if(allPostsResponse.data.success){
                    dispatch(setPosts(allPostsResponse.data.post));
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to like/dislike post");
            console.log("Like/Dislike Post Error => ", error);
        }
    }
    
    const commentHandler = async (text) => {
        try {
            const response = await axios.post(`/api/v1/post/${post._id}/comment`, {text}, {headers: {'Content-Type': 'application/json'}});
            if(response.data.success){
                const updatedCommentData = [...comment, response.data.comment]; // we are adding new comment to the existing comments array, which is coming from backend response, and then we are setting this updated comments array to comment state using setComment. This will help us to show the new comment in UI without refreshing the page.
                setComment(updatedCommentData);
                toast.success(response.data.message);

                // After adding a comment, we need to update the posts in redux store to reflect the changes in UI. So we will fetch all the posts again from backend and update the redux store with new posts data. This will help us to show the updated comments count and also to show the new comment in UI.
                const allPostsResponse = await axios.get('/api/v1/post/all');
                if(allPostsResponse.data.success){
                    dispatch(setPosts(allPostsResponse.data.post));
                }
            }
        } catch (error) {
            console.log("Comment Post Error => ", error);
            toast.error(error.response?.data?.message || "Failed to add comment");
        }
    }
    return (
        <div className="my-2 max-sm:w-[80%] max-sm:font-medium  max-w-lg p-1 mx-auto bg-gray-600 rounded-lg sm:w-11/12 md:w-3/4 lg:w-2/3">
            <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-2">
                    <img
                        className="w-8 h-8 rounded-full cursor-pointer"
                        src={post.author.profilePicture} alt={post.author.username}
                    />

                    <h1 className="text-amber-200 font-semibold">{post.author.username}</h1>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        className="p-2 rounded-full hover:bg-gray-500"
                        onClick={() => setMenuOpen((s) => !s)}
                        aria-label="menu"
                    >
                        <span className="text-2xl">⋯</span>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-gray-400 shadow-md rounded">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-500 flex items-center gap-2"
                                onClick={toggleFollow}
                            >
                                <Heart className={isFollowing ? "text-red-500 fill-pink-600" : "text-gray-700"} size={18} />
                                <span className="font-semibold text-white">{isFollowing ? "Unfollow" : "Follow"}</span>
                            </button>

                           {  // this is added as only user can delete the post which is created by him/her, so we are checking whether the user id is same as post author id or not, if it is same then only delete option will be shown in menu.
                            user._id === post.author._id && (
                                <button
                                    className="border-t border-gray-100 w-full text-left px-4 py-2 hover:bg-gray-500 flex items-center gap-2"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="text-pink-500" size={18} />
                                    <span className="font-semibold text-white">Delete</span>
                                </button>
                            )
                           }
                        </div>
                    )}
                </div>
            </div>

            <div className="p-1">
                <p>{isFollowing ? "You are following this user." : "You are not following this user."}</p>
            </div>

            <div className="rounded-lg shadow-md">
                <img onClick={() => setOpenComment(true)}
                    className="rounded-lg my-1 mx-auto max-w-md w-full max-h-[50vh] object-cover cursor-pointer"
                    src={post.image} alt={post.caption}
                />
                <CommentDialog 
                  openComment={openComment} 
                  setOpenComment={setOpenComment}
                  postAuthorId={null} // Replace with actual author ID when available
                  postAuthor={null} // Replace with actual author data when available
                />
            </div>

            <div className="flex flex-col p-1 gap-1">

                <div className="flex justify-between items-center">
                    <div className="flex  items-center gap-4">
                        <Heart onClick={() => likeDislikeHandler(post._id)} size={'22px'} className={`cursor-pointer text-white ${liked ? 'fill-pink-600 border-pink-600' : ''}`} />
                        <MessageCircle onClick={() => setOpen(!open)} 
                            size={'22px'} className="cursor-pointer text-white hover:text-cyan-400 transition" 
                        />
                        <Send size={'22px'} className="cursor-pointer text-white hover:text-green-400 transition" />
                    </div>
                    <div>
                        <Bookmark size={'22px'} className="cursor-pointer text-white fill-amber-200 hover:text-yellow-400 transition" />
                    </div>
                </div>

                <span className="text-white font-semibold text-sm">{postLike} likes</span>
                <div className=" flex flex-col text-white font-semibold">
                    <p><span className="text-orange-300">@-</span> {post.author.username}</p>
                    <p className="text-md text-red-300">{post.caption}</p>
                    <p className="text-sm text-slate-300">{comment.length} comments</p>
                </div>

                {
                    open && (
                        <>
                            <p onClick={() => setOpen(false)} className="font-semibold text-sm text-amber-200">{comment.length===0 ? "Be first to make comment..." : `View all ${comment.length} comments`}</p>
                            
                            <div className="relative">
                                <input  value={text} onChange={changeEventHandler}
                                    className="shadow-md outline-none text-xs w-full bg-slate-300 text-gray-800 placeholder:font-semibold placeholder:text-gray-600 rounded-md py-2 px-3"
                                    type="text" placeholder="add a comment..." 
                                />
                                {
                                    text && <Send  onClick={() => {commentHandler(text); setOpen(false)}} size={'22px'} className="absolute right-4 top-1 cursor-pointer text-gray-800 hover:text-amber-800 transition" />
                                }
                            </div>
                        </>
                    )
                }

            </div>

        </div>
    );
};
