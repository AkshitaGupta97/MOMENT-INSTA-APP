import { Posts } from "./Posts";
import Stories from "./Stories";

const Feed = () => {
  return (
    <div className="flex-1 flex flex-col items-center md:pl-64 pl-4 pr-4 h-screen">
      {/* Fixed Stories Section */}
      <div className="w-full max-w-2xl pt-8 flex-shrink-0">
        <Stories />
      </div>

      {/* Scrollable Posts Section */}
      <div className="w-full max-w-2xl flex-1 overflow-y-auto">
        <Posts />
      </div>
    </div>
  );
};

export default Feed