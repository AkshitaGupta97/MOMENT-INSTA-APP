import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

const Posts = () => {
  const { axios } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await axios.get('/api/v1/user/me');
        if (userResponse.data.success) {
          setCurrentUser(userResponse.data.user);
        }

        // Fetch posts
        const postsResponse = await axios.get('/api/v1/post/all');
        if (postsResponse.data.success) {
          setPosts(postsResponse.data.post);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axios]);

  const handleFollowUnfollow = async (userId) => {
    try {
      const response = await axios.post(`/api/v1/user/followunfollow/${userId}`);
      if (response.data.success || response.data.status) {
        toast.success(response.data.message);
        // Update current user's following list
        if (currentUser) {
          const isFollowing = currentUser.following.includes(userId);
          const updatedFollowing = isFollowing
            ? currentUser.following.filter(id => id !== userId)
            : [...currentUser.following, userId];
          setCurrentUser({ ...currentUser, following: updatedFollowing });
        }
      }
    } catch (error) {
      console.log("Error following/unfollowing:", error);
      toast.error("Failed to follow/unfollow");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {posts.length === 0 ? (
        <div className="text-white text-center">No posts yet...</div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg mb-6 shadow-lg overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <img
                  src={post.author?.profilePicture || "/default-avatar.png"}
                  alt={post.author?.username}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="text-white font-semibold text-sm">{post.author?.username}</span>
              </div>
              {post.author?._id !== currentUser?._id && (
                <button
                  onClick={() => handleFollowUnfollow(post.author._id)}
                  className={`px-4 py-1 rounded-full text-xs font-semibold ${
                    currentUser?.following?.includes(post.author._id)
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition-colors`}
                >
                  {currentUser?.following?.includes(post.author._id) ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Post Image */}
            <img
              src={post.image}
              alt="Post"
              className="w-full aspect-square object-cover"
            />

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <Heart className="w-6 h-6 text-white cursor-pointer hover:text-red-500 transition-colors" />
                  <MessageCircle className="w-6 h-6 text-white cursor-pointer hover:text-blue-500 transition-colors" />
                  <Send className="w-6 h-6 text-white cursor-pointer hover:text-green-500 transition-colors" />
                </div>
                <Bookmark className="w-6 h-6 text-white cursor-pointer hover:text-yellow-500 fill-current transition-colors" />
              </div>

              {/* Likes count (placeholder) */}
              <div className="text-white font-semibold text-sm mb-2">
                {Math.floor(Math.random() * 1000) + 1} likes
              </div>

              {/* Caption */}
              <div className="text-white text-sm mb-2">
                <span className="font-semibold mr-2">{post.author?.username}</span>
                {post.caption}
              </div>

              {/* Comments count */}
              <div className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                View all {post.comments?.length || 0} comments
              </div>

              {/* Add comment input (placeholder) */}
              <div className="flex items-center mt-3 border-t border-gray-600 pt-3">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
                <button className="text-blue-500 text-sm font-semibold ml-2">Post</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;