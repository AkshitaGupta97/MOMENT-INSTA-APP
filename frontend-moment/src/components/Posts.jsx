import { useState, useRef, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import CommentDialog from "./CommentDialog";

export const Posts = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const menuRef = useRef(null);

    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [openComment, setComment] = useState(false);

    const changeEventHandler = (e) => {
        // remove extra space
        const inputText = e.target.value;
        if(inputText.trim()){  // if we are removing white space then we add it to setText
            setText(inputText);
        }
        else {
            setText('');
        }

    }

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
            <div className="my-8 w-full max-w-md mx-auto bg-pink-400 rounded-lg p-4 text-gray-200">
                Post removed
            </div>
        );
    }

    return (
        <div className="my-2  max-w-lg p-1 mx-auto bg-gray-600 rounded-lg sm:w-11/12 md:w-3/4 lg:w-2/3">
            <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-2">
                    <img
                        className="w-8 h-8 rounded-full cursor-pointer"
                        src="https://img.freepik.com/premium-photo/love-bird-logo-design-template-abstract-love-bird-logo-design-concept_1308172-107908.jpg"
                        alt=""
                    />

                    <h1 className="text-amber-200 font-semibold">username</h1>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        className="p-2 rounded-full hover:bg-gray-500"
                        onClick={() => setMenuOpen((s) => !s)}
                        aria-label="menu"
                    >
                        <span className="text-2xl">⋯</span>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-gray-400 shadow-md rounded">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-500 flex items-center gap-2"
                                onClick={toggleFollow}
                            >
                                <Heart className={isFollowing ? "text-red-500 fill-pink-600" : "text-gray-700"} size={18} />
                                <span className="font-semibold text-white">{isFollowing ? "Unfollow" : "Follow"}</span>
                            </button>

                            <button
                                className="border-t border-gray-100 w-full text-left px-4 py-2 hover:bg-gray-500 flex items-center gap-2"
                                onClick={handleDelete}
                            >
                                <Trash2 className="text-pink-500" size={18} />
                                <span className="font-semibold text-white">Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-1">
                <p>{isFollowing ? "You are following this user." : "You are not following this user."}</p>
            </div>

            <div className="rounded-lg shadow-md">
                <img onClick={() => setComment(true)}
                    className="rounded-lg my-1 mx-auto max-w-md w-full max-h-[50vh] object-cover cursor-pointer"
                    src="https://th.bing.com/th/id/OIP.84UOxylaHnK5msu2i1JECwHaE8?w=239&h=180&c=7&r=0&o=7&pid=1.7&rm=3" alt=""
                />
                <CommentDialog 
                  openComment={openComment} 
                  setComment={setComment}
                  postAuthorId={null} // Replace with actual author ID when available
                  postAuthor={null} // Replace with actual author data when available
                />
            </div>

            <div className="flex flex-col p-1 gap-1">

                <div className="flex justify-between items-center">
                    <div className="flex  items-center gap-4">
                        <Heart size={'22px'} className="cursor-pointer text-white fill-pink-500 hover:text-pink-400 transition" />
                        <MessageCircle onClick={() => setOpen(!open)} 
                            size={'22px'} className="cursor-pointer text-white hover:text-cyan-400 transition" 
                        />
                        <Send size={'22px'} className="cursor-pointer text-white hover:text-green-400 transition" />
                    </div>
                    <div>
                        <Bookmark size={'22px'} className="cursor-pointer text-white fill-amber-200 hover:text-yellow-400 transition" />
                    </div>
                </div>

                <span className="text-white font-semibold text-sm">1k Likes</span>
                <div className=" flex flex-col text-white font-semibold">
                    <p >username</p>
                    <p className="text-sm">caption - This is a sample post description.</p>
                </div>

                {
                    open && (
                        <>
                            <p onClick={() => setOpen(false)} className="font-semibold text-sm text-amber-200">View all comments...</p>
                            
                            <div className="relative">
                                <input  value={text} onChange={changeEventHandler}
                                    className="shadow-md outline-none text-xs w-full bg-slate-300 text-gray-800 placeholder:font-semibold placeholder:text-gray-800 rounded-md py-2 px-3"
                                    type="text" placeholder="add a comment..." 
                                />
                                {
                                    text && <Send onClick={() => setOpen(false)}  size={'22px'} className="absolute right-4 top-1 cursor-pointer text-gray-800 hover:text-amber-800 transition" />
                                }
                            </div>
                        </>
                    )
                }

            </div>

        </div>
    );
};
