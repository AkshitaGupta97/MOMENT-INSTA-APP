import { useState } from "react";
import { useSelector } from "react-redux";

import CommentDialog from "./CommentDialog";
import { Posts } from "./Posts";

const PostAll = () => {

  // getting all posts from redux store
  const { posts } = useSelector(store => store.post);

  // state to open comment dialog
  const [openComment, setOpenComment] = useState(false);

  return (
    <>
      {/* mapping all posts */}
      {posts.map((post) => (
        <Posts
          key={post._id}
          post={post}
          setOpenComment={setOpenComment}
        />
      ))}

      {/* single comment dialog */}
      <CommentDialog
        openComment={openComment}
        setOpenComment={setOpenComment}
      />
    </>
  );
};

export default PostAll;
