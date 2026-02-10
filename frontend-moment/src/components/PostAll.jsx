import { useSelector } from "react-redux"
import { Posts } from "./Posts";

const PostAll = () => {
    const {posts} = useSelector(store=> store.post);
    console.log("message from PostAll.jsx", posts)
  return (
    <div>
        {
            posts.map((post) => <Posts key={post._id} post={post} /> )
        }
    </div>
  )
}

export default PostAll