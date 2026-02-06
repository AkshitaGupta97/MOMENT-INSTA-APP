import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Plus, X, Trash2 } from "lucide-react";
import Loader from "./Loader";

const Stories = () => {
  const { axios } = useAppContext();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const fileInputRef = useRef(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/story/all');
      console.log('fetchStories response:', response?.data);
      if (response.data.success) {
        setStories(response.data.stories || []);
      } else {
        setStories([]);
      }
    } catch (error) {
      console.log("Error fetching stories:", error, error.response?.data);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/v1/user/me');
      if (response.data.success) {
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.log("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchStories();
    fetchCurrentUser();
  }, [axios]);

  useEffect(() => {
    if (selectedStory) {
      const timer = setTimeout(() => {
        setSelectedStory(null);
      }, 8000); // 8 seconds
      return () => clearTimeout(timer);
    }
  }, [selectedStory]);

  const handleStoryClick = async (storyId, story) => {
    try {
      await axios.post(`/api/v1/story/${storyId}/view`);
      setSelectedStory(story);
    } catch (error) {
      console.log("Error viewing story:", error);
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const response = await axios.delete(`/api/v1/story/${storyId}`);
      if (response.data.success) {
        toast.success('Story deleted successfully!');
        setSelectedStory(null);
        fetchStories(); // Refresh the stories list
      }
    } catch (error) {
      console.log("Error deleting story:", error);
      toast.error("Failed to delete story");
    }
  };

  if (loading) {
    return <Loader />
  }

  // Group stories by author
  const groupedStories = stories.reduce((acc, story) => {
    const authorId = story.author._id;
    if (!acc[authorId]) { //Author A not present, so create: acc["A"] = {  author: "A",  stories: []};,  stories: [story1]
      acc[authorId] = {
        author: story.author,
        stories: []
      };
    }
    acc[authorId].stories.push(story);  //stories: [story1, story2]
    return acc;
  }, {});
  /* {  final output :
      A: { stories: [story1, story2] },
      B: { stories: [story3] }
    }
  */
  const storyAuthors = Object.values(groupedStories); /* convert into array -> [  {...},  {...}] */

  const handleStoryUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/v1/story/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('handleStoryUpload response:', response?.data);
      if (response.data.success) {
        toast.success('Story added successfully!');
        fetchStories(); // Refresh the stories list
        fileInputRef.current.value = ''; // Reset file input
      }
    } catch (error) {
      console.log("Error uploading story:", error);
      toast.error("Failed to add story");
    }
  }

  return (
    <div className="border-b border-gray-600 px-2 py-0">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {/* Add Story Button */}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-colors" 
              onClick={() => fileInputRef.current.click()}>
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-xs text-white text-center font-semibold w-16 truncate">Your story</span>
        </div>

        {/* Stories */}
        {storyAuthors.map((group) => (
          <div
            key={group.author._id}
            className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
            onClick={() => handleStoryClick(group.stories[0]._id, group.stories[0])}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
                <div className="w-full h-full bg-gray-800 rounded-full p-0.5">
                  <img
                    src={group.author.profilePicture || "/default-avatar.png"}
                    alt={group.author.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {/* Unviewed indicator */}
              {group.stories.some(story => !story.viewers.some(viewer => viewer._id === group.author._id)) && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>
            <span className="text-xs font-semibold text-amber-200 text-center w-16 truncate">
              {group.author.username}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-md max-h-screen p-4">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            {currentUser && selectedStory.author._id === currentUser._id && (
              <button
                onClick={() => handleDeleteStory(selectedStory._id)}
                className="absolute top-2 left-2 text-white bg-gray-600 rounded-full p-1 hover:bg-gray-700"
              >
                <Trash2 className="w-6 h-6 text-orange-500" />
              </button>
            )}
            <img
              src={selectedStory.image}
              alt="Story"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-semibold">{selectedStory.author.username}</p>
            </div>
          </div>
        </div>
      )}

      <input
        id="story-input"
        type="file"
        accept="image/*"
        onChange={handleStoryUpload}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default Stories;