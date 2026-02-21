import { useRef, useState } from "react";
import { readFileAsDataURL } from "../utils/helpUtils";
import Loader from './Loader'
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const CreatePost = ({ iscreateOpen, setiscreateOpen }) => {

    const { user } = useSelector(store => store.auth);

    const { axios } = useAppContext();
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post);

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');
    const [caption, setCaption] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const imageRef = useRef();
    const fileChangeHandler = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            const dataURL = await readFileAsDataURL(selectedFile);  // or you can use URL.createObjectURL(selectedFile) for preview without reading the file content
            setImagePreview(dataURL);

        }
    }

    const createPostHandler = async (e) => {
        const formData = new FormData();
        formData.append('caption', caption);
        if (imagePreview) {
            formData.append('image', file);
        }
        // Logic to create a post goes here
        try {
            setLoading(true);
            const response = await axios.post('/api/v1/post/addpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  //This request contains a file.
                }
            });
            if (response.data.success) {
                dispatch(setPosts([response.data.post, ...posts])); // old post is there and new post is added to it
                toast.success(response.data.message);
                setCaption('');
                setImagePreview('');
                setFile('');
                setiscreateOpen(false);
            }
            //  console.log(response, response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className={`${iscreateOpen ? "block" : "hidden"} fixed inset-0 flex justify-center items-center z-50`}
        >
            <div
                className="
                    absolute w-[40%] max-sm:w-[95%] max-sm:h-[85vh] max-sm:overflow-y-auto max-sm:p-3
                    max-sm:left-1/2 max-sm:-translate-x-1/2 left-1/2 -translate-x-1/2  top-16
                    border  border-amber-300  bg-gray-700 p-6 rounded-lg shadow-lg
                "
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="font-bold max-sm:font-medium text-white border-b border-amber-300 mb-2 text-xl">
                        Create Post
                    </div>
                    <button
                        onClick={() => setiscreateOpen(!iscreateOpen)}
                        className="active:scale-95 text-amber-300 px-2 py-1 max-sm:text-lg text-2xl rounded-lg shadow-lg"
                    >
                        X
                    </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-2">
                    <img
                        className="w-8 h-8 rounded-full cursor-pointer"
                        src={user?.profilePicture || null}
                        alt={user?.username}
                    />
                    <h1 className="text-amber-200 max-sm:font-medium font-semibold">
                        {user?.username}
                    </h1>
                </div>

                {/* Body */}
                <div className="mt-4">
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
                        placeholder="Write your Caption"
                        rows="4"
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-full h-52 object-cover rounded-lg"
                        />
                    )}

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        className="mt-1 hidden"
                        ref={imageRef}
                        onChange={fileChangeHandler}
                    />

                    {/* Select Button */}
                    <button
                        onClick={() => imageRef.current.click()}
                        className="mt-2 max-sm:font-medium bg-blue-600 font-semibold text-white w-full flex justify-center items-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Select for Post
                    </button>

                    {/* Post Button */}
                    {imagePreview &&
                        (loading ? (
                            <Loader />
                        ) : (
                            <button
                                onClick={createPostHandler}
                                type="submit"
                                className="bg-gray-950 active:scale-90 hover:bg-gray-900 text-white rounded-md shadow-xl w-full font-semibold py-2 mt-2"
                            >
                                Post
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default CreatePost