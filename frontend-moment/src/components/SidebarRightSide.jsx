import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const SidebarRightSide = ({ showOnMobile = false }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div
      className={`border-l border-amber-300 flex flex-col gap-4 p-4 overflow-y-auto ${showOnMobile ? "flex w-full" : "hidden md:flex md:w-1/4"}`}
    >

      <Link to={`/profile/${user?._id}`} className="flex items-center gap-2 hover:bg-gray-600 p-2 rounded-lg transition-colors duration-200 ease-in-out">
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8 rounded-full border-amber-300 border p-1 object-cover "
            src={user?.profilePicture || user?.image || null}
            alt={user?.username}
          />
          <h1 className="text-amber-200 font-semibold">
            {user?.username} {user?._id === user?._id && <span className="text-xs text-gray-200">(you💖)</span>}
          </h1>
          <span className="text-slate-400 font-semibold text-xs">{'||'} {user?.bio || 'Bio here...'}</span>
        </div>
      </Link>

      <SuggestedUser />

    </div>
  )
}

export default SidebarRightSide