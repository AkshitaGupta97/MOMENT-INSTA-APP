import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
    const { suggestedUser } = useSelector((state) => state.auth);

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-amber-300 font-semibold text-lg mb-2">Suggested Users</h2>
                <span className=" cursor-pointer font-semibold">See All</span>
            </div>

            {
                suggestedUser?.map((user) => {
                    return (
                        <div key={user._id} className="flex overflow-y-auto items-center justify-around mb-3 gap-4">

                            <Link
                                to={`/profile/${user?._id}`}
                                className="flex items-center gap-2 hover:bg-gray-600 p-2 rounded-lg transition-colors duration-200 ease-in-out flex-1"
                            >
                                <img
                                    src={user.profilePicture || user.image || null}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                />

                                <div>
                                    <h3 className="text-sm font-semibold text-amber-200">
                                        {user.username}
                                    </h3>
                                    <span className="text-xs text-gray-400">
                                        {user.bio || 'Bio here...'}
                                    </span>
                                </div>
                            </Link>

                            <button className="text-sm text-blue-500 font-semibold whitespace-nowrap">
                                Follow
                            </button>

                        </div>

                    )
                })
            }

        </div>
    )
}

export default SuggestedUser;