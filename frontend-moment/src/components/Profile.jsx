import { useParams } from "react-router-dom";
import UseGetUserProfile from "../hooks/UseGetUserProfile"
import { useSelector } from "react-redux";

const Profile = () => {

  const params = useParams();
  const userId = params.id;

  UseGetUserProfile(userId);

  const { userProfile } = useSelector(store => store.auth);

  console.log("from profile", userProfile);

  return (
    <div className="flex my-8  gap-20 items-center justify-center ">

      <div className='flex flex-col '>
        <img className="w-16 h-16 rounded-full border border-amber-200 p-2" src={userProfile?.profilePicture || null} alt={userProfile?.profilePicture} />
        <p className="text-amber-200 font-semibold">{userProfile?.username}</p>
      </div>

      <div className="flex flex-col gap-5">

        <div className="flex items-center gap-2">
          <p className="text-white text-xl font-semibold">{userProfile?.username}</p>
          <>
            <button className="bg-slate-600 text-center rounded h-8 font-semibold text-sm hover:bg-slate-500 px-2 py-1">Edit Profile </button>
            <button className="bg-slate-600 text-center rounded h-8 font-semibold text-sm hover:bg-slate-500 px-2 py-1">View </button>
            <button className="bg-slate-600 text-center rounded h-8 font-semibold text-sm hover:bg-slate-500 px-2 py-1">Add tools</button>
          </>
        </div>


      </div>

    </div>
  )
}

export default Profile