import { useParams } from "react-router-dom";
import UseGetUserProfile from "../hooks/UseGetUserProfile"
import { useSelector } from "react-redux";

const Profile = () => {
 
  const params = useParams();
  const userId = params.id;

  UseGetUserProfile(userId);

  const {userProfile} = useSelector(store => store.auth);

  console.log("from profile", userProfile)

  return (
    <div className="flex-1 my-8 flex flex-col items-center md:pl-64 pl-4 pr-4">
      <div className="w-full max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 shadow-lg">
        <h1 className="text-white text-2xl font-bold mb-4">Profile</h1>
        <p className="text-gray-300">Profile page content goes here.</p>
      </div>
    </div>
  )
}

export default Profile