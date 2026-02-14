import { useParams } from "react-router-dom";
import UseGetUserProfile from "../hooks/UseGetUserProfile"
import { useSelector } from "react-redux";
import { useState } from "react";
import {Heart, MessageCircle} from 'lucide-react';

const Profile = () => {

  const params = useParams();
  const userId = params.id;

  UseGetUserProfile(userId);

  const { userProfile } = useSelector(store => store.auth);

  console.log("from profile", userProfile);

  const isFollowing = true;
  const isLoggedInUserProfile = false;

  const [activeTab, setActiveTab] = useState('posts');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  console.log('Displayed posts is ', displayedPost);

  return (
    <div className="flex max-w-3xl max-sm:w-[100%] flex-col justify-center mx-auto pl-10">

      <div className="flex my-8  gap-20 items-center justify-around ">

        <div className='flex flex-col items-left justify-center '>
          <img className="w-16 h-16 max-sm:w-12 max-sm:h-12 rounded-full border border-amber-200 p-2" src={userProfile?.profilePicture || null} alt={userProfile?.profilePicture} />
          <p className="text-amber-200 text-xl max-sm:text-md font-semibold">{userProfile?.username}</p>
          <p className="font-semibold text-sm">{userProfile?.bio || 'Bio here...'}</p>
          <p className="font-semibold bg-slate-500 cursor-pointer rounded px-2 py-1 text-center text-orange-200 text-sm">@-{userProfile.username}</p>
        </div>

        <div className="flex flex-col gap-5">

          <div className="flex items-center gap-2 ">
            <p className="text-white text-xl max-sm:text-md max-sm:text-sm font-semibold">{userProfile?.username}</p>
            {
              isLoggedInUserProfile ? (
                <>
                  <button className="bg-slate-600 text-center rounded h-8 font-semibold max-sm:text-sm text-sm hover:bg-slate-500 px-2 py-1">Edit Profile </button>
                  <button className="bg-slate-600 text-center rounded h-8 font-semibold max-sm:text-sm text-sm hover:bg-slate-500 px-2 py-1">View </button>
                  <button className="bg-slate-600 text-center rounded h-8 font-semibold max-sm:text-sm text-sm hover:bg-slate-500 px-2 py-1">Ad tools</button>
                </>
              ) : (
                isFollowing ? (
                  <>
                    <button className="bg-[#0095F6] text-center rounded h-8 max-sm:text-sm font-semibold text-sm hover:bg-[#0377c4] px-2 py-1">Unfollow</button>
                    <button className="bg-slate-600  text-center rounded h-8 mmax-sm:text-sm font-semibold text-sm hover:bg-slate-500 px-2 py-1">Messsage</button>
                  </>

                ) : (<button className="bg-[#0095F6] text-center rounded h-8 font-semibold text-sm hover:bg-[#0377c4] px-2 py-1">Follow</button>)
              )
            }
          </div>

          <div className="font-semibold max-sm:text-sm flex items-center gap-4">
            <p>{userProfile?.posts.length} <span className="">posts</span></p>
            <p>{userProfile?.followers.length} <span className="">followers</span></p>
            <p>{userProfile?.following.length} <span className="">following</span></p>
            
          </div>

        </div>

      </div>
      
      <div className="border-t border-t-gray-200">
        <div className="flex items-center justify-center max-sm:text-sm font-semibold gap-10">
          <span onClick={() => handleTabChange('posts')}
            className={`py-3 cursor-pointer  ${activeTab==='posts' ? 'bg-slate-500 rounded px-1 py-0 text-center' : ''}`}>
            POST 
          </span>
          <span onClick={() => handleTabChange('saved')}
            className={`py-3 cursor-pointer   ${activeTab==='saved' ? 'bg-slate-500 rounded px-1 py-0 text-center' : ''}`}>
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
          {
            displayedPost.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img src={post.image} alt={post.username} className="rounded-sm my-2 w-full aspect-square object-cover" />

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4 font-semibold">
                      <button className="flex items-center gap-2 bg-slate-800 px-1 rounded hover:text-gray-300">
                        <Heart size={28} fill="crimson" className="text-pink-600" />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 bg-slate-800 px-1 rounded hover:text-gray-300">
                        <MessageCircle size={28} className="text-amber-300" />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>

                </div>
              )
            })
          }
        </div>

      </div>


    </div>
  )
}

export default Profile