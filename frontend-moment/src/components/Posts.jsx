import { useState, useRef, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, Send, Trash2 } from "lucide-react";

export const Posts = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {   //Click ⋯ → menu opens,  Click outside → menu closes

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);   // If menu exists , AND click is NOT inside menu
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleFollow = () => {
        setIsFollowing((p) => !p);
        setMenuOpen(false);
    };

    const handleDelete = () => {
        setDeleted(true);
        setMenuOpen(false);
    };

    if (deleted) {
        return (
            <div className="my-8 w-[70%] max-w-sm mx-auto bg-pink-400 rounded-lg p-4 text-gray-200">
                Post removed
            </div>
        );
    }

    return (
        <div className="my-8 w-[70%] max-w-sm p-2 mx-auto bg-gray-600 rounded-lg">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <img
                        className="w-8 h-8 rounded-full"
                        src="https://img.freepik.com/premium-photo/love-bird-logo-design-template-abstract-love-bird-logo-design-concept_1308172-107908.jpg"
                        alt=""
                    />
                    <h1>username</h1>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        className="p-2 rounded-full hover:bg-pink-400"
                        onClick={() => setMenuOpen((s) => !s)}
                        aria-label="menu"
                    >
                        <span className="text-2xl">⋯</span>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-pink-400 shadow-md rounded">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-pink-600 flex items-center gap-2"
                                onClick={toggleFollow}
                            >
                                <span>{isFollowing ? "Unfollow" : "Follow"}</span>
                            </button>

                            <button
                                className="w-full text-left px-4 py-2 hover:bg-pink-600 flex items-center gap-2 text-red-600"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3">
                <p>{isFollowing ? "You are following this user." : "You are not following this user."}</p>
            </div>

            <div className="rounded-lg shadow-md">
                <img className="rounded-md my-3 w-full aspect-square object-cover"
                    src="https://th.bing.com/th/id/OIP.84UOxylaHnK5msu2i1JECwHaE8?w=239&h=180&c=7&r=0&o=7&pid=1.7&rm=3" alt=""
                />
            </div>

            <div className="flex flex-col p-3 gap-2">

                <div className="flex justify-between items-center">
                    <div className="flex  items-center gap-4">
                        <Heart size={'22px'} className="cursor-pointer text-white fill-pink-500 hover:text-pink-400 transition" />
                        <MessageCircle size={'22px'} className="cursor-pointer text-white hover:text-cyan-400 transition" />
                        <Send size={'22px'} className="cursor-pointer text-white hover:text-green-400 transition" />
                    </div>
                    <div>
                        <Bookmark size={'22px'} className="cursor-pointer text-white hover:text-yellow-400 transition" />
                    </div>
                </div>

                <span className="text-white font-semibold text-sm">1k Likes</span>
                <div className=" flex flex-col text-white font-semibold">
                    <p >username</p>
                    <p className="font-thin">caption - This is a sample post description.</p>
                </div>
            </div>

        </div>
    );
};
