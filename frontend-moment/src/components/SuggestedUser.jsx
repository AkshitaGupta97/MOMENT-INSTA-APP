import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
    const { suggestedUser } = useSelector((state) => state.auth);

    return (
        <div className="flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between max-lg:text-sm font-semibold mb-3">
                <h2 className="text-amber-300 text-md mb-2">
                    Suggested Users
                </h2>
                <span className="cursor-pointer">
                    See All
                </span>
            </div>

            {/* Only list scrolls */}
            <div className="max-h-[60vh] border-t border-slate-200 rounded-sm p-4  overflow-y-auto pr-1">
                {suggestedUser?.map((user) => (
                    <div key={user._id} className="flex items-center mb-3">

                        <Link
                            to={`/profile/${user?._id}`}
                            className="flex items-center gap-3 hover:bg-gray-600 p-2 rounded-lg flex-1"
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

                        <button className="text-sm text-blue-500 font-semibold ml-3 whitespace-nowrap">
                            Follow
                        </button>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default SuggestedUser;
