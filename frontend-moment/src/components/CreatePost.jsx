import { useRef, useState } from "react";
import { readFileAsDataURL } from "../utils/helpUtils";
import Loader from './Loader'
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const CreatePost = ({ iscreateOpen, setiscreateOpen }) => {

    const {user} = useSelector(store => store.auth);

    const {axios} = useAppContext();
    const dispatch = useDispatch();
    const {posts} = useSelector(store => store.post);

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
        if(imagePreview) {
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
            if(response.data.success){
                dispatch(setPosts([response.data.post, ...posts])); // old post is there and new post is added to it
                toast.success(response.data.message);
                setCaption('');
                setImagePreview('');
                setFile('');
                setiscreateOpen(false);
            }
            console.log(response, response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post");
        } finally{
            setLoading(false);
        }
    }
    
    return (
        <div className={`${iscreateOpen ? "block" : "hidden"} fixed w-[40%] max-sm:w-[80%]  inset-0 flex justify-center items-center z-50`}>

            <div className="absolute  max-sm:h-[84%] max-sm:p-2 max-sm:w-full max-sm:left-10 left-1/2 ml-4 top-16 border border-amber-300 bg-gray-700 p-6 rounded-lg shadow-lg w-full">

                <div className="  flex justify-between items-center  ">
                    <div className={`font-bold max-sm:font-medium text-white border-b border-spacing-1 border-amber-300 mb-2 text-xl`}>Create Post</div>
                    <button onClick={() => setiscreateOpen(!iscreateOpen)} className=" active:scale-95 text-amber-300 px-2 py-1 max-sm:text-lg max-sm:ml-4 text-2xl rounded-lg shadow-lg"> X </button>
                </div>
                <div className="flex items-center gap-2">
                    <img
                        className="w-8 h-8 rounded-full cursor-pointer"
                        src={user.profilePicture} alt={user.username}
                    />
                    <h1 className="text-amber-200 max-sm:font-medium font-semibold">{user.username}</h1>
                </div>

                <div className="mt-4">
                    <textarea value={caption} onChange={(e) => setCaption(e.target.value)} name="" id="" className="w-full bg-gray-800 text-white p-2 rounded-lg  focus:outline-none" placeholder="Write your Caption" rows="4"/>
                    {
                        imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-52 flex items-center justify-center object-cover rounded-lg" />
                    }
                    <input type="file" className="mt-1 hidden" ref={imageRef} onChange={fileChangeHandler} />
                    <button onClick={()=> imageRef.current.click()}
                        className="mt-2 max-sm:font-medium bg-blue-600 font-semibold text-white text-center flex justify-center items-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Select for Post
                    </button>
                    {
                        imagePreview && (
                            loading ? (
                                <Loader />
                            ) : (
                                <button onClick={createPostHandler} type="submit" className="bg-gray-950 active:scale-90 hover:bg-gray-900 text-white rounded-md shadow-xl w-full font-semibold py-2 mt-1">Post</button>
                            )
                        )
                    }
                </div>

            </div>

        </div>
    )
}

export default CreatePost