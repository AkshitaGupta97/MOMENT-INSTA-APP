import Posts from "./Posts";
import Stories from "./Stories";

const Feed = () => {
  return (
    <div className="flex-1 my-8 flex flex-col items-center md:pl-64 pl-4 pr-4">
        <div className="w-full max-w-2xl">
          <Stories />
          <Posts />
        </div>
    </div>
  )
}

export default Feed