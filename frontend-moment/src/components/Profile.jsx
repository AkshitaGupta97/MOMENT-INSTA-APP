import { Link, useParams } from "react-router-dom";
import UseGetUserProfile from "../hooks/UseGetUserProfile"
import { useSelector } from "react-redux";
import { useState } from "react";
import { Heart, MessageCircle } from 'lucide-react';

const Profile = () => {

  const params = useParams();
  const userId = params.id;

  UseGetUserProfile(userId);

  const { userProfile, user } = useSelector(store => store.auth);

  // console.log("from profile", userProfile);

  const isFollowing = false;
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const [activeTab, setActiveTab] = useState('posts');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  // console.log('Displayed posts is ', displayedPost);

  return (
    <div className="flex max-w-3xl max-sm:w-[100%] flex-col justify-center mx-auto pl-10">

      <div className="flex my-8  gap-20 items-center justify-around ">

        <div className='flex flex-col items-left justify-center '>
          <img className="w-20 h-20 max-sm:w-16 max-sm:h-16 rounded-full border border-amber-200 p-1" src={userProfile?.profilePicture || null} alt={userProfile?.profilePicture} />
          <p className="text-amber-200 text-xl max-sm:text-md font-semibold">{userProfile?.username}</p>
          <p className="font-semibold text-green-300 text-sm">{userProfile?.bio || 'Bio here...'}</p>
          <p className="font-semibold bg-slate-500 cursor-pointer rounded px-2 py-1 text-center text-orange-200 text-sm">@-{userProfile?.username}</p>
        </div>

        <div className="flex flex-col gap-5">

          <div className="flex items-center gap-2 ">
            <p className="text-white text-xl max-sm:text-md max-sm:text-sm font-semibold">{userProfile?.username}</p>
            {
              isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <button className="bg-slate-600 text-center rounded h-8 font-semibold max-sm:text-xs text-sm hover:bg-slate-500 px-2 py-1">Edit </button>
                  </Link>
                  <button className="bg-slate-600 text-center rounded h-8 font-semibold max-sm:text-xs text-sm hover:bg-slate-500 px-2 py-1">View </button>
                  {/*<button className="bg-slate-600 text-center rounded h-8 font-semibold max-sm:text-xs text-sm hover:bg-slate-500 px-2 py-1">Tools</button> */}
                </>
              ) : (
                isFollowing ? (
                  <>
                    <button className="bg-[#0095F6] text-center rounded h-8 max-sm:text-xs font-semibold text-sm hover:bg-[#0377c4] px-2 py-1">Unfollow</button>
                    <button className="bg-slate-600  text-center rounded h-8 mmax-sm:text-xs font-semibold text-sm hover:bg-slate-500 px-2 py-1">Messsage</button>
                  </>

                ) : (<button className="bg-[#0095F6] text-center rounded h-8 font-semibold text-sm hover:bg-[#0377c4] px-2 py-1">Follow</button>)
              )
            }
          </div>

          <div className="font-semibold max-sm:text-xs max-lg:text-sm max-md:text-sm flex flex-col items-center gap-4">
            <div className="flex justify-center items-center gap-6">
              <p>{userProfile?.posts.length} <span className="">posts</span></p>
              <p>{userProfile?.followers.length} <span className="">followers</span></p>
              <p>{userProfile?.following.length} <span className="">following</span></p>
            </div>

            <div className="text-slate-300">
              <p>✨ Fresh profile, fresh vibes 😄</p>
              <p>📸 New picture, same energy 💫</p>
              <p>🚀 Updating life one step at a time</p>
              <p>💛 Keep growing, keep shining</p>
              <p>🔥 New look unlocked!</p>
            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-t-gray-200">
        <div className="flex items-center justify-center max-sm:text-sm font-semibold gap-10">
          <span onClick={() => handleTabChange('posts')}
            className={`py-3 cursor-pointer  ${activeTab === 'posts' ? 'bg-slate-500 rounded px-1 py-0 text-center' : ''}`}>
            POST
          </span>
          <span onClick={() => handleTabChange('saved')}
            className={`py-3 cursor-pointer   ${activeTab === 'saved' ? 'bg-slate-500 rounded px-1 py-0 text-center' : ''}`}>
            SAVED
          </span>
          <span className="py-3 cursor-pointer ">
            REELS
          </span>
          <span className="py-3 cursor-pointer">
            TAGS
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {displayedPost?.length > 0 ? (
            displayedPost.map((post) => (
              <div key={post?._id} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  alt={post.username}
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4 font-semibold">
                    <button className="flex items-center gap-2 bg-slate-800 px-1 rounded hover:text-gray-300">
                      <Heart size={28} fill="crimson" className="text-pink-600" />
                      <span>{post?.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 bg-slate-800 px-1 rounded hover:text-gray-300">
                      <MessageCircle size={28} className="text-amber-300" />
                      <span>{post?.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center font-semibold col-span-3 text-gray-400 py-10">
              No posts available
            </p>
          )}
        </div>

      </div>

    </div>
  )
}

export default Profile