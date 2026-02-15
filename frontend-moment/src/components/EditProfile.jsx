import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useAppContext } from "../context/AppContext";
import { toast } from 'react-toastify';
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";

export const EditProfile = () => {

    const { user } = useSelector(store => store.auth);
    const imageRef = useRef();

    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {axios} = useAppContext();

    const fileChangeHandler = (e) => {
        const file = e.target.value;
        if(file) setInput({...input, profilePhoto:file});
    }

    const selectGenderHandler = (e) => {
        setInput({...input, gender:e.target.value});
    }

    const editProfileHandler = async() => {
        console.log("edithandler in editProfile", input);

        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if(input.profilePhoto){
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const response = await axios.post('/api/user/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart.form-data'
                }
            });
            if(response.data.success){
                const updatedUserData = {
                    ...user,
                    bio: response.data.user?.bio,
                    profilePicture: response.data.user?.profilePicture,
                    gender: response.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`)
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error);
            console.log("error from edit profile", error);
        } finally{
            setLoading(false);
        }
        
    }

    return (
        <div className="p-4">
            <h1 className="font-bold max-sm:font-semibold text-yellow-400 text-xl">Edit Profile</h1>

            <section className="p-6">

                <div className="flex font-semibold max-sm:text-sm items-center justify-between gap-2 bg-slate-500 p-2 rounded-xl ">

                    <div className="flex items-center gap-2">
                        <img
                            className="w-12 h-12 rounded-full border-amber-300 border p-1 object-cover "
                            src={user?.profilePicture || user?.image || null}
                            alt={user?.username}
                        />
                        <h1 className="text-amber-200">
                            {user?.username} {user?._id === user?._id && <span className="text-xs text-gray-200">(you💖)</span>}
                        </h1>
                        <span className="text-slate-300 text-xs">{'||'} {user?.bio || 'Bio here...'}</span>
                    </div>
                        
                    <input onChange={fileChangeHandler} type="file" className="hidden" ref={imageRef}  />
                    <button onClick={() => imageRef.current.click()} className="bg-purple-700 shadow-lg rounded-md hover:scale-95 text-white px-2 py-1">Change Photo</button>

                </div>

                <div className="font-semibold m-2 max-w-md">
                    <label className="text-gray-200 text-lg">Bio</label>
                    <textarea value={input.bio} onChange={(e) => setInput({...input, bio:e.target.value})} name="bio" placeholder="type here..." rows='4'
                        className=" text-sm w-full bg-gray-800 backdrop-blur-md text-gray-200 placeholder-gray-400 rounded-lg p-2 transition-all focus:outline-none focus:ring focus:ring-amber-300 border-1 hover:border-amber-300 shadow-lg"
                    />
                </div>

                <div className="w-full max-w-md space-y-3">
                    <h1 className="font-bold text-lg text-gray-200 tracking-wide">Gender</h1>
                    <select value={input.gender} onChange={selectGenderHandler} name="gender" className="w-full bg-gray-600 text-gray-200 border border-gray-200 rounded-lg p-3 text-sm font-semibold shadow-lg transition-all focus:outline-none cursor-pointer" >
                        <option value="">Select-Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="mt-4 flex items-right">
                    {
                        loading ? (
                            <button className="font-semibold bg-gray-500 px-4 py-2 active:scale-95 hover:scale-95 rounded-lg shadow-lg"> <Loader className="mr-2 h-4 animate-spin" /> Please wait</button>
                        ) : (
                            <button onClick={editProfileHandler} className="font-semibold bg-blue-500 px-4 py-2 active:scale-95 hover:scale-95 rounded-lg shadow-lg">Submit</button>
                        )
                    }
                    
                </div>




            </section>

        </div>
    )
}
