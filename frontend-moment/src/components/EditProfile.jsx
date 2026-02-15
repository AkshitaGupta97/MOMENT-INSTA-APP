import { useRef } from "react";
import { useSelector } from "react-redux"

export const EditProfile = () => {

    const { user } = useSelector(store => store.auth);
    const imageRef = useRef();

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
                        
                    <input type="file" className="hidden" ref={imageRef}  />
                    <button onClick={() => imageRef.current.click()} className="bg-purple-700 rounded-md hover:scale-95 text-white px-2 py-1">Change Photo</button>
                </div>

                <div className="font-semibold m-2 max-w-md">
                    <label className="text-gray-200 text-lg">Bio</label>
                    <textarea name="bio" placeholder="type here..." rows='4'
                        className=" text-sm w-full bg-gray-800 backdrop-blur-md text-gray-200 placeholder-gray-400 rounded-lg p-2 transition-all focus:outline-none focus:ring focus:ring-amber-300 border-1 hover:border-amber-300 shadow-lg"
                    />
                </div>

                <div className="w-full max-w-md space-y-3">
                    <h1 className="font-bold text-lg text-gray-200 tracking-wide">Gender</h1>
                    <select name="gender" className="w-full bg-gray-600 text-gray-200 border border-gray-200 rounded-lg p-3 text-sm font-semibold shadow-lg transition-all focus:outline-none cursor-pointer" >
                        <option value="">Select-Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                </div>



            </section>

        </div>
    )
}
